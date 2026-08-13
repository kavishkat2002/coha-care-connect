import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.mjs";
import { B as MessageSquare, C as Send, I as Paperclip, Q as Heart, S as ShieldCheck, _t as Calendar, at as Download, ct as Clock, d as UserCheck, ft as CircleCheck, j as Phone, o as Video, tt as FileText, w as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-BfBj_YIE.mjs";
import { t as AiDisclaimer } from "./AiDisclaimer-DQCQj0Xf.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as SPECIALTIES, c as doctors, u as init_mock } from "./server-BBwoW3Vo.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as patientService } from "./patient.service-CVz31mvu.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as doctorService } from "./doctor.service-B1G2HOCZ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.telemedicine-Bw5ed0B4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
init_mock();
var TIME_SLOTS = [
	"09:00 AM",
	"10:30 AM",
	"01:30 PM",
	"03:00 PM",
	"05:00 PM",
	"07:30 PM"
];
function TelemedicinePage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [specialty, setSpecialty] = (0, import_react.useState)("all");
	const [hospital, setHospital] = (0, import_react.useState)("");
	const [viewFilter, setViewFilter] = (0, import_react.useState)("all");
	const [rosterDoctors, setRosterDoctors] = (0, import_react.useState)([]);
	const [favDoctorIds, setFavDoctorIds] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			return JSON.parse(localStorage.getItem("meddoc_favorite_doctors") || "[]");
		} catch (e) {}
		return [];
	});
	const [myAppointments, setMyAppointments] = (0, import_react.useState)([]);
	const [bookingDoctor, setBookingDoctor] = (0, import_react.useState)(null);
	const [consultationMode, setConsultationMode] = (0, import_react.useState)("Video Call");
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0] || "");
	const [selectedTimeSlot, setSelectedTimeSlot] = (0, import_react.useState)("09:30 AM");
	const [patientNotes, setPatientNotes] = (0, import_react.useState)("");
	const [isSubmittingBooking, setIsSubmittingBooking] = (0, import_react.useState)(false);
	const [activeChatAppt, setActiveChatAppt] = (0, import_react.useState)(null);
	const [chatMessages, setChatMessages] = (0, import_react.useState)([]);
	const [newMessageInput, setNewMessageInput] = (0, import_react.useState)("");
	const fileInputRef = (0, import_react.useRef)(null);
	const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0] || "";
	(0, import_react.useEffect)(() => {
		async function load() {
			const [docs, appts] = await Promise.all([doctorService.getAllDoctors(), patientService.getAppointments()]);
			if (docs && docs.length > 0) setRosterDoctors(docs);
			setMyAppointments(appts);
		}
		load();
	}, []);
	const toggleFavoriteDoctor = (docId, docName) => {
		let updated;
		if (favDoctorIds.includes(docId)) {
			updated = favDoctorIds.filter((id) => id !== docId);
			toast.info(`Removed ${docName} from your Favorite Doctors`);
		} else {
			updated = [...favDoctorIds, docId];
			toast.success(`Saved ${docName} to your Favorite Doctors!`);
		}
		setFavDoctorIds(updated);
		localStorage.setItem("meddoc_favorite_doctors", JSON.stringify(updated));
	};
	const allAvailableDoctors = (0, import_react.useMemo)(() => {
		return (rosterDoctors.length > 0 ? rosterDoctors : doctors).filter((d) => d.online !== false);
	}, [rosterDoctors]);
	const filteredDoctors = (0, import_react.useMemo)(() => {
		return allAvailableDoctors.filter((d) => {
			const q = query.trim().toLowerCase();
			const h = hospital.trim().toLowerCase();
			const matchesQuery = !q || (d.name || "").toLowerCase().includes(q);
			const matchesSpecialty = specialty === "all" || d.specialty === specialty;
			const matchesHospital = !h || (d.hospital || "").toLowerCase().includes(h);
			const matchesFav = viewFilter === "all" || favDoctorIds.includes(d.id);
			return matchesQuery && matchesSpecialty && matchesHospital && matchesFav;
		});
	}, [
		allAvailableDoctors,
		query,
		specialty,
		hospital,
		viewFilter,
		favDoctorIds
	]);
	const openScheduleModal = (doc, mode) => {
		setBookingDoctor(doc);
		setConsultationMode(mode);
		setSelectedDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0] || "");
		setSelectedTimeSlot("09:30 AM");
		setPatientNotes("");
	};
	const handleConfirmSchedule = async () => {
		if (!bookingDoctor) return;
		setIsSubmittingBooking(true);
		try {
			const profile = await patientService.getPatientProfile();
			await patientService.bookAppointment({
				doctor_id: bookingDoctor.id,
				hospital_id: bookingDoctor.hospital || "h1",
				date: selectedDate,
				time: selectedTimeSlot,
				patient_name: profile?.name || "Mahinda Rajapaksha",
				patient_mobile: profile?.phone || "+94 77 123 4567",
				patient_email: profile?.email || "mahinda@meddoc.lk",
				status: "Approved",
				fee: bookingDoctor.fee || 2500
			});
			const updatedAppts = await patientService.getAppointments();
			setMyAppointments(updatedAppts);
			setIsSubmittingBooking(false);
			setBookingDoctor(null);
			toast.success(`Telemedicine ${consultationMode} Scheduled!`, { description: `Your consultation with ${bookingDoctor.name} on ${selectedDate} at ${selectedTimeSlot} is approved.` });
		} catch (e) {
			setIsSubmittingBooking(false);
			setBookingDoctor(null);
		}
	};
	const openChatWithDoctor = (appt) => {
		setActiveChatAppt(appt);
		const chatKey = `meddoc_chat_${appt.id}`;
		const stored = localStorage.getItem(chatKey);
		if (stored) try {
			setChatMessages(JSON.parse(stored));
		} catch (e) {
			setChatMessages(getInitialChatMessages(appt));
		}
		else {
			const initial = getInitialChatMessages(appt);
			setChatMessages(initial);
			localStorage.setItem(chatKey, JSON.stringify(initial));
		}
	};
	const getInitialChatMessages = (appt) => [{
		id: "m1",
		sender: "doctor",
		text: `Hello ${appt.patient_name || "Patient"}, your telemedicine appointment has been approved. I have reviewed your health background. How are you feeling today?`,
		timestamp: "09:31 AM"
	}];
	const handleSendPatientMessage = () => {
		if (!newMessageInput.trim() || !activeChatAppt) return;
		const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
		const userMsg = {
			id: "msg-" + Date.now(),
			sender: "patient",
			text: newMessageInput.trim(),
			timestamp: nowTime
		};
		const updated = [...chatMessages, userMsg];
		setChatMessages(updated);
		setNewMessageInput("");
		const chatKey = `meddoc_chat_${activeChatAppt.id}`;
		localStorage.setItem(chatKey, JSON.stringify(updated));
		setTimeout(() => {
			const doctorReply = {
				id: "msg-reply-" + Date.now(),
				sender: "doctor",
				text: `Thank you for the update. I have reviewed your symptoms. Please continue your prescribed dosage and contact me if symptoms persist. Digital e-Prescription updated in your reports.`,
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				})
			};
			const withReply = [...updated, doctorReply];
			setChatMessages(withReply);
			localStorage.setItem(chatKey, JSON.stringify(withReply));
		}, 1500);
	};
	const handlePatientFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file || !activeChatAppt) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const fileUrl = event.target?.result;
			const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
			const isImg = file.type.startsWith("image/");
			if (!isPdf && !isImg) {
				toast.error("Please upload an image (JPG, PNG) or PDF document");
				return;
			}
			const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			});
			const fileMsg = {
				id: "file-" + Date.now(),
				sender: "patient",
				attachment: {
					type: isPdf ? "pdf" : "image",
					url: fileUrl,
					name: file.name
				},
				timestamp: nowTime
			};
			const updated = [...chatMessages, fileMsg];
			setChatMessages(updated);
			const chatKey = `meddoc_chat_${activeChatAppt.id}`;
			localStorage.setItem(chatKey, JSON.stringify(updated));
			toast.success(`Shared ${isPdf ? "PDF document" : "photo"} with doctor!`);
			if (fileInputRef.current) fileInputRef.current.value = "";
		};
		reader.readAsDataURL(file);
	};
	const [activeVideoDoctor, setActiveVideoDoctor] = (0, import_react.useState)(null);
	const [isMicMuted, setIsMicMuted] = (0, import_react.useState)(false);
	const [isVideoOff, setIsVideoOff] = (0, import_react.useState)(false);
	const [callDurationSeconds, setCallDurationSeconds] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let timer;
		if (activeVideoDoctor) timer = setInterval(() => {
			setCallDurationSeconds((prev) => prev + 1);
		}, 1e3);
		else setCallDurationSeconds(0);
		return () => clearInterval(timer);
	}, [activeVideoDoctor]);
	const formatCallTime = (totalSeconds) => {
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};
	const isCallDateAvailable = (apptDate) => {
		if (!apptDate) return true;
		return apptDate <= ((/* @__PURE__ */ new Date()).toISOString().split("T")[0] || "");
	};
	const groupedConsultations = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const appt of myAppointments) {
			const docId = appt.doctor_id || "d1";
			const docObj = (rosterDoctors.length > 0 ? rosterDoctors : doctors).find((d) => d.id === docId) || {
				id: docId,
				name: appt.doctor_id || "Dr. Menaka De Alwis",
				specialty: "Gynaecology",
				hospital: "Metro Cancer Institute",
				fee: appt.fee || 5500
			};
			if (!map.has(docId)) map.set(docId, {
				doctor: docObj,
				appts: []
			});
			map.get(docId).appts.push(appt);
		}
		return Array.from(map.values());
	}, [myAppointments, rosterDoctors]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-6xl mx-auto pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Telemedicine Doctors",
				description: "Find verified specialists, save favorite doctors, review health background approvals, and launch live HD video consultations."
			}),
			groupedConsultations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft border border-blue-100 dark:border-blue-900/40 bg-gradient-to-r from-blue-50/50 via-white to-blue-50/30 dark:from-slate-900 dark:to-slate-950 rounded-2xl overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm font-bold flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-slate-900 dark:text-white",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4 text-emerald-600 dark:text-emerald-400" }),
								"My Scheduled Video Consultations & Follow-ups (",
								groupedConsultations.length,
								")"
							]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-3 pt-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: groupedConsultations.map(({ doctor, appts }) => {
							const latestAppt = appts[0];
							if (!latestAppt) return null;
							const isCompleted = latestAppt.status === "Completed";
							const canJoinVideo = !isCompleted && isCallDateAvailable(latestAppt.date);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-slate-900 dark:text-white",
											children: doctor.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `text-[10px] font-bold px-1.5 py-0.2 ${isCompleted ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"}`,
											children: isCompleted ? "Session Completed" : "Approved"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-slate-500 dark:text-slate-400",
										children: appts.length > 1 ? `${appts.length} Appointments (Latest: ${latestAppt.date} at ${latestAppt.time})` : `${latestAppt.date} at ${latestAppt.time} • Fee: LKR ${(latestAppt.fee || 5500).toLocaleString()}`
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 shrink-0",
									children: [isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										disabled: true,
										className: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 text-xs h-8.5 rounded-xl font-medium gap-1 cursor-not-allowed opacity-75",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Session Ended" })]
									}) : canJoinVideo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: () => setActiveVideoDoctor(doctor),
										className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8.5 rounded-xl font-semibold gap-1.5 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Join Video Call" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										disabled: true,
										title: `Video call unlocks on ${latestAppt.date}`,
										className: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 text-xs h-8.5 rounded-xl font-medium gap-1.5 cursor-not-allowed opacity-80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Available ", latestAppt.date] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => openChatWithDoctor(latestAppt),
										className: "text-xs h-8.5 rounded-xl font-medium gap-1 border-slate-200 dark:border-slate-700",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3.5" })
									})]
								})]
							}, doctor.id);
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft border border-border bg-card rounded-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between border-b border-border pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: viewFilter === "all" ? "default" : "outline",
								size: "sm",
								onClick: () => setViewFilter("all"),
								className: "text-xs h-8.5 rounded-full font-medium",
								children: [
									"All Telemedicine Doctors (",
									allAvailableDoctors.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: viewFilter === "favorites" ? "default" : "outline",
								size: "sm",
								onClick: () => setViewFilter("favorites"),
								className: `text-xs h-8.5 rounded-full font-medium gap-1.5 ${viewFilter === "favorites" ? "bg-rose-600 hover:bg-rose-700 text-white" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-3.5 ${favDoctorIds.length > 0 ? "fill-rose-500 text-rose-500" : ""}` }),
									"My Favorites (",
									favDoctorIds.length,
									")"
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "doc-search",
									className: "text-xs font-bold text-foreground",
									children: "Doctor Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "doc-search",
										value: query,
										onChange: (e) => setQuery(e.target.value),
										placeholder: "Search doctor name",
										className: "pl-9.5 h-10 rounded-full text-xs"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "specialty-filter",
									className: "text-xs font-bold text-foreground",
									children: "Specialization"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: specialty,
									onValueChange: setSpecialty,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "specialty-filter",
										className: "h-10 rounded-full text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All specialties" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All specialties"
									}), SPECIALTIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s))] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "hospital-search",
									className: "text-xs font-bold text-foreground",
									children: "Hospital / Clinic"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "hospital-search",
										value: hospital,
										onChange: (e) => setHospital(e.target.value),
										placeholder: "Search hospital name",
										className: "pl-9.5 h-10 rounded-full text-xs"
									})]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-bold text-muted-foreground uppercase tracking-wider",
						children: [
							"Available Telemedicine Specialists (",
							filteredDoctors.length,
							")"
						]
					})
				}), filteredDoctors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 text-center rounded-2xl bg-muted/20 border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-foreground",
							children: viewFilter === "favorites" ? "No favorite doctors added yet." : "No telemedicine doctors matched your search criteria."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: viewFilter === "favorites" ? "Click the heart icon on any doctor card to save them as a favorite!" : "Try resetting the specialty or doctor name filter."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								setQuery("");
								setSpecialty("all");
								setHospital("");
								setViewFilter("all");
							},
							className: "mt-4 rounded-xl text-xs",
							children: "Reset Filters"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: filteredDoctors.map((d) => {
						const isFav = favDoctorIds.includes(d.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "shadow-soft hover:shadow-md transition-all rounded-2xl border border-border relative",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-4 p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
												className: "size-13 border border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
													className: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-sm",
													children: d.photoInitials || d.name.substring(0, 2).toUpperCase()
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-bold text-base text-foreground leading-tight",
													children: d.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground mt-0.5",
													children: [
														d.specialty,
														" · ",
														d.hospital || "Metro Cancer Institute"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium",
													children: ["Languages: ", d.languages?.join(", ") || "English, Sinhala"]
												})
											] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2 shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => toggleFavoriteDoctor(d.id, d.name),
												title: isFav ? "Remove from Favorites" : "Add to Favorites",
												className: `p-2 rounded-full border transition-all ${isFav ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300 shadow-xs" : "bg-muted/30 border-border text-slate-400 hover:text-rose-500 hover:bg-rose-50/50"}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-4 ${isFav ? "fill-rose-600" : ""}` })
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-3 gap-2 pt-1",
										children: [
											{
												label: "Video Call",
												icon: Video
											},
											{
												label: "Voice Call",
												icon: Phone
											},
											{
												label: "Chat",
												icon: MessageSquare
											}
										].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => openScheduleModal(d, mode.label),
											className: "rounded-xl text-xs h-9 font-medium gap-1.5 hover:border-blue-500 hover:text-blue-600",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(mode.icon, { className: "size-3.5 text-blue-600 dark:text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: mode.label
											})]
										}, mode.label))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pt-2 border-t border-border/60 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-blue-600 dark:text-blue-400",
											children: [
												"LKR ",
												d.fee?.toLocaleString() || "5,500",
												" / Visit"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-muted-foreground font-medium flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-3 text-emerald-500" }), "Digital Prescription Included"]
										})]
									})
								]
							})
						}, d.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!bookingDoctor,
				onOpenChange: () => setBookingDoctor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-lg font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-5 text-blue-600 dark:text-blue-400" }),
								"Schedule ",
								consultationMode
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Select your preferred date and time slot for your online consultation."
						})] }),
						bookingDoctor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										className: "size-11 border border-blue-200 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "bg-blue-600 text-white font-bold text-xs",
											children: bookingDoctor.photoInitials || bookingDoctor.name.substring(0, 2).toUpperCase()
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-bold text-slate-900 dark:text-white leading-tight",
											children: bookingDoctor.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
											children: [
												bookingDoctor.specialty,
												" • ",
												consultationMode
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5",
											children: ["Fee: LKR ", bookingDoctor.fee?.toLocaleString() || "5,500"]
										})
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex items-start gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-emerald-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-emerald-900 dark:text-emerald-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold",
											children: "Health Background Shared with Doctor"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5",
											children: [
												"Your MedDoc health profile (past conditions, active medications & ePass tier) will be automatically sent to ",
												bookingDoctor.name,
												" upon booking."
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										htmlFor: "booking-date",
										className: "text-xs font-bold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5 text-blue-600" }), "Select Date"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "booking-date",
										type: "date",
										min: todayStr,
										value: selectedDate,
										onChange: (e) => setSelectedDate(e.target.value),
										className: "h-10 text-xs rounded-xl"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "text-xs font-bold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-blue-600" }), "Available Time Slot"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-3 gap-2",
										children: TIME_SLOTS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: selectedTimeSlot === t ? "default" : "outline",
											onClick: () => setSelectedTimeSlot(t),
											className: `text-xs h-9 font-medium rounded-xl ${selectedTimeSlot === t ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`,
											children: t
										}, t))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "patient-notes",
										className: "text-xs font-bold",
										children: "Chief Complaint / Symptoms (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "patient-notes",
										placeholder: "e.g. High fever, headache for 2 days, or prescription renewal",
										value: patientNotes,
										onChange: (e) => setPatientNotes(e.target.value),
										className: "text-xs rounded-xl min-h-[70px] resize-none"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setBookingDoctor(null),
								disabled: isSubmittingBooking,
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleConfirmSchedule,
								disabled: isSubmittingBooking,
								className: "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-xs",
								children: isSubmittingBooking ? "Scheduling..." : "Confirm & Send to Doctor"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!activeChatAppt,
				onOpenChange: () => setActiveChatAppt(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-3xl flex flex-col h-[560px] p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-5 py-3.5 border-b border-border bg-gradient-to-r from-blue-50/70 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 flex items-center justify-between gap-3 pr-12",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									className: "size-10 border border-blue-200 shadow-xs shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs",
										children: "MD"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-sm text-slate-900 dark:text-white truncate",
										children: (() => {
											return (rosterDoctors.length > 0 ? rosterDoctors : doctors).find((d) => d.id === activeChatAppt?.doctor_id)?.name || "Dr. Menaka De Alwis";
										})()
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "relative flex size-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex size-2 rounded-full bg-emerald-500" })]
										}), "Photos & PDF Enabled"]
									})]
								})]
							}), isCallDateAvailable(activeChatAppt?.date) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => {
									const docObj = (rosterDoctors.length > 0 ? rosterDoctors : doctors).find((d) => d.id === activeChatAppt?.doctor_id) || {
										id: activeChatAppt?.doctor_id || "d1",
										name: "Dr. Menaka De Alwis",
										specialty: "Gynaecology",
										hospital: "Metro Cancer Institute",
										fee: 5500
									};
									setActiveChatAppt(null);
									setActiveVideoDoctor(docObj);
								},
								className: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs h-8.5 rounded-full font-bold gap-1.5 px-3.5 shadow-sm shrink-0 transition-transform active:scale-95",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Video Call" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: true,
								title: `Video call unlocks on ${activeChatAppt?.date}`,
								className: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 text-[11px] h-8.5 rounded-full font-medium gap-1 px-3 shrink-0 cursor-not-allowed opacity-80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Available ", activeChatAppt?.date] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto p-2 space-y-3 text-xs",
							children: chatMessages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex flex-col ${msg.sender === "patient" ? "items-end" : "items-start"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `max-w-[85%] p-3 rounded-2xl leading-relaxed ${msg.sender === "patient" ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700"}`,
									children: [
										msg.text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: msg.text }),
										msg.attachment?.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1 mt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: msg.attachment.url,
												alt: msg.attachment.name,
												className: "max-h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] opacity-80 block truncate font-mono",
												children: msg.attachment.name
											})]
										}),
										msg.attachment?.type === "pdf" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: msg.attachment.url,
											download: msg.attachment.name,
											target: "_blank",
											rel: "noopener noreferrer",
											className: `flex items-center gap-2.5 p-2.5 rounded-xl border mt-1 font-medium transition-all ${msg.sender === "patient" ? "bg-blue-700 border-blue-500 text-white hover:bg-blue-800" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 text-rose-500 shrink-0" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "overflow-hidden text-left",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-bold truncate",
														children: msg.attachment.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] opacity-75",
														children: "PDF Medical Document"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4 shrink-0 ml-auto opacity-80" })
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground mt-1 px-1",
									children: msg.timestamp
								})]
							}, msg.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							ref: fileInputRef,
							accept: "image/*,application/pdf",
							onChange: handlePatientFileUpload,
							className: "hidden"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "icon",
									onClick: () => fileInputRef.current?.click(),
									title: "Attach Photo or PDF document",
									className: "rounded-full size-10 text-slate-500 hover:text-blue-600 hover:bg-blue-50 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Type message or attach photo / PDF...",
									value: newMessageInput,
									onChange: (e) => setNewMessageInput(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && handleSendPatientMessage(),
									className: "text-xs h-10 rounded-full flex-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: handleSendPatientMessage,
									className: "bg-blue-600 hover:bg-blue-700 text-white rounded-full size-10 p-0 shrink-0 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!activeVideoDoctor,
				onOpenChange: () => setActiveVideoDoctor(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-2xl rounded-3xl p-0 overflow-hidden bg-slate-950 text-white border-slate-800 shadow-2xl",
					children: activeVideoDoctor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-[480px] flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex items-center justify-center bg-slate-900/90 overflow-hidden",
								children: [!isVideoOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative size-full flex items-center justify-center bg-radial from-slate-800 to-slate-950",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center space-y-3 z-10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
											className: "size-28 border-4 border-emerald-500/80 shadow-2xl mx-auto ring-4 ring-emerald-500/20 animate-pulse",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
												className: "bg-blue-700 text-white font-bold text-2xl",
												children: activeVideoDoctor.photoInitials || activeVideoDoctor.name.substring(0, 2).toUpperCase()
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-lg font-bold text-white",
											children: activeVideoDoctor.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 mt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400 animate-ping" }), "HD Encrypted Telemedicine Video Active"]
										})] })]
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-slate-500 text-xs font-semibold",
									children: "Camera Turned Off"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-20 right-4 w-36 h-24 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-xl overflow-hidden flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-slate-300",
										children: "You (Patient Feed)"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-20 flex items-center justify-between bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl border border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5",
										children: "LIVE"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-white",
										children: activeVideoDoctor.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-slate-400",
										children: activeVideoDoctor.specialty
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "border-slate-700 text-slate-300 text-xs font-mono font-bold px-3 py-1",
										children: formatCallTime(callDurationSeconds)
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-20 flex items-center justify-center gap-4 bg-slate-900/80 backdrop-blur-lg p-3 rounded-2xl border border-slate-800 max-w-md mx-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "icon",
										onClick: () => setIsMicMuted(!isMicMuted),
										className: `size-11 rounded-full border transition-all ${isMicMuted ? "bg-rose-600 border-rose-500 text-white" : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "icon",
										onClick: () => setIsVideoOff(!isVideoOff),
										className: `size-11 rounded-full border transition-all ${isVideoOff ? "bg-rose-600 border-rose-500 text-white" : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										onClick: () => {
											setActiveVideoDoctor(null);
											toast.info("Video meeting ended.");
										},
										className: "bg-rose-600 hover:bg-rose-700 text-white size-11 rounded-full font-bold shadow-lg p-0 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
									})
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, { className: "max-w-2xl mx-auto" })
		]
	});
}
//#endregion
export { TelemedicinePage as component };
