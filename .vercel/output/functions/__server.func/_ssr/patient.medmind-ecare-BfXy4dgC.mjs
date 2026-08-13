import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { n as supabase } from "./supabase-CAKutjCx.mjs";
import { B as MessageSquare, C as Send, M as PhoneOff, N as PhoneCall, Ot as ArrowLeft, R as Mic, _ as Stethoscope, _t as Calendar, a as Volume2, d as UserCheck, i as VolumeX, v as Star, y as Sparkles, z as MicOff } from "../_libs/lucide-react.mjs";
import { a as CardHeader, o as CardTitle, t as Card } from "./card-BfBj_YIE.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as doctorService } from "./doctor.service-B1G2HOCZ.mjs";
import { i as consultPsychologist, o as transcribeAudio } from "./ai.service-dWsWhT0F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.medmind-ecare-BfXy4dgC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MedMindECare() {
	const [selectedDoctor, setSelectedDoctor] = (0, import_react.useState)(null);
	const [mode, setMode] = (0, import_react.useState)("live-call");
	const [messages, setMessages] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)("");
	const [isListening, setIsListening] = (0, import_react.useState)(false);
	const [isSpeaking, setIsSpeaking] = (0, import_react.useState)(false);
	const [isBusy, setIsBusy] = (0, import_react.useState)(false);
	const [isTranscribing, setIsTranscribing] = (0, import_react.useState)(false);
	const [soundEnabled, setSoundEnabled] = (0, import_react.useState)(true);
	const [speechError, setSpeechError] = (0, import_react.useState)(null);
	const [recommendedPsychiatrists, setRecommendedPsychiatrists] = (0, import_react.useState)([]);
	const [isAuthenticated, setIsAuthenticated] = (0, import_react.useState)(null);
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const audioChunksRef = (0, import_react.useRef)([]);
	const synthRef = (0, import_react.useRef)(null);
	const audioPlayerRef = (0, import_react.useRef)(null);
	const endRef = (0, import_react.useRef)(null);
	const isLiveActiveRef = (0, import_react.useRef)(false);
	const messagesRef = (0, import_react.useRef)([]);
	messagesRef.current = messages;
	const speechDetectedRef = (0, import_react.useRef)(false);
	const animFrameRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		async function checkMemberAuth() {
			try {
				const { data: { session } } = await supabase.auth.getSession();
				if (session && session.user) {
					setIsAuthenticated(true);
					return;
				}
			} catch (e) {
				console.warn("Supabase auth check error:", e);
			}
			if (localStorage.getItem("sb-access-token") || localStorage.getItem("coha_user") || localStorage.getItem("user") || localStorage.getItem("lifora_patient")) setIsAuthenticated(true);
			else {
				setIsAuthenticated(false);
				window.location.href = "/auth";
			}
		}
		checkMemberAuth();
		if (typeof window !== "undefined") {
			synthRef.current = window.speechSynthesis;
			if (synthRef.current) synthRef.current.onvoiceschanged = () => {};
		}
		doctorService.getDoctorsBySpecialty("Psychiatry").then((docs) => {
			setRecommendedPsychiatrists(docs);
		});
		return () => {
			isLiveActiveRef.current = false;
			stopAllAudio();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isBusy]);
	const primeAudioContext = () => {
		if (typeof window !== "undefined") {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (AudioCtx) {
				const ctx = new AudioCtx();
				if (ctx.state === "suspended") ctx.resume();
			}
			if (window.speechSynthesis) window.speechSynthesis.resume();
			if (audioPlayerRef.current) audioPlayerRef.current.load();
		}
	};
	const stopAllAudio = () => {
		if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
		if (audioPlayerRef.current) {
			audioPlayerRef.current.pause();
			audioPlayerRef.current.src = "";
		}
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
		setIsSpeaking(false);
		setIsListening(false);
	};
	const fallbackBrowserTTS = (cleanText, doctorName, onEnded) => {
		const synth = window.speechSynthesis;
		if (!synth) {
			if (onEnded) onEnded();
			return;
		}
		const utterance = new SpeechSynthesisUtterance(cleanText);
		utterance.lang = "en-LK";
		utterance.volume = 1;
		const isMale = doctorName === "Nuwan";
		const isBestFriend = doctorName === "Kavi";
		utterance.rate = isMale ? .9 : isBestFriend ? .96 : .94;
		utterance.pitch = isMale ? .88 : isBestFriend ? 1.04 : 1.05;
		const voices = synth.getVoices();
		if (voices.length > 0) {
			const sortedVoices = [...voices].sort((a, b) => {
				const aScore = a.name.includes("Natural") || a.name.includes("Neural") || a.name.includes("Online") ? 2 : 1;
				return (b.name.includes("Natural") || b.name.includes("Neural") || b.name.includes("Online") ? 2 : 1) - aScore;
			});
			let slVoice = sortedVoices.find((v) => (v.lang.includes("en-LK") || v.lang.includes("si-LK") || v.name.toLowerCase().includes("sri lanka") || v.name.toLowerCase().includes("sinhala")) && (isMale ? !v.name.toLowerCase().includes("female") : true));
			if (!slVoice) slVoice = sortedVoices.find((v) => v.lang.includes("en-GB") && (isMale ? v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("george") || v.name.toLowerCase().includes("oliver") || v.name.toLowerCase().includes("daniel") || v.name.toLowerCase().includes("uk english male") : v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("serena") || v.name.toLowerCase().includes("kate") || v.name.toLowerCase().includes("victoria") || v.name.toLowerCase().includes("uk english female")));
			if (!slVoice) slVoice = sortedVoices.find((v) => v.lang.startsWith("en") && (isMale ? !v.name.toLowerCase().includes("female") : true));
			if (slVoice) utterance.voice = slVoice;
		}
		let keepAliveInterval = null;
		utterance.onstart = () => {
			setIsSpeaking(true);
			keepAliveInterval = setInterval(() => {
				if (!synth.speaking) clearInterval(keepAliveInterval);
				else synth.resume();
			}, 2e3);
		};
		utterance.onend = () => {
			if (keepAliveInterval) clearInterval(keepAliveInterval);
			setIsSpeaking(false);
			if (onEnded) onEnded();
		};
		utterance.onerror = (err) => {
			console.warn("Speech synthesis error:", err);
			if (keepAliveInterval) clearInterval(keepAliveInterval);
			setIsSpeaking(false);
			if (onEnded) onEnded();
		};
		if (synth.paused) synth.resume();
		synth.cancel();
		setTimeout(() => {
			synth.resume();
			synth.speak(utterance);
		}, 50);
	};
	const speakText = (text, doctorName, onEnded) => {
		if (!soundEnabled) {
			if (onEnded) onEnded();
			return;
		}
		let cleanText = text.replace(/[*#_`]/g, "").replace(/\bDr\./gi, "Doctor").replace(/\bvs\./gi, "versus").replace(/\s+/g, " ").trim();
		if (!cleanText) {
			if (onEnded) onEnded();
			return;
		}
		stopAllAudio();
		try {
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			if (AudioCtx) {
				const ctx = new AudioCtx();
				if (ctx.state === "suspended") ctx.resume();
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = "sine";
				osc.frequency.setValueAtTime(523.25, ctx.currentTime);
				gain.gain.setValueAtTime(.04, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .12);
				osc.connect(gain);
				gain.connect(ctx.destination);
				osc.start();
				osc.stop(ctx.currentTime + .12);
			}
		} catch (e) {
			console.warn("AudioContext chime error:", e);
		}
		const isMale = doctorName === "Nuwan";
		const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText.slice(0, 240))}&tl=en-GB&client=tw-ob`;
		const audio = new Audio(ttsUrl);
		audioPlayerRef.current = audio;
		audio.playbackRate = isMale ? .9 : .94;
		let fallbackTriggered = false;
		const triggerFallback = () => {
			if (fallbackTriggered) return;
			fallbackTriggered = true;
			console.log("Fallback to browser Sri Lankan SpeechSynthesis voice...");
			fallbackBrowserTTS(cleanText, doctorName, onEnded);
		};
		audio.onplay = () => setIsSpeaking(true);
		audio.onended = () => {
			setIsSpeaking(false);
			if (onEnded) onEnded();
		};
		audio.onerror = triggerFallback;
		audio.play().catch(triggerFallback);
	};
	const startListeningLoop = async () => {
		setSpeechError(null);
		if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
		speechDetectedRef.current = false;
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];
			const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
			const source = audioCtx.createMediaStreamSource(stream);
			const analyser = audioCtx.createAnalyser();
			analyser.fftSize = 512;
			source.connect(analyser);
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			let hasUserSpoken = false;
			let lastSpeechTime = 0;
			const recordingStart = Date.now();
			const checkVAD = () => {
				if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
					audioCtx.close();
					return;
				}
				analyser.getByteTimeDomainData(dataArray);
				let sumSquare = 0;
				for (let i = 0; i < bufferLength; i++) {
					const val = (dataArray[i] || 128) - 128;
					sumSquare += val * val;
				}
				if (Math.sqrt(sumSquare / bufferLength) > 4.5) {
					hasUserSpoken = true;
					lastSpeechTime = Date.now();
				}
				if (hasUserSpoken && lastSpeechTime > 0 && Date.now() - lastSpeechTime > 1500) {
					console.log("VAD: User finished speaking (1.5s silence). Processing doctor response...");
					audioCtx.close();
					if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") mediaRecorderRef.current.stop();
					return;
				}
				if (Date.now() - recordingStart > 3e4) {
					console.log("VAD: 30s safety cap reached. Processing response...");
					audioCtx.close();
					if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") mediaRecorderRef.current.stop();
					return;
				}
				animFrameRef.current = requestAnimationFrame(checkVAD);
			};
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) audioChunksRef.current.push(event.data);
			};
			mediaRecorder.onstop = async () => {
				if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
				const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
				stream.getTracks().forEach((track) => track.stop());
				if (audioChunksRef.current.length === 0 || audioBlob.size === 0) {
					if (isLiveActiveRef.current && mode === "live-call") setTimeout(() => {
						if (isLiveActiveRef.current && !isSpeaking && !isBusy) startListeningLoop();
					}, 600);
					return;
				}
				setIsTranscribing(true);
				const transcript = await transcribeAudio(audioBlob);
				setIsTranscribing(false);
				if (transcript && transcript.trim()) processUserMessage(transcript.trim());
				else if (isLiveActiveRef.current) setTimeout(() => {
					if (isLiveActiveRef.current && !isSpeaking && !isBusy) startListeningLoop();
				}, 600);
			};
			mediaRecorder.start();
			setIsListening(true);
			animFrameRef.current = requestAnimationFrame(checkVAD);
		} catch (err) {
			console.error("Mic VAD error:", err);
			setSpeechError("Microphone permission denied. Please allow microphone access.");
			setIsListening(false);
		}
	};
	const stopListening = () => {
		if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") mediaRecorderRef.current.stop();
		setIsListening(false);
	};
	const processUserMessage = async (userText) => {
		if (!userText.trim() || !selectedDoctor) return;
		const userMsg = {
			role: "user",
			content: userText
		};
		setMessages((prev) => [...prev, userMsg]);
		setInput("");
		setIsBusy(true);
		const history = [...messagesRef.current, userMsg];
		const replyText = await consultPsychologist(history, selectedDoctor);
		const aiMsg = {
			role: "assistant",
			content: replyText
		};
		setMessages((prev) => [...prev, aiMsg]);
		setIsBusy(false);
		speakText(replyText, selectedDoctor, () => {
			if (isLiveActiveRef.current && mode === "live-call") setTimeout(() => {
				if (isLiveActiveRef.current) startListeningLoop();
			}, 500);
		});
	};
	const startDoctorSession = (docName) => {
		primeAudioContext();
		setSelectedDoctor(docName);
		isLiveActiveRef.current = true;
		const greeting = docName === "Nuwan" ? "Hello, I am Dr. Nuwan. I'm here as your psychological doctor. Tell me what's on your mind today." : docName === "Ishani" ? "Hello, I am Dr. Ishani. I'm listening closely. How are you feeling today?" : "Hey bestie! I'm Kavi, your best friend and mood fixer. I'm right here with you—tell me what's going on or how you're feeling today!";
		setMessages([{
			role: "assistant",
			content: greeting
		}]);
		speakText(greeting, docName, () => {
			if (isLiveActiveRef.current && mode === "live-call") startListeningLoop();
		});
	};
	const toggleLiveCallMode = () => {
		primeAudioContext();
		if (isLiveActiveRef.current) {
			isLiveActiveRef.current = false;
			stopAllAudio();
		} else if (selectedDoctor) {
			isLiveActiveRef.current = true;
			startListeningLoop();
		}
	};
	if (isAuthenticated === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-slate-500",
			children: "Redirecting to Sign in / Register..."
		})]
	});
	if (!selectedDoctor) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl mx-auto py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center space-y-2 mb-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold text-[#0E3860] dark:text-blue-100",
					children: "MedMind eCare"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "outline",
					className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold px-2.5 py-0.5 uppercase tracking-wider rounded-md",
					children: "BETA"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Choose a character to start your live voice session."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-3 gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "cursor-pointer hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden border-2",
					onClick: () => startDoctorSession("Nuwan"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/nuwan_avatar_1786363440934.png",
							alt: "Dr. Nuwan",
							onError: (e) => {
								e.target.src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80";
							},
							className: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "w-full rounded-full gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "size-3.5" }), " Call Dr. Nuwan"]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "text-center p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-lg",
							children: "Dr. Nuwan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Senior Psychological Doctor"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "cursor-pointer hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden border-2",
					onClick: () => startDoctorSession("Ishani"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/ishani_avatar_1786363461362.png",
							alt: "Dr. Ishani",
							onError: (e) => {
								e.target.src = "https://images.unsplash.com/photo-1594824813566-78a050f7514a?w=600&auto=format&fit=crop&q=80";
							},
							className: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "w-full rounded-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "size-3.5" }), " Call Dr. Ishani"]
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "text-center p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-lg",
							children: "Dr. Ishani"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Senior Psychological Doctor"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "cursor-pointer hover:border-amber-500/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden border-2 border-amber-500/30",
					onClick: () => startDoctorSession("Kavi"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "h-64 bg-amber-50 dark:bg-amber-950/40 relative overflow-hidden flex items-center justify-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/kavi_bestfriend_avatar_1786373760801.png",
							alt: "Kavi (Mood Fixer)",
							onError: (e) => {
								e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80";
							},
							className: "absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "w-full rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs",
								children: "Talk to Bestie Kavi"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "text-center p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-1.5 mb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-lg",
								children: "Kavi"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] py-0",
								children: "Mood Fixer"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Your Best Friend & Mood Booster"
						})]
					})]
				})
			]
		})]
	});
	const avatarSrc = selectedDoctor === "Nuwan" ? "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/nuwan_avatar_1786363440934.png" : selectedDoctor === "Ishani" ? "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/ishani_avatar_1786363461362.png" : "/@fs/Users/kavishkathilakarathna/.gemini/antigravity-ide/brain/13521ad2-0754-4111-8661-64f2911f3a1b/kavi_bestfriend_avatar_1786373760801.png";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: audioPlayerRef,
				className: "hidden"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => {
							isLiveActiveRef.current = false;
							stopAllAudio();
							setSelectedDoctor(null);
						},
						className: "text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 size-4" }), " Change doctor"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 bg-muted/50 p-1 rounded-full border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: mode === "live-call" ? "default" : "ghost",
							className: "rounded-full gap-1.5",
							onClick: () => {
								setMode("live-call");
								if (!isLiveActiveRef.current) toggleLiveCallMode();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "size-3.5" }), " Gemini Live Voice Mode"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: mode === "chat" ? "default" : "ghost",
							className: "rounded-full gap-1.5",
							onClick: () => setMode("chat"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3.5" }), " Text & Voice Chat"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => {
							if (soundEnabled) stopAllAudio();
							setSoundEnabled(!soundEnabled);
						},
						children: soundEnabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4 text-muted-foreground" })
					})
				]
			}),
			mode === "live-call" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex-1 flex flex-col items-center justify-between p-6 md:p-8 bg-slate-950 text-white rounded-3xl border-slate-800 shadow-2xl relative overflow-y-auto min-h-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-1.5 z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "border-slate-700 text-slate-300 gap-1.5 py-1 px-4 text-xs bg-slate-900/80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full ${isLiveActiveRef.current ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}` }), isLiveActiveRef.current ? "Live Voice Session Active" : "Call Paused"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold tracking-tight",
								children: selectedDoctor === "Kavi" ? "Kavi" : `Dr. ${selectedDoctor}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-slate-400 text-xs md:text-sm",
								children: selectedDoctor === "Kavi" ? "Your Best Friend & Mood Fixer" : "Senior Psychological Doctor"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex items-center justify-center my-4 md:my-6 z-10",
						children: [
							isSpeaking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-emerald-500/40 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-72 h-72 md:w-80 md:h-80 rounded-full border-2 border-emerald-500/20 animate-pulse" })] }),
							isListening && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-64 h-64 md:w-72 md:h-72 rounded-full border-4 border-blue-500/40 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute w-72 h-72 md:w-80 md:h-80 rounded-full border-2 border-blue-500/20 animate-pulse" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								onClick: () => {
									if (isListening && mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") mediaRecorderRef.current.stop();
								},
								className: `relative w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60 rounded-full overflow-hidden border-4 transition-all duration-500 cursor-pointer ${isSpeaking ? "border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)] scale-105" : isListening ? "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.5)] scale-105 hover:scale-110" : "border-slate-700 shadow-2xl"}`,
								title: isListening ? "Tap to finish speaking & get instant reply" : "",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: avatarSrc,
									alt: selectedDoctor,
									onError: (e) => {
										const fallback = selectedDoctor === "Nuwan" ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1594824813566-78a050f7514a?w=600&auto=format&fit=crop&q=80";
										e.target.src = fallback;
									},
									className: "w-full h-full object-cover"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "z-10 flex flex-col items-center gap-2 max-w-lg w-full",
						children: [
							isSpeaking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-5 py-1.5 rounded-full text-emerald-400 font-semibold text-xs md:text-sm animate-pulse",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4 animate-bounce" }),
									" ",
									selectedDoctor === "Kavi" ? "Kavi" : `Dr. ${selectedDoctor}`,
									" is speaking..."
								]
							}) : isListening ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-5 py-1.5 rounded-full text-blue-400 font-semibold text-xs md:text-sm animate-pulse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4 animate-bounce" }), " Listening to you... Speak naturally"]
							}) : isBusy || isTranscribing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-5 py-1.5 rounded-full text-amber-400 font-semibold text-xs md:text-sm animate-pulse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 animate-spin" }), " Processing your voice..."]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-slate-400 text-xs md:text-sm",
								children: "Tap the microphone to speak"
							}),
							speechError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-red-400 max-w-sm text-center font-medium bg-red-950/50 p-2 rounded-lg border border-red-800",
								children: speechError
							}),
							messages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-slate-300 italic max-w-md text-center bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 line-clamp-2",
								children: [
									"\"",
									messages[messages.length - 1]?.content,
									"\""
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-6 z-10 my-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							className: `rounded-full w-14 h-14 md:w-16 md:h-16 shadow-xl transition-transform hover:scale-110 ${isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-600 hover:bg-blue-700"}`,
							onClick: () => {
								primeAudioContext();
								if (isListening) stopListening();
								else startListeningLoop();
							},
							disabled: isBusy || isTranscribing,
							title: isListening ? "Mute Microphone" : "Unmute Microphone",
							children: isListening ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-6 md:size-7" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-6 md:size-7" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "destructive",
							className: "rounded-full w-14 h-14 md:w-16 md:h-16 shadow-xl bg-red-600 hover:bg-red-700 transition-transform hover:scale-110",
							onClick: () => {
								isLiveActiveRef.current = false;
								stopAllAudio();
								setMode("chat");
							},
							title: "End Live Call",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-6 md:size-7" })
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row gap-6 h-full min-h-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:w-1/3 flex flex-col items-center justify-between p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-border overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-xl transition-all duration-500 ${isSpeaking ? "scale-105 ring-4 ring-primary/40 shadow-primary/20" : ""}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: avatarSrc,
									alt: selectedDoctor,
									onError: (e) => {
										const fallback = selectedDoctor === "Nuwan" ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80" : "https://images.unsplash.com/photo-1594824813566-78a050f7514a?w=600&auto=format&fit=crop&q=80";
										e.target.src = fallback;
									},
									className: "w-full h-full object-cover"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 text-lg font-bold",
								children: selectedDoctor === "Kavi" ? "Kavi" : `Dr. ${selectedDoctor}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-4",
								children: selectedDoctor === "Kavi" ? "Your Best Friend & Mood Booster" : "Senior Psychological Doctor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "w-full rounded-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white mb-6",
								onClick: () => {
									setMode("live-call");
									toggleLiveCallMode();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "size-4" }), " Switch to Gemini Live Mode"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full pt-4 border-t border-border space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "size-3.5 text-primary" }), " Top Psychiatrists in System"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px] bg-primary/10 text-primary border-primary/20 py-0",
								children: "Verified"
							})]
						}), recommendedPsychiatrists.slice(0, 2).map((psych) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-background rounded-2xl border border-border shadow-xs hover:border-primary/40 transition-all flex flex-col gap-1.5 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-xs leading-tight text-foreground",
										children: psych.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: psych.hospital
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-amber-500" }),
											" ",
											psych.rating
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3" }),
											" ",
											psych.nextSlot
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-emerald-600 dark:text-emerald-400",
										children: ["Rs. ", psych.fee.toLocaleString()]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "w-full rounded-xl text-[11px] gap-1 h-7 border-primary/30 hover:bg-primary hover:text-white",
									onClick: () => {
										window.location.href = `/patient/appointments?doctor=${encodeURIComponent(psych.name)}`;
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3" }), " Book Channel"]
								})
							]
						}, psych.id))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex-1 flex flex-col shadow-soft border-border overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 p-6 overflow-y-auto space-y-6",
						children: [
							messages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex items-start gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `max-w-[80%] rounded-2xl px-5 py-3 relative group ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "whitespace-pre-wrap",
										children: m.content
									}), m.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => {
											primeAudioContext();
											speakText(m.content, selectedDoctor);
										},
										className: "mt-1.5 flex items-center gap-1 text-xs text-primary hover:underline focus:outline-none",
										title: "Replay voice audio",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-3.5" }), " Replay voice"]
									})]
								})
							}, i)),
							isBusy && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-w-[80%] rounded-2xl px-5 py-4 bg-muted text-foreground rounded-tl-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-1.5 items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 rounded-full bg-primary/40 animate-bounce" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-2 h-2 rounded-full bg-primary/40 animate-bounce",
												style: { animationDelay: "0.2s" }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-2 h-2 rounded-full bg-primary/40 animate-bounce",
												style: { animationDelay: "0.4s" }
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-4 border-t border-border bg-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: input,
								onChange: (e) => {
									setInput(e.target.value);
									e.target.style.height = "auto";
									e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
								},
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										if (!isBusy) {
											primeAudioContext();
											processUserMessage(input);
										}
									}
								},
								placeholder: "Type a message or use Gemini Live Call...",
								className: "min-h-[44px] max-h-[150px] resize-none overflow-y-auto py-3 bg-muted/30",
								rows: 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "icon",
								onClick: () => {
									primeAudioContext();
									processUserMessage(input);
								},
								disabled: isBusy || !input.trim(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
							})]
						})
					})]
				})]
			})
		]
	});
}
//#endregion
export { MedMindECare as component };
