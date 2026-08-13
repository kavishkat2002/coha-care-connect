import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { n as getSession, r as onAuthStateChange } from "./auth.service-cQpuFi04.mjs";
import { Ct as Bot, Dt as Award, G as Lock, N as PhoneCall, P as Percent, Q as Heart, b as Shield, bt as Building2, c as User, et as Headphones, ft as CircleCheck, gt as Check, h as Ticket, kt as Activity, ot as Crown, s as Users, st as CreditCard, t as Zap, tt as FileText, vt as CalendarCheck, y as Sparkles } from "../_libs/lucide-react.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, t as Card } from "./card-BfBj_YIE.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as patientService } from "./patient.service-CVz31mvu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.epass-C_-jjo1w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CleanPassQRCode({ memberId, memberName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 33 33",
		className: "w-full h-full text-slate-900 fill-current",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "33",
				height: "33",
				fill: "white",
				rx: "6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3.5",
				y: "3.5",
				width: "7",
				height: "7",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5.8",
				y: "5.8",
				width: "2.4",
				height: "2.4",
				rx: "0.8",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "22.5",
				y: "3.5",
				width: "7",
				height: "7",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24.8",
				y: "5.8",
				width: "2.4",
				height: "2.4",
				rx: "0.8",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "3.5",
				y: "22.5",
				width: "7",
				height: "7",
				rx: "2",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5.8",
				y: "24.8",
				width: "2.4",
				height: "2.4",
				rx: "0.8",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "13",
				y: "4",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "17",
				y: "4",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "13",
				y: "8",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "18",
				y: "8",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "4",
				y: "13",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "8",
				y: "13",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "13",
				y: "13",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "17",
				y: "13",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "22",
				y: "13",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "27",
				y: "13",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "4",
				y: "17",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "9",
				y: "17",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14",
				y: "17",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "19",
				y: "17",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "24",
				y: "17",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "13",
				y: "22",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "18",
				y: "22",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "23",
				y: "22",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "14",
				y: "27",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "20",
				y: "27",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "26",
				y: "27",
				width: "2",
				height: "2",
				rx: "0.6",
				fill: "currentColor"
			})
		]
	});
}
var EPASS_PLANS = [
	{
		id: "silver",
		name: "Silver Health ePass",
		price: "LKR 2,500",
		period: "/ month",
		color: "from-slate-700 to-slate-900",
		features: [
			"Limited MedMind AI Health Assistant",
			"10% discount on laboratory reports",
			"Priority online appointment booking",
			"Digital health profile cloud sync",
			"Standard email & chat support"
		]
	},
	{
		id: "gold",
		name: "Gold Care ePass",
		price: "LKR 5,900",
		period: "/ month",
		popular: true,
		badge: "Most Popular",
		color: "from-blue-600 to-indigo-900",
		features: [
			"10K AI Credits for AI assistance",
			"Coverage for up to 4 family members",
			"1 free Telemedicine GP consultation / month",
			"20% discount on labs & imaging diagnostics",
			"Free home blood sample collection",
			"Fast-track OPD queue at partner hospitals",
			"24/7 priority clinical chat hotline"
		]
	},
	{
		id: "platinum",
		name: "Platinum ePass",
		price: "LKR 12,500",
		period: "/ month",
		color: "from-amber-600 to-amber-900",
		features: [
			"100K AI Credits for AI assistance",
			"Full family & senior care coverage",
			"Dedicated personal doctor liaison",
			"30% discount on specialist consultation fees",
			"Free annual executive health screening package",
			"Hospital admission fast-track",
			"24/7 emergency ambulance dispatch assistance"
		]
	}
];
function EPassPage() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [isSignedOut, setIsSignedOut] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return localStorage.getItem("meddoc_user_signed_out") === "true";
		return false;
	});
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [activePlan, setActivePlan] = (0, import_react.useState)(null);
	const [selectedPlanModal, setSelectedPlanModal] = (0, import_react.useState)(null);
	const [paymentMethod, setPaymentMethod] = (0, import_react.useState)("card");
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [profileMode, setProfileMode] = (0, import_react.useState)("existing");
	const [patientNameInput, setPatientNameInput] = (0, import_react.useState)("");
	const [patientPhoneInput, setPatientPhoneInput] = (0, import_react.useState)("");
	const [patientNicInput, setPatientNicInput] = (0, import_react.useState)("");
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		async function load() {
			const sess = await getSession();
			setSession(sess);
			if (!sess && localStorage.getItem("meddoc_user_signed_out") === "true") setIsSignedOut(true);
			const p = await patientService.getPatientProfile();
			setProfile(p);
			const savedPass = localStorage.getItem("meddoc_active_epass");
			if (savedPass) setActivePlan(savedPass);
			const pendingPlanId = localStorage.getItem("meddoc_pending_checkout_plan");
			if (pendingPlanId && (sess || p?.name)) {
				const found = EPASS_PLANS.find((item) => item.id === pendingPlanId);
				if (found) {
					setSelectedPlanModal(found);
					localStorage.removeItem("meddoc_pending_checkout_plan");
				}
			}
		}
		load();
		const unsub = onAuthStateChange((sess) => {
			setSession(sess);
			if (!sess) setIsSignedOut(true);
			else {
				setIsSignedOut(false);
				localStorage.setItem("meddoc_user_signed_out", "false");
			}
		});
		return () => {
			unsub.unsubscribe();
		};
	}, []);
	const handlePurchase = (plan) => {
		if (isSignedOut || !session && localStorage.getItem("meddoc_user_signed_out") === "true") {
			localStorage.setItem("meddoc_pending_checkout_plan", plan.id);
			toast.info("Please sign in or register your MedDoc account to activate your ePass membership.", { description: `Selected Plan: ${plan.name}` });
			navigate({ to: "/auth" });
			return;
		}
		setSelectedPlanModal(plan);
	};
	const confirmPurchase = async () => {
		if (!selectedPlanModal) return;
		setIsProcessing(true);
		await new Promise((r) => setTimeout(r, 1200));
		const targetName = patientNameInput.trim() || profile?.name || "Mahinda Rajapaksha";
		const targetPhone = patientPhoneInput.trim() || profile?.phone || "+94 77 123 4567";
		const targetNic = patientNicInput.trim() || profile?.nic || "781293849V";
		const updatedProfile = {
			...profile || {
				id: "p1",
				name: "Mahinda Rajapaksha",
				age: 62,
				gender: "Male",
				bloodGroup: "O+",
				city: "Tangalle",
				phone: "+94 77 123 4567",
				email: "m.rajapaksha@lifora.lk",
				pastDiseases: ["Hypertension"],
				medications: ["Amlodipine 5mg"],
				allergies: ["Penicillin"],
				familyHistory: ["Diabetes"]
			},
			name: targetName,
			phone: targetPhone,
			nic: targetNic
		};
		await patientService.updatePatientProfile(updatedProfile);
		setProfile(updatedProfile);
		await patientService.syncEPassMembershipToSupabase({
			patient_id: updatedProfile.id || "p1",
			patient_name: targetName,
			patient_phone: targetPhone,
			patient_nic: targetNic,
			plan_id: selectedPlanModal.id,
			plan_name: selectedPlanModal.name,
			status: "Active"
		});
		localStorage.setItem("meddoc_active_epass", selectedPlanModal.id);
		localStorage.setItem("meddoc_user_signed_out", "false");
		localStorage.setItem("meddoc_epass_activation_date", (/* @__PURE__ */ new Date()).toISOString());
		setIsSignedOut(false);
		setActivePlan(selectedPlanModal.id);
		setIsProcessing(false);
		setSelectedPlanModal(null);
		toast.success(`Congratulations! Your ${selectedPlanModal.name} is now active!`, { description: `Linked to MedDoc Patient Profile: ${targetName} (${targetPhone}) & synced with Supabase.` });
	};
	EPASS_PLANS.find((p) => p.id === activePlan);
	const memberName = profile?.name || "Mahinda Rajapaksha";
	const memberId = `ePASS-LK-${profile?.id ? profile.id.substring(0, 6).toUpperCase() : "11D71E"}`;
	const activationDateStr = localStorage.getItem("meddoc_epass_activation_date") || (/* @__PURE__ */ new Date()).toISOString();
	const activationDate = new Date(activationDateStr);
	const formattedExpiryDate = new Date(activationDate.getTime() + 2592e6).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
	`${encodeURIComponent(`MEDDOC DIGITAL HEALTH ePASS\n----------------------------\nMember Name: ${memberName}\nMember ID: ${memberId}\nPass Status: Active Membership (30 Days)\nValid Until: ${formattedExpiryDate}\nVerification: Hospital Counter Ready`)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 max-w-6xl mx-auto pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "MedDoc ePass Digital Health Membership",
				description: "Unlock priority hospital queue access, discounted lab tests, free telemedicine visits, and 24/7 clinical AI support."
			}),
			!isSignedOut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full",
				children: activePlan === "platinum" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl sm:rounded-[28px] p-4 sm:p-8 bg-gradient-to-br from-[#0F1117] via-[#161822] to-[#0D0E14] border border-slate-700/80 ring-1 ring-white/10 shadow-2xl text-slate-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -bottom-12 -right-12 opacity-[0.07] text-amber-300 pointer-events-none hidden sm:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "w-96 h-96" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 sm:gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-lg border border-amber-200/50 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-6 sm:size-7 fill-current" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-extrabold text-xl sm:text-2.5xl tracking-tight text-white leading-none",
										children: "MedDoc"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-xl sm:text-2.5xl text-amber-400 leading-none",
										children: "ePass"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm font-medium text-slate-400 mt-1",
									children: "Executive Health Membership"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-600/20 border border-amber-400/40 shadow-sm flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3.5 sm:size-4 text-amber-300 fill-amber-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] sm:text-xs font-bold text-amber-300 tracking-wide",
									children: "ACTIVE — Platinum ePass"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-5 sm:my-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-12 relative z-10 p-3.5 sm:p-0 rounded-xl bg-white/5 sm:bg-transparent border border-white/10 sm:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-slate-400",
									children: "MEMBER NAME"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl sm:text-2.5xl font-bold text-white mt-0.5 sm:mt-1",
									children: memberName
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden sm:block h-12 w-[1px] bg-slate-700/80" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-extrabold tracking-widest uppercase text-slate-400",
									children: "MEMBER ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg sm:text-xl font-mono font-bold text-amber-200 mt-0.5 sm:mt-1",
									children: memberId
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3.5 sm:p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 shadow-inner grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-4 relative z-10 my-4 sm:my-6",
							children: [
								{
									title: "100K AI Credits",
									desc: "100K AI Credits for AI assistance",
									icon: Bot
								},
								{
									title: "Personal Doctor",
									desc: "Dedicated personal doctor liaison",
									icon: User
								},
								{
									title: "30% Specialist Off",
									desc: "30% off specialist consultation fees",
									icon: Percent
								},
								{
									title: "Executive Health",
									desc: "Free annual executive health screening",
									icon: FileText
								},
								{
									title: "24/7 Priority Hotline",
									desc: "Instant priority ambulance & clinical hotline",
									icon: Headphones
								}
							].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center text-center p-2 md:border-r md:border-white/10 md:last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 flex items-center justify-center mb-2 shadow-sm shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4 sm:size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] sm:text-xs font-bold text-slate-100 leading-tight",
										children: item.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] sm:text-[11px] text-slate-400 mt-0.5 sm:mt-1 leading-snug",
										children: item.desc
									})
								]
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 pt-4 sm:pt-5 border-t border-slate-700/80 relative z-10 mt-4 sm:mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 sm:gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-slate-950 flex items-center justify-center shadow-md shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 sm:size-5 stroke-[3]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs sm:text-sm font-semibold text-slate-200",
									children: "Instant Hospital Fast-Track Verification"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs sm:text-sm font-semibold text-slate-400",
									children: ["Renews: ", formattedExpiryDate]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-amber-300/60 shadow-md flex items-center justify-center p-2 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CleanPassQRCode, {
										memberId,
										memberName
									})
								})]
							})]
						})
					]
				}) : activePlan === "gold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl sm:rounded-[28px] p-4 sm:p-8 bg-[#FAF6EE] dark:bg-[#1A1612] border border-[#E8DFC8] dark:border-[#3D3428] shadow-2xl text-slate-900 dark:text-amber-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -bottom-12 -right-12 opacity-[0.06] dark:opacity-[0.1] text-[#B38B3F] pointer-events-none hidden sm:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-96 h-96" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 sm:gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#E6C687] via-[#C5A059] to-[#9A7B38] flex items-center justify-center shadow-md border border-[#F5E6C4] shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-6 sm:size-7 fill-white text-white" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-extrabold text-xl sm:text-2.5xl tracking-tight text-[#0A2540] dark:text-white leading-none",
										children: "MedDoc"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-xl sm:text-2.5xl text-[#B38B3F] leading-none",
										children: "ePass"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm font-medium text-slate-600 dark:text-amber-200/70 mt-1",
									children: "Digital Health Membership"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-[#F5E2B8] via-[#E8CD90] to-[#D4B36A] dark:from-[#5C4924] dark:via-[#423317] dark:to-[#2B210F] border border-[#D1B168] dark:border-[#7A602B] shadow-sm flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-3.5 sm:size-4 text-[#7A5B1E] dark:text-amber-300 fill-[#7A5B1E] dark:fill-amber-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] sm:text-xs font-bold text-[#5C4212] dark:text-amber-200 tracking-wide",
									children: "ACTIVE — Gold Health ePass"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-5 sm:my-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-12 relative z-10 p-3.5 sm:p-0 rounded-xl bg-white/50 sm:bg-transparent border border-[#E8DFC8]/60 sm:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-amber-300/60",
									children: "MEMBER NAME"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl sm:text-2.5xl font-bold text-[#0A2540] dark:text-amber-100 mt-0.5 sm:mt-1",
									children: memberName
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden sm:block h-12 w-[1px] bg-[#E8DFC8] dark:bg-[#3D3428]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-400 dark:text-amber-300/60",
									children: "MEMBER ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg sm:text-xl font-mono font-bold text-[#0A2540] dark:text-amber-100 mt-0.5 sm:mt-1",
									children: memberId
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3.5 sm:p-5 rounded-2xl bg-white/70 dark:bg-[#241E18]/80 border border-[#E8DFC8]/80 dark:border-[#3D3428] shadow-xs grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-4 relative z-10 my-4 sm:my-6",
							children: [
								{
									title: "10K AI Credits",
									desc: "10K AI Credits for AI assistance",
									icon: Bot
								},
								{
									title: "Priority Appointments",
									desc: "Fastest bookings at top hospitals",
									icon: CalendarCheck
								},
								{
									title: "Advanced Health Records",
									desc: "Secure access & sharing of your health data",
									icon: FileText
								},
								{
									title: "Exclusive Discounts",
									desc: "Save more on tests, medicines & services",
									icon: Percent
								},
								{
									title: "24/7 Premium Support",
									desc: "Dedicated support whenever you need",
									icon: Headphones
								}
							].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center text-center p-2 md:border-r md:border-[#E8DFC8]/60 md:last:border-0 md:dark:border-[#3D3428]/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F7EEDC] dark:bg-[#34291B] border border-[#E5CE9F] dark:border-[#52412A] text-[#B38B3F] dark:text-amber-300 flex items-center justify-center mb-2 shadow-xs shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4 sm:size-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] sm:text-xs font-bold text-slate-900 dark:text-amber-100 leading-tight",
										children: item.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] sm:text-[11px] text-slate-500 dark:text-amber-200/70 mt-0.5 sm:mt-1 leading-snug",
										children: item.desc
									})
								]
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 pt-4 sm:pt-5 border-t border-[#E8DFC8] dark:border-[#3D3428] relative z-10 mt-4 sm:mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 sm:gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#D9B668] to-[#A38136] text-white flex items-center justify-center shadow-xs shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 sm:size-5 stroke-[3]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs sm:text-sm font-semibold text-slate-800 dark:text-amber-100",
									children: "Instant Hospital Counter Verification"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs sm:text-sm font-semibold text-slate-700 dark:text-amber-200/80",
									children: ["Renews: ", formattedExpiryDate]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border border-[#E8DFC8] shadow-md flex items-center justify-center p-2 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CleanPassQRCode, {
										memberId,
										memberName
									})
								})]
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-2xl sm:rounded-[28px] p-4 sm:p-8 bg-[#F4F8FC] dark:bg-[#0D1627] border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 w-36 h-20 bg-[#0E5CA8]/10 rounded-br-full pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -bottom-10 -right-10 opacity-[0.06] dark:opacity-[0.1] text-[#0E5CA8] pointer-events-none hidden sm:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-72 h-72" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#0052CC] to-[#0A66C2] flex items-center justify-center text-white shadow-md shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-5 sm:size-6 fill-white text-white" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-xl sm:text-2xl tracking-tight text-[#0A2540] dark:text-white leading-none",
											children: "MedDoc"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1",
											children: "Your Health, Our Priority"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-9 w-[1px] bg-slate-300 dark:bg-slate-700 hidden sm:block" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "hidden sm:block",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-slate-800 dark:text-slate-200",
												children: "Digital Health Membership"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-500 dark:text-slate-400 font-medium",
												children: "Access Better Care, Anytime"
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 border border-slate-300/80 dark:border-slate-600 shadow-sm flex items-center gap-2.5 sm:gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-1 sm:p-1.5 rounded-full bg-slate-800 text-slate-100 shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-3.5 sm:size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100",
									children: "SILVER TIER"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-300",
									children: "Silver Health ePass"
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "my-4 sm:my-6 p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 sm:gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 sm:size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-400 uppercase tracking-widest font-bold",
										children: "MEMBER NAME"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5",
										children: memberName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400",
										children: "MedDoc Digital Health Member"
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 sm:gap-4 sm:border-l sm:border-slate-200 sm:dark:border-slate-800 sm:pl-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { className: "size-4 sm:size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-400 uppercase tracking-widest font-bold",
									children: "MEMBER ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white mt-0.5",
									children: memberId
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-4 sm:my-6 relative z-10",
							children: [
								{
									label: "Priority Appointment Booking",
									icon: CalendarCheck
								},
								{
									label: "Limited AI Health Assistant Access",
									icon: Sparkles
								},
								{
									label: "Digital Health Records Storage",
									icon: FileText
								},
								{
									label: "Exclusive Health Offers & Discounts",
									icon: Percent
								}
							].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 sm:p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 flex items-center gap-2.5 sm:gap-3 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-1.5 sm:p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-3.5 sm:size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] sm:text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200",
									children: item.label
								})]
							}, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 w-full sm:w-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 sm:size-6 text-emerald-600 fill-emerald-100 dark:fill-emerald-950 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] sm:text-xs font-bold leading-none",
									children: "Hospital Counter Verification Ready"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] sm:text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-1",
									children: "Present this ePass for instant verification"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-left sm:text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest",
										children: "VALID UNTIL"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5",
										children: formattedExpiryDate
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white border border-slate-200/80 shadow-md flex items-center justify-center p-2 sm:p-2.5 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CleanPassQRCode, {
										memberId,
										memberName
									})
								})]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					{
						icon: Building2,
						title: "Priority Queue",
						desc: "Fast-track OPD check-in"
					},
					{
						icon: Sparkles,
						title: "Lab Discounts",
						desc: "Up to 30% off diagnostics"
					},
					{
						icon: PhoneCall,
						title: "24/7 Telehealth",
						desc: "Instant GP video consults"
					},
					{
						icon: Users,
						title: "Family Coverage",
						desc: "Add parents & children"
					}
				].map((b, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4 border-border shadow-soft flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.icon, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold leading-tight",
						children: b.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: b.desc
					})] })]
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center space-y-2 max-w-xl mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold text-foreground",
						children: "Select Your MedDoc ePass Plan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Choose the membership tier that fits your healthcare needs. Upgrade or cancel anytime."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-6 md:grid-cols-3 items-stretch",
					children: EPASS_PLANS.map((plan) => {
						const isCurrent = activePlan === plan.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: `relative flex flex-col justify-between border transition-all ${plan.popular ? "border-blue-500 shadow-lg ring-2 ring-blue-500/20 dark:ring-blue-500/40" : "border-border shadow-soft hover:shadow-md"}`,
							children: [
								plan.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute -top-3 left-1/2 -translate-x-1/2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-blue-600 text-white px-3 py-1 font-semibold shadow-sm",
										children: plan.badge
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "pt-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-lg font-bold",
										children: plan.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-baseline gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-3xl font-extrabold tracking-tight text-foreground",
											children: plan.price
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground font-medium",
											children: plan.period
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "space-y-3 flex-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-t border-border pt-4 space-y-2.5",
										children: plan.features.map((feat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-2 text-xs text-muted-foreground leading-relaxed",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-500 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: feat })]
										}, i))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
									className: "pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => handlePurchase(plan),
										disabled: isCurrent,
										className: `w-full font-medium rounded-xl h-11 ${isCurrent ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-default" : plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-secondary hover:bg-secondary/80 text-foreground"}`,
										children: isCurrent ? "Active Membership" : `Get ${plan.name}`
									})
								})
							]
						}, plan.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedPlanModal,
				onOpenChange: () => setSelectedPlanModal(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2 text-lg font-bold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-5 text-blue-600 dark:text-blue-400" }),
								"Activate ",
								selectedPlanModal?.name
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Complete payment to activate instant MedDoc ePass membership benefits."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex justify-between items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-slate-900 dark:text-white",
										children: selectedPlanModal?.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-slate-500 dark:text-slate-400",
										children: "Monthly MedDoc Digital Membership"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-lg font-extrabold text-blue-600 dark:text-blue-400",
										children: selectedPlanModal?.price
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-bold text-slate-900 dark:text-white",
										children: "Payment Method"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: paymentMethod === "card" ? "default" : "outline",
												onClick: () => setPaymentMethod("card"),
												className: "text-xs h-9 gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-3.5" }), "Card"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: paymentMethod === "ezcash" ? "default" : "outline",
												onClick: () => setPaymentMethod("ezcash"),
												className: "text-xs h-9 gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }), "eZ Cash"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: paymentMethod === "bank" ? "default" : "outline",
												onClick: () => setPaymentMethod("bank"),
												className: "text-xs h-9 gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5" }), "Bank Transfer"]
											})
										]
									})]
								}),
								paymentMethod === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-[11px]",
											children: "Cardholder Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											defaultValue: profile?.name || "Mahinda Rajapaksha",
											className: "mt-1 h-9 text-xs"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-[11px]",
											children: "Card Number"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "4532 •••• •••• 8910",
											className: "mt-1 h-9 text-xs font-mono"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px]",
												children: "Expiry Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "MM/YY",
												className: "mt-1 h-9 text-xs"
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[11px]",
												children: "CVV"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "•••",
												type: "password",
												maxLength: 4,
												className: "mt-1 h-9 text-xs"
											})] })]
										})
									]
								}),
								paymentMethod === "ezcash" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px]",
										children: "Mobile Wallet Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "+94 77 123 4567",
										defaultValue: profile?.phone || "+94 77 123 4567",
										className: "h-9 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "256-bit SSL encrypted secure payment process." })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setSelectedPlanModal(null),
								disabled: isProcessing,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: confirmPurchase,
								disabled: isProcessing,
								className: "bg-blue-600 hover:bg-blue-700 text-white font-medium",
								children: isProcessing ? "Processing Activation..." : "Confirm Payment & Activate ePass"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { EPassPage as component };
