import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.mjs";
import { H as MapPin, ct as Clock, s as Users, v as Star } from "../_libs/lucide-react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as CardContent, t as Card } from "./card-BfBj_YIE.mjs";
import { t as patientService } from "./patient.service-CVz31mvu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DoctorCard-DbydeXKJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DoctorCard({ doctor, compact = false, onProfileClick }) {
	const [realNextSlot, setRealNextSlot] = (0, import_react.useState)(null);
	const [realQueue, setRealQueue] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		async function fetchStats() {
			try {
				const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
				const slots = await patientService.getDoctorAvailability(doctor.id, today);
				const now = /* @__PURE__ */ new Date();
				const currentMinutes = now.getHours() * 60 + now.getMinutes();
				let next = slots.find((s) => {
					const parts = s.split(":").map(Number);
					const h = parts[0] ?? 0;
					const m = parts[1] ?? 0;
					return h * 60 + m > currentMinutes;
				});
				if (!next && slots.length > 0) next = slots[0];
				if (!isMounted) return;
				if (next) {
					setRealNextSlot(next);
					const qCount = await patientService.getSlotQueueCount(doctor.id, today, next);
					if (isMounted) setRealQueue(qCount);
				} else {
					setRealNextSlot("None");
					setRealQueue(0);
				}
			} catch (e) {}
		}
		fetchStats();
		return () => {
			isMounted = false;
		};
	}, [doctor.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex flex-col gap-4 p-5 sm:flex-row sm:items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					className: `size-12 ${onProfileClick ? "cursor-pointer hover:opacity-80" : ""}`,
					onClick: (e) => {
						if (onProfileClick) {
							e.preventDefault();
							e.stopPropagation();
							onProfileClick(doctor);
						}
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
						className: "bg-accent text-sm font-semibold text-accent-foreground",
						children: doctor.photoInitials
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: `text-base font-semibold ${onProfileClick ? "cursor-pointer hover:underline" : ""}`,
								onClick: (e) => {
									if (onProfileClick) {
										e.preventDefault();
										e.stopPropagation();
										onProfileClick(doctor);
									}
								},
								children: doctor.name
							}), doctor.online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "border-success/20 bg-success/10 text-success",
								children: "Online now"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								doctor.specialty,
								" · ",
								doctor.experienceYears,
								" yrs experience"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								doctor.hospital,
								" · ",
								doctor.branch
							]
						}),
						!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
											className: "size-3.5 fill-primary text-primary",
											"aria-hidden": "true"
										}),
										doctor.rating,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: onProfileClick ? "cursor-pointer hover:underline" : "",
											onClick: (e) => {
												if (onProfileClick) {
													e.preventDefault();
													e.stopPropagation();
													onProfileClick(doctor);
												}
											},
											children: [
												"(",
												doctor.reviews,
												" reviews)"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
											className: "size-3.5",
											"aria-hidden": "true"
										}),
										" ",
										doctor.distanceKm,
										" km away"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
											className: "size-3.5",
											"aria-hidden": "true"
										}),
										" ",
										realQueue !== null ? realQueue : doctor.queue,
										" in queue"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
										className: "size-3.5",
										"aria-hidden": "true"
									}), realNextSlot !== null ? realNextSlot === "None" ? "None" : `Today · ${realNextSlot}` : doctor.nextSlot]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: doctor.languages.join(", ") })
							]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-col items-start gap-2 sm:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold",
						children: ["LKR ", doctor.fee.toLocaleString()]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/patient/book",
							children: "Book"
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { DoctorCard as t };
