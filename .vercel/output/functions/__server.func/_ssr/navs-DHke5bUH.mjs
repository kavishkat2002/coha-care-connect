import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { n as getSession, o as signOut, r as onAuthStateChange } from "./auth.service-cQpuFi04.mjs";
import { t as Logo } from "./Logo-yB58szO4.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.mjs";
import { A as Pill, B as MessageSquare, Ct as Bot, Dt as Award, J as LayoutDashboard, Tt as Bell, V as Menu, W as LogOut, X as Info, Z as Image, _ as Stethoscope, _t as Calendar, bt as Building2, ft as CircleCheck, gt as Check, kt as Activity, l as UserRound, lt as ClipboardList, m as Trash2, rt as ExternalLink, tt as FileText, vt as CalendarCheck } from "../_libs/lucide-react.mjs";
import { i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuSeparator, r as DropdownMenuItem, t as DropdownMenu, u as DropdownMenuTrigger } from "./dropdown-menu-ixSL0whH.mjs";
import { i as SheetTrigger, n as SheetContent, r as SheetTitle, t as Sheet } from "./sheet-CgVIxXqZ.mjs";
import { d as useRouterState, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/navs-DHke5bUH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_NOTIFICATIONS = [
	{
		id: "n1",
		type: "message",
		title: "New Doctor Message & Prescription",
		description: "Dr. Menaka De Alwis sent a follow-up chat message with a PDF medical document.",
		time: "5 mins ago",
		read: false,
		link: "/patient/telemedicine"
	},
	{
		id: "n2",
		type: "appointment",
		title: "Scheduled Video Consultation Today",
		description: "Your Telemedicine video meeting with Dr. Menaka De Alwis is ready for launch.",
		time: "30 mins ago",
		read: false,
		link: "/patient/telemedicine"
	},
	{
		id: "n3",
		type: "medication",
		title: "MedMind Daily Pill Reminder",
		description: "Scheduled dose: Amoxicillin 500mg (Post-lunch). Tap to view dosage schedule.",
		time: "Today, 01:30 PM",
		read: false,
		link: "/patient/medmind-ecare"
	},
	{
		id: "n4",
		type: "epass",
		title: "Digital Health ePass Active",
		description: "Your Gold Care Digital Membership is active and valid for 30 days.",
		time: "Yesterday",
		read: true,
		link: "/patient/epass"
	},
	{
		id: "n5",
		type: "system",
		title: "HD Video Call Feature Enabled",
		description: "Direct 2-way HD video meetings are unlocked for your scheduled consultations.",
		time: "2 days ago",
		read: true,
		link: "/patient/telemedicine"
	}
];
function PortalShell({ nav, portalLabel, children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [notifications, setNotifications] = (0, import_react.useState)(() => {
		const saved = localStorage.getItem("meddoc_notifications");
		if (saved) try {
			return JSON.parse(saved);
		} catch (e) {}
		return INITIAL_NOTIFICATIONS;
	});
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		getSession().then((s) => {
			setSession(s);
			setIsLoading(false);
		});
		const unsubscribe = onAuthStateChange((s) => {
			setSession(s);
			setIsLoading(false);
		});
		return () => {
			unsubscribe.unsubscribe();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("meddoc_notifications", JSON.stringify(notifications));
	}, [notifications]);
	(0, import_react.useEffect)(() => setOpen(false), [pathname]);
	const unreadCount = notifications.filter((n) => !n.read).length;
	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({
			...n,
			read: true
		})));
		toast.success("All notifications marked as read");
	};
	const markAsRead = (id) => {
		setNotifications((prev) => prev.map((n) => n.id === id ? {
			...n,
			read: true
		} : n));
	};
	const clearAllNotifications = () => {
		setNotifications([]);
		toast.info("Notifications panel cleared");
	};
	const getNotificationIcon = (type) => {
		switch (type) {
			case "message": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4 text-blue-600 dark:text-blue-400" });
			case "appointment": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-4 text-emerald-600 dark:text-emerald-400" });
			case "medication": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { className: "size-4 text-purple-600 dark:text-purple-400" });
			case "epass": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4 text-amber-600 dark:text-amber-400" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "size-4 text-indigo-600 dark:text-indigo-400" });
		}
	};
	const initials = session?.name ? session.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "MD";
	const links = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "space-y-1",
		children: nav.map((item) => {
			const Icon = item.icon;
			const isActive = pathname === item.to;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: () => setOpen(false),
				className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
			}, item.to);
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card p-4 lg:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 flex items-center justify-between px-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
					children: portalLabel
				}),
				links
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:pl-64",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
						open,
						onOpenChange: setOpen,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "lg:hidden",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
							side: "left",
							className: "w-72 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
									className: "sr-only",
									children: [portalLabel, " navigation"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6",
									children: links
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium lg:hidden",
						children: "MedDoc"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Notifications",
							className: "relative size-10 rounded-full hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5 text-slate-700 dark:text-slate-200" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -top-0.5 -right-0.5 size-5 bg-blue-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-card shadow-xs",
								children: unreadCount
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-80 sm:w-96 p-0 rounded-2xl border border-border shadow-2xl overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-border flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4 text-blue-600 dark:text-blue-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-bold text-sm text-slate-900 dark:text-white",
											children: "Notifications & Reminders"
										}),
										unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											className: "bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full",
											children: [unreadCount, " new"]
										})
									]
								}), notifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: markAllAsRead,
									className: "text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" }), " Mark read"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-h-88 overflow-y-auto divide-y divide-border",
								children: notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-8 text-center space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-8 text-emerald-500 mx-auto opacity-80" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground",
											children: "You are all caught up!"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "No pending messages or reminders."
										})
									]
								}) : notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => {
										markAsRead(n.id);
										if (n.link) navigate({ to: n.link });
									},
									className: cn("p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-muted/50", !n.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5",
										children: getNotificationIcon(n.type)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: cn("text-xs leading-tight truncate", !n.read ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"),
													children: n.title
												}), !n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-blue-600 shrink-0" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed",
												children: n.description
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 font-mono block pt-0.5",
												children: n.time
											})
										]
									})]
								}, n.id))
							}),
							notifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 border-t border-border bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between px-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: clearAllNotifications,
									className: "text-[11px] text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" }), " Clear panel"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/patient/telemedicine",
									className: "text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1",
									children: ["View Consultations ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
								})]
							})
						]
					})] }), isLoading ? null : session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "gap-2 px-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								className: "size-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
									className: "bg-accent text-xs text-accent-foreground",
									children: initials
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden text-sm font-medium sm:inline",
								children: session.name
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-56",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, {
								className: "font-normal",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium",
									children: session.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted-foreground",
									children: session.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: async () => {
									localStorage.setItem("meddoc_user_signed_out", "true");
									await signOut();
									navigate({ to: "/auth" });
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 size-4" }), " Sign out"]
							})
						]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "default",
						className: "ml-2 bg-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: "Login as MedDoc member"
						})
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10",
				children
			})]
		})]
	});
}
var patientNav = [
	{
		label: "Overview",
		to: "/patient",
		icon: LayoutDashboard
	},
	{
		label: "AI Assistant",
		to: "/patient/assistant",
		icon: Bot
	},
	{
		label: "Book Appointment",
		to: "/patient/book",
		icon: CalendarCheck
	},
	{
		label: "Appointments",
		to: "/patient/appointments",
		icon: ClipboardList
	},
	{
		label: "Medical Images",
		to: "/patient/images",
		icon: Image
	},
	{
		label: "Reports",
		to: "/patient/reports",
		icon: FileText
	},
	{
		label: "Health Timeline",
		to: "/patient/timeline",
		icon: Activity
	},
	{
		label: "Profile",
		to: "/patient/profile",
		icon: UserRound
	}
];
var doctorNav = [{
	label: "Overview",
	to: "/doctor",
	icon: LayoutDashboard
}, {
	label: "Profile",
	to: "/doctor/profile",
	icon: UserRound
}];
var hospitalNav = [
	{
		label: "Overview",
		to: "/hospital",
		icon: LayoutDashboard
	},
	{
		label: "Doctors",
		to: "/hospital/doctors",
		icon: Stethoscope
	},
	{
		label: "Branches",
		to: "/hospital/branches",
		icon: Building2
	},
	{
		label: "Profile",
		to: "/hospital/profile",
		icon: UserRound
	}
];
var adminNav = [{
	label: "Overview",
	to: "/admin",
	icon: LayoutDashboard
}];
//#endregion
export { patientNav as a, hospitalNav as i, adminNav as n, doctorNav as r, PortalShell as t };
