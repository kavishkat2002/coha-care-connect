import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { n as CardContent, t as Card } from "./card-BfBj_YIE.mjs";
import { c as doctors, l as hospitals, u as init_mock } from "./server-qE7WcvYQ.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as patientService } from "./patient.service-ClJFNjzy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.appointments-CbNc6Uh5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
init_mock();
var variant = (status) => status === "Confirmed" ? "secondary" : status === "Completed" ? "outline" : "outline";
function AppointmentsPage() {
	const [appointments, setAppointments] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		async function load() {
			const data = await patientService.getAppointments();
			setAppointments(data);
		}
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Appointments",
			description: "Your full appointment history across hospitals and telemedicine.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/patient/book",
					children: "Book appointment"
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Doctor" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden sm:table-cell",
						children: "Specialty"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden md:table-cell",
						children: "Location"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden sm:table-cell",
						children: "Mode"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Status"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: appointments.map((a) => {
					const doc = doctors.find((d) => d.id === a.doctor_id);
					const hosp = hospitals.find((h) => h.id === a.hospital_id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: doc ? doc.name : a.doctor_id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "hidden sm:table-cell text-muted-foreground",
							children: doc ? doc.specialty : "General"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "hidden md:table-cell text-muted-foreground",
							children: hosp ? hosp.name : a.hospital_id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [a.date, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted-foreground",
							children: a.time
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "hidden sm:table-cell text-muted-foreground",
							children: "In-person"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: variant(a.status),
								children: a.status
							})
						})
					] }, a.id);
				}) })] })
			})
		})]
	});
}
//#endregion
export { AppointmentsPage as component };
