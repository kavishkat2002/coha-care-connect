import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { $ as HeartPulse, Ct as Bot, Z as Image, f as Upload, kt as Activity, tt as FileText, vt as CalendarCheck } from "../_libs/lucide-react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as StatCard } from "./StatCard-KAFspyoq.mjs";
import { t as AiDisclaimer } from "./AiDisclaimer-DQCQj0Xf.mjs";
import { c as doctors, l as hospitals, u as init_mock } from "./server-qE7WcvYQ.mjs";
import { t as patientService } from "./patient.service-ClJFNjzy.mjs";
import { t as Separator } from "./separator-B3hsz7IR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.index-Cq2cCCYf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
init_mock();
var quickActions = [
	{
		label: "Book appointment",
		to: "/patient/book",
		icon: CalendarCheck
	},
	{
		label: "Start AI chat",
		to: "/patient/assistant",
		icon: Bot
	},
	{
		label: "Upload report",
		to: "/patient/reports",
		icon: Upload
	},
	{
		label: "Upload medical image",
		to: "/patient/images",
		icon: Image
	}
];
function getDynamicHealthInsights(profile, reports) {
	const insights = [];
	if (profile) {
		if (profile.allergies && profile.allergies.length > 0) insights.push(`Allergy warning active: ${profile.allergies.join(", ")} — inform attending clinicians before new prescriptions.`);
		if (profile.pastDiseases && profile.pastDiseases.length > 0) {
			const diseaseStr = profile.pastDiseases.slice(0, 2).join(" & ");
			insights.push(`Medical history noted (${diseaseStr}) — periodic routine checkups recommended to monitor stability.`);
		}
		if (profile.medications && profile.medications.length > 0) insights.push(`Active prescribed medications: ${profile.medications.slice(0, 2).join(", ")} — adhere to prescribed dosage schedule.`);
		if (profile.familyHistory && profile.familyHistory.length > 0) insights.push(`Family history noted: ${profile.familyHistory.join("; ")} — consider specialized preventive screening.`);
		if (profile.age && profile.age >= 60) insights.push(`Senior health profile (${profile.age} yrs): Annual comprehensive geriatric & cardiovascular screening recommended.`);
	}
	const flaggedReport = reports.find((r) => (r.flagged || 0) > 0);
	if (flaggedReport) insights.push(`Recent report alert: "${flaggedReport.title}" contains ${flaggedReport.flagged} flagged parameter(s) needing physician review.`);
	if (insights.length === 0) {
		insights.push("Annual routine wellness checkup is due — keep your health record up to date.");
		insights.push("Maintain hydration and daily physical activity for optimal health maintenance.");
	}
	return insights.slice(0, 4);
}
function PatientOverview() {
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	const [patientProfile, setPatientProfile] = (0, import_react.useState)(null);
	const [reports, setReports] = (0, import_react.useState)([]);
	const [timeline, setTimeline] = (0, import_react.useState)([]);
	const [chatMessagesCount, setChatMessagesCount] = (0, import_react.useState)(0);
	const [reportsAnalysedCount, setReportsAnalysedCount] = (0, import_react.useState)(0);
	const [healthScore, setHealthScore] = (0, import_react.useState)(82);
	const [healthHint, setHealthHint] = (0, import_react.useState)("Stable this month");
	(0, import_react.useEffect)(() => {
		async function loadData() {
			const [appts, profile, rpts, tl] = await Promise.all([
				patientService.getAppointments(),
				patientService.getPatientProfile(),
				patientService.getReports(),
				patientService.getTimeline()
			]);
			setAppointments(appts);
			setPatientProfile(profile);
			setReports(rpts);
			setTimeline(tl);
			const totalReports = Math.max(rpts.length, 4);
			setReportsAnalysedCount(totalReports);
			let chatCount = 18;
			const savedMessages = localStorage.getItem("meddoc_messages");
			if (savedMessages) try {
				const messages = JSON.parse(savedMessages);
				if (Array.isArray(messages) && messages.length > 0) {
					chatCount = Math.max(18, messages.length);
					const attachmentsCount = messages.filter((m) => m.attachment || m.imageBase64).length;
					setReportsAnalysedCount(totalReports + attachmentsCount);
				}
			} catch (e) {}
			setChatMessagesCount(chatCount);
			let score = 78;
			let hint = "Needs periodic checkups";
			if (profile) {
				const diseaseCount = profile.pastDiseases?.length || 0;
				score = Math.max(45, 92 - diseaseCount * 7);
				if (score >= 80) hint = "Stable health record";
				else if (score >= 65) hint = "Needs periodic checkups";
				else hint = "Requires clinician review";
			}
			const savedAssessment = localStorage.getItem("meddoc_assessment");
			if (savedAssessment) try {
				const assessment = JSON.parse(savedAssessment);
				if (assessment.risk === "low") {
					setHealthScore(94);
					setHealthHint("Looking great based on assessment");
				} else if (assessment.risk === "moderate") {
					setHealthScore(72);
					setHealthHint("Needs attention soon");
				} else if (assessment.risk === "elevated") {
					setHealthScore(45);
					setHealthHint("Action required immediately");
				} else {
					setHealthScore(score);
					setHealthHint(hint);
				}
			} catch (e) {
				setHealthScore(score);
				setHealthHint(hint);
			}
			else {
				setHealthScore(score);
				setHealthHint(hint);
			}
		}
		loadData();
		const channel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("coha_profile_sync") : null;
		if (channel) channel.onmessage = () => {
			loadData();
		};
		const handleStorage = (e) => {
			if (e.key === "coha_patient_profile_shared" || e.key === "mock_appointments") loadData();
		};
		window.addEventListener("storage", handleStorage);
		const pollInterval = setInterval(() => {
			loadData();
		}, 3e3);
		return () => {
			channel?.close();
			window.removeEventListener("storage", handleStorage);
			clearInterval(pollInterval);
		};
	}, []);
	const todayStart = /* @__PURE__ */ new Date();
	todayStart.setHours(0, 0, 0, 0);
	const upcoming = appointments.filter((a) => {
		if (a.status === "Completed" || a.status === "Cancelled") return false;
		const apptTime = new Date(a.date).getTime();
		return isNaN(apptTime) || apptTime >= todayStart.getTime();
	}).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	const nextVisitHint = upcoming[0]?.date ? `Next: ${upcoming[0].date}` : "No upcoming visits";
	if (!patientProfile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Loading dashboard..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Good day, ${patientProfile.name.split(" ")[0]}`,
				description: "Here is your current health picture and what needs attention next."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: HeartPulse,
						label: "Health score",
						value: `${healthScore} / 100`,
						hint: healthHint
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: CalendarCheck,
						label: "Upcoming visits",
						value: String(upcoming.length || 10),
						hint: nextVisitHint
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: FileText,
						label: "Reports analysed",
						value: String(reportsAnalysedCount),
						hint: `${reports.filter((r) => r.flagged > 0).length || 1} flagged value`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Activity,
						label: "AI Interactions",
						value: String(chatMessagesCount),
						hint: "Recent collaborations"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Upcoming appointments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Confirmed and pending visits" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [upcoming.map((a) => {
							const doc = doctors.find((d) => d.id === a.doctor_id);
							const hosp = hospitals.find((h) => h.id === a.hospital_id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: doc ? doc.name : a.doctor_id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										doc ? doc.specialty : "General",
										" · ",
										hosp ? hosp.name : a.hospital_id
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-medium",
										children: [
											a.date,
											" · ",
											a.time
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: a.status === "Confirmed" ? "secondary" : "outline",
										className: "mt-1",
										children: a.status
									})]
								})]
							}, a.id);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/patient/appointments",
								children: "View appointment history"
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Quick actions"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "grid gap-2",
						children: quickActions.map((qa) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "justify-start",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: qa.to,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(qa.icon, { className: "mr-2 size-4" }),
									" ",
									qa.label
								]
							})
						}, qa.to))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Recent reports"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "AI summaries of your uploads" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-4",
						children: reports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: r.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: r.status === "Analysed" ? "secondary" : "outline",
									children: r.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									r.type,
									" · ",
									r.date,
									" · ",
									r.flagged,
									" flagged value(s)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: r.summary
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "mt-4" })
						] }, r.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Personal health insights"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Generated dynamically from your health profile & medical records" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3",
						children: [getDynamicHealthInsights(patientProfile, reports).map((insight, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed",
							children: insight
						}, idx)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, {})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { PatientOverview as component };
