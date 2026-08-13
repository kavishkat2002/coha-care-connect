import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as getSession } from "./auth.service-cQpuFi04.mjs";
import { _ as Stethoscope, bt as Building2, st as CreditCard, v as Star, vt as CalendarCheck } from "../_libs/lucide-react.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-BfBj_YIE.mjs";
import { t as StatCard } from "./StatCard-KAFspyoq.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as patientService } from "./patient.service-BrsCNJqy.mjs";
import { t as hospitalService } from "./hospital.service-CPNkTzfz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hospital.index-BJCSi5P_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HospitalDashboard() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [h, setH] = (0, import_react.useState)(null);
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		getSession().then(setSession);
		async function load() {
			const allHospitals = await hospitalService.getAllHospitals();
			if (allHospitals.length > 0) setH(allHospitals[0]);
			const allAppts = await patientService.getAppointments();
			setAppointments(allAppts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
		}
		load();
	}, []);
	if (!h) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Loading dashboard..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: session?.name ?? h.name,
				description: `${h.branches.length} branches · ${h.city}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Stethoscope,
						label: "Active doctors",
						value: "86",
						hint: "12 online now"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: CalendarCheck,
						label: "Total Bookings",
						value: appointments.length.toString(),
						hint: "Live from system"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: CreditCard,
						label: "Revenue (month)",
						value: "LKR 24.6M",
						hint: "Across all branches"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Star,
						label: "Average rating",
						value: `${h.rating}`,
						hint: `${h.reviews} reviews`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Departments"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "flex flex-wrap gap-2",
						children: h.departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: d
						}, d))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
							className: "size-4 text-primary",
							"aria-hidden": "true"
						}), " Branches"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-2",
						children: h.branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rounded-xl border border-border bg-muted/40 p-3 text-sm",
							children: b
						}, b))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Recent Appointments"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Patient" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Doctor ID" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date & Time" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Status"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: appointments.length > 0 ? appointments.slice(0, 10).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "font-medium",
							children: [a.patient_name || a.patient_id || "Guest", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: a.patient_mobile || ""
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: a.doctor_id }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [
							a.date,
							" at ",
							a.time
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: a.status === "Confirmed" ? "default" : "outline",
								children: a.status
							})
						})
					] }, a.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 4,
						className: "text-center text-muted-foreground py-4",
						children: "No recent appointments"
					}) }) })] })
				})]
			})
		]
	});
}
//#endregion
export { HospitalDashboard as component };
