import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { A as Pill, Z as Image, kt as Activity, tt as FileText, vt as CalendarCheck, y as Sparkles } from "../_libs/lucide-react.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as AiDisclaimer } from "./AiDisclaimer-DQCQj0Xf.mjs";
import { t as patientService } from "./patient.service-ClJFNjzy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.timeline-CO0NcH9e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var icons = {
	appointment: CalendarCheck,
	report: FileText,
	image: Image,
	insight: Sparkles,
	prescription: Pill
};
function TimelinePage() {
	const [timeline, setTimeline] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		async function load() {
			const data = await patientService.getTimeline();
			setTimeline(data);
		}
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Health timeline",
			description: "Every visit, report and insight in one continuous record."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Recent activity"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "relative space-y-6 border-l border-border pl-6",
					children: timeline.map((t) => {
						const Icon = icons[t.kind];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "relative",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -left-[2.05rem] flex size-7 items-center justify-center rounded-full border border-border bg-card",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-3.5 text-primary",
										"aria-hidden": "true"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: t.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-sm font-medium",
									children: t.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: t.detail
								})
							]
						}, t.id);
					})
				}) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Health trends"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Built from your records" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3 text-sm",
						children: [[
							{
								label: "Iron levels",
								value: "Improving"
							},
							{
								label: "Skin reviews",
								value: "Due"
							},
							{
								label: "Consultation frequency",
								value: "Stable"
							}
						].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: row.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: row.value
							})]
						}, row.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, {})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
							className: "size-4 text-primary",
							"aria-hidden": "true"
						}), " Wearable data"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-2 text-sm text-muted-foreground",
						children: [
							"Apple Health",
							"Google Fit",
							"Samsung Health",
							"Fitbit",
							"Garmin"
						].map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [
								w,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									children: "Coming soon"
								})
							]
						}, w))
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { TimelinePage as component };
