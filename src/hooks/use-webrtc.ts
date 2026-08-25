import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export function useWebRTC(roomId: string | null) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    let isActive = true;

    if (!roomId) {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      setRemoteStream(null);
      return;
    }

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!isActive) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        activeStream = stream;
        setLocalStream(stream);

        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.ontrack = (event) => {
          setRemoteStream(event.streams[0] || null);
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            channelRef.current?.send({
              type: "broadcast",
              event: "ice-candidate",
              payload: { candidate: event.candidate },
            });
          }
        };

        const channel = supabase.channel(`webrtc-${roomId}`);
        channelRef.current = channel;

        channel
          .on("broadcast", { event: "offer" }, async ({ payload }) => {
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(payload.offer));
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);
            channel.send({
              type: "broadcast",
              event: "answer",
              payload: { answer },
            });
          })
          .on("broadcast", { event: "answer" }, async ({ payload }) => {
            if (!pcRef.current) return;
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
          })
          .on("broadcast", { event: "ice-candidate" }, async ({ payload }) => {
            if (!pcRef.current) return;
            await pcRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
          })
          .subscribe();
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    init();

    return () => {
      isActive = false;
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [roomId]);

  const startCall = async () => {
    if (!pcRef.current || !channelRef.current) return;
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);
    channelRef.current.send({
      type: "broadcast",
      event: "offer",
      payload: { offer },
    });
  };

  return { localStream, remoteStream, startCall };
}
