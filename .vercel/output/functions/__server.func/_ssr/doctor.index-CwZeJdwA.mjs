import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.mjs";
import { A as Pill, B as MessageSquare, C as Send, Ct as Bot, Dt as Award, I as Paperclip, _ as Stethoscope, at as Download, d as UserCheck, dt as CircleX, ft as CircleCheck, kt as Activity, nt as Eye, o as Video, p as TriangleAlert, s as Users, tt as FileText, vt as CalendarCheck } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as StatCard } from "./StatCard-KAFspyoq.mjs";
import { t as AiDisclaimer } from "./AiDisclaimer-DQCQj0Xf.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as patientService } from "./patient.service-ClJFNjzy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/doctor.index-CwZeJdwA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DoctorDashboard() {
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [selectedPatientProfile, setSelectedPatientProfile] = (0, import_react.useState)(null);
	const [viewingAppt, setViewingAppt] = (0, import_react.useState)(null);
	const [chatAppt, setChatAppt] = (0, import_react.useState)(null);
	const [chatMessages, setChatMessages] = (0, import_react.useState)([]);
	const [replyInput, setReplyInput] = (0, import_react.useState)("");
	const [activeDoctorVideoAppt, setActiveDoctorVideoAppt] = (0, import_react.useState)(null);
	const [callDurationSeconds, setCallDurationSeconds] = (0, import_react.useState)(0);
	const doctorFileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		async function fetchAppts() {
			const allAppts = await patientService.getAppointments();
			setAppointments(allAppts.sort((a, b) => a.time.localeCompare(b.time)));
			const p = await patientService.getPatientProfile();
			setSelectedPatientProfile(p);
		}
		fetchAppts();
	}, []);
	(0, import_react.useEffect)(() => {
		let timer;
		if (activeDoctorVideoAppt) timer = setInterval(() => {
			setCallDurationSeconds((prev) => prev + 1);
		}, 1e3);
		else setCallDurationSeconds(0);
		return () => clearInterval(timer);
	}, [activeDoctorVideoAppt]);
	const formatCallTime = (totalSeconds) => {
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};
	const handleApproveAppointment = (apptId) => {
		setAppointments((prev) => prev.map((a) => a.id === apptId ? {
			...a,
			status: "Approved"
		} : a));
		toast.success("Telemedicine Consultation Request Approved!", { description: "Patient profile health background verified. 2-way chat follow-up unlocked." });
	};
	const handleEndSession = (apptId) => {
		setAppointments((prev) => prev.map((a) => a.id === apptId ? {
			...a,
			status: "Completed"
		} : a));
		const savedAppts = localStorage.getItem("meddoc_appointments");
		if (savedAppts) try {
			const updated = JSON.parse(savedAppts).map((a) => a.id === apptId ? {
				...a,
				status: "Completed"
			} : a);
			localStorage.setItem("meddoc_appointments", JSON.stringify(updated));
		} catch (e) {}
		toast.info("Telemedicine consultation session ended.", { description: "Appointment marked as completed and archived." });
	};
	const handleDeclineAppointment = (apptId) => {
		setAppointments((prev) => prev.map((a) => a.id === apptId ? {
			...a,
			status: "Declined"
		} : a));
		toast.info("Appointment declined.");
	};
	const openDoctorChat = (appt) => {
		setChatAppt(appt);
		const chatKey = `meddoc_chat_${appt.id}`;
		const stored = localStorage.getItem(chatKey);
		if (stored) try {
			setChatMessages(JSON.parse(stored));
		} catch (e) {
			setChatMessages(getDefaultChat(appt));
		}
		else {
			const init = getDefaultChat(appt);
			setChatMessages(init);
			localStorage.setItem(chatKey, JSON.stringify(init));
		}
	};
	const getDefaultChat = (appt) => [{
		id: "m1",
		sender: "doctor",
		text: `Hello ${appt.patient_name || "Patient"}, I have reviewed your health background & ePass profile. Your consultation request is approved.`,
		timestamp: "09:30 AM"
	}];
	const handleSendDoctorReply = () => {
		if (!replyInput.trim() || !chatAppt) return;
		const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
		const doctorMsg = {
			id: "doc-reply-" + Date.now(),
			sender: "doctor",
			text: replyInput.trim(),
			timestamp: nowTime
		};
		const updated = [...chatMessages, doctorMsg];
		setChatMessages(updated);
		setReplyInput("");
		const chatKey = `meddoc_chat_${chatAppt.id}`;
		localStorage.setItem(chatKey, JSON.stringify(updated));
		toast.success("Follow-up message sent to patient!");
	};
	const handleDoctorFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file || !chatAppt) return;
		const reader = new FileReader();
		reader.onload = (event) => {
			const fileUrl = event.target?.result;
			const isPdf = file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf");
			const isImg = file.type.startsWith("image/");
			if (!isPdf && !isImg) {
				toast.error("Please upload an image (JPG, PNG) or PDF prescription document");
				return;
			}
			const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			});
			const fileMsg = {
				id: "doc-file-" + Date.now(),
				sender: "doctor",
				attachment: {
					type: isPdf ? "pdf" : "image",
					url: fileUrl,
					name: file.name
				},
				timestamp: nowTime
			};
			const updated = [...chatMessages, fileMsg];
			setChatMessages(updated);
			const chatKey = `meddoc_chat_${chatAppt.id}`;
			localStorage.setItem(chatKey, JSON.stringify(updated));
			toast.success(`Sent ${isPdf ? "PDF prescription" : "photo"} to patient!`);
			if (doctorFileInputRef.current) doctorFileInputRef.current.value = "";
		};
		reader.readAsDataURL(file);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 max-w-6xl mx-auto pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Doctor Clinical Dashboard",
				description: "Review patient health backgrounds, approve telemedicine requests, and launch instant video calls."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: CalendarCheck,
						label: "Appointments today",
						value: appointments.length.toString(),
						hint: "Live from booking system"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Users,
						label: "Waiting now",
						value: "3",
						hint: "Average wait 12 min"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Bot,
						label: "AI assessments to review",
						value: "6",
						hint: "2 flagged moderate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Stethoscope,
						label: "Follow-ups due",
						value: "5",
						hint: "This week"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-base font-bold flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Telemedicine Consultation Requests & Queue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold",
						children: "Live Patient Requests"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Inspect requested patient health history, medical conditions, and approve telemedicine consultations." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Patient Details" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Schedule Time" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Health Profile & ePass" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Actions"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: appointments.length > 0 ? appointments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-slate-900 dark:text-white",
								children: a.patient_name || a.patient_id || "Mahinda Rajapaksha"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: a.patient_mobile || "+94 77 123 4567"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold",
							children: a.date
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: a.time
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setViewingAppt(a),
							className: "text-xs h-8 gap-1.5 rounded-lg border-blue-200 text-blue-700 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }), "View Health Background"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: a.status === "Completed" ? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 font-semibold" : a.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 font-semibold" : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 font-semibold",
							children: a.status || "Pending Approval"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right space-x-2",
							children: a.status === "Approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: () => setActiveDoctorVideoAppt(a),
										className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 rounded-lg font-bold gap-1 shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-3.5 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Start Video Call" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => openDoctorChat(a),
										className: "text-xs h-8 rounded-lg gap-1 border-slate-200 dark:border-slate-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chat" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => handleEndSession(a.id || ""),
										title: "Complete and end consultation session",
										className: "text-xs h-8 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40 rounded-lg gap-1 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "End Session" })]
									})
								]
							}) : a.status === "Completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold text-xs py-1 px-2.5",
									children: "Session Ended"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => openDoctorChat(a),
									className: "text-xs h-8 rounded-lg gap-1 border-slate-200 dark:border-slate-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Log" })]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => handleApproveAppointment(a.id || ""),
								className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 gap-1 rounded-lg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5" }), "Approve"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => handleDeclineAppointment(a.id || ""),
								className: "text-xs h-8 text-rose-600 border-rose-200 hover:bg-rose-50 rounded-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3.5" })
							})] })
						})
					] }, a.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 5,
						className: "text-center text-muted-foreground py-6",
						children: "No telemedicine appointment requests today."
					}) }) })] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!viewingAppt,
				onOpenChange: () => setViewingAppt(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg rounded-2xl max-h-[85vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-base font-bold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-5 text-blue-600 dark:text-blue-400" }), "Patient Health Background & Medical Record"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Review verified patient conditions, medications, allergies & MedDoc ePass tier prior to consultation."
						})] }),
						viewingAppt && selectedPatientProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold",
											children: "Patient Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-bold text-slate-900 dark:text-white mt-0.5",
											children: viewingAppt.patient_name || selectedPatientProfile.name
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold",
											children: "Age & Gender"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-sm font-bold text-slate-900 dark:text-white mt-0.5",
											children: [
												selectedPatientProfile.age,
												" Yrs • ",
												selectedPatientProfile.gender
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold",
											children: "Phone Number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5",
											children: viewingAppt.patient_mobile || selectedPatientProfile.phone
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground font-bold",
											children: "NIC / Passport"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 mt-0.5",
											children: selectedPatientProfile.nic || "781293849V"
										})] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-5 text-amber-600 dark:text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-amber-950 dark:text-amber-200",
											children: "Gold Care ePass Digital Member"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-amber-800 dark:text-amber-300",
											children: "Verified Priority Healthcare Access • 10K AI Credits"
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-amber-600 text-white text-[10px] font-bold",
										children: "Active ePass"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-blue-600" }), "Past Medical Conditions & Chronic Illnesses"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5 pt-1",
										children: selectedPatientProfile.pastDiseases?.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-[11px] font-medium",
											children: d
										}, i)) || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "None documented"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { className: "size-4 text-purple-600" }), "Current Active Medications"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5 pt-1",
										children: selectedPatientProfile.medications?.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200 text-[11px]",
											children: m
										}, i)) || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "None"
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3.5 text-rose-600" }), "Known Allergies"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-rose-800 dark:text-rose-300 font-medium",
											children: selectedPatientProfile.allergies?.join(", ") || "No known allergies"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-slate-900 dark:text-white",
											children: "Family History"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-slate-600 dark:text-slate-400",
											children: selectedPatientProfile.familyHistory?.join(", ") || "None"
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (viewingAppt) handleApproveAppointment(viewingAppt.id || "");
								setViewingAppt(null);
							},
							className: "bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl w-full",
							children: "Approve Patient Consultation & Unlock Telemedicine"
						}) })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!chatAppt,
				onOpenChange: () => setChatAppt(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl flex flex-col h-[540px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
							className: "pb-2 border-b border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center justify-between text-sm font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "leading-none text-slate-900 dark:text-white",
									children: ["Patient Consultation: ", chatAppt?.patient_name || "Patient"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-emerald-600 dark:text-emerald-400 font-normal mt-0.5 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }), "Photos & PDF Sharing Enabled"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => {
										const targetAppt = chatAppt;
										setChatAppt(null);
										setActiveDoctorVideoAppt(targetAppt);
									},
									className: "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 rounded-xl font-bold gap-1 px-3 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-3.5 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Video Call" })]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto p-2 space-y-3 text-xs",
							children: chatMessages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex flex-col ${msg.sender === "doctor" ? "items-end" : "items-start"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `max-w-[85%] p-3 rounded-2xl leading-relaxed ${msg.sender === "doctor" ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700"}`,
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
											className: `flex items-center gap-2.5 p-2.5 rounded-xl border mt-1 font-medium transition-all ${msg.sender === "doctor" ? "bg-blue-700 border-blue-500 text-white hover:bg-blue-800" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50"}`,
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
							ref: doctorFileInputRef,
							accept: "image/*,application/pdf",
							onChange: handleDoctorFileUpload,
							className: "hidden"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-2 border-t border-border flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "icon",
									onClick: () => doctorFileInputRef.current?.click(),
									title: "Attach Photo or PDF document",
									className: "rounded-full size-10 text-slate-500 hover:text-blue-600 hover:bg-blue-50 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Send doctor follow-up or attach photo / PDF...",
									value: replyInput,
									onChange: (e) => setReplyInput(e.target.value),
									onKeyDown: (e) => e.key === "Enter" && handleSendDoctorReply(),
									className: "text-xs h-10 rounded-full flex-1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: handleSendDoctorReply,
									className: "bg-blue-600 hover:bg-blue-700 text-white rounded-full size-10 p-0 shrink-0 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!activeDoctorVideoAppt,
				onOpenChange: () => setActiveDoctorVideoAppt(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-2xl rounded-3xl p-0 overflow-hidden bg-slate-950 text-white border-slate-800 shadow-2xl",
					children: activeDoctorVideoAppt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-[480px] flex flex-col justify-between p-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex items-center justify-center bg-slate-900/90 overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative size-full flex items-center justify-center bg-radial from-slate-800 to-slate-950",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center space-y-3 z-10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
											className: "size-28 border-4 border-emerald-500/80 shadow-2xl mx-auto ring-4 ring-emerald-500/20 animate-pulse",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
												className: "bg-blue-700 text-white font-bold text-2xl",
												children: activeDoctorVideoAppt.patient_name?.substring(0, 2).toUpperCase() || "MR"
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-lg font-bold text-white",
											children: activeDoctorVideoAppt.patient_name || "Mahinda Rajapaksha"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5 mt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400 animate-ping" }), "Patient Telemedicine Live Video Stream Connected"]
										})] })]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-20 right-4 w-36 h-24 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-xl overflow-hidden flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-bold text-slate-300",
										children: "You (Doctor Feed)"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative z-20 flex items-center justify-between bg-slate-900/60 backdrop-blur-md p-3 rounded-2xl border border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase px-2 py-0.5",
										children: "LIVE CONSULTATION"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-bold text-white",
										children: activeDoctorVideoAppt.patient_name || "Mahinda Rajapaksha"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[10px] text-slate-400",
										children: ["Scheduled: ", activeDoctorVideoAppt.time]
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "icon",
									className: "size-11 rounded-full border bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: () => {
										setActiveDoctorVideoAppt(null);
										toast.info("Doctor video call session ended.");
									},
									className: "bg-rose-600 hover:bg-rose-700 text-white size-11 rounded-full font-bold shadow-lg p-0 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, { className: "max-w-2xl" })
		]
	});
}
//#endregion
export { DoctorDashboard as component };
