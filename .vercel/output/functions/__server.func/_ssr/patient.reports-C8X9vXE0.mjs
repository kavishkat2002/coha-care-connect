import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { f as Upload } from "../_libs/lucide-react.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as AiDisclaimer } from "./AiDisclaimer-DQCQj0Xf.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as patientService } from "./patient.service-CFKlnVd3.mjs";
import { n as analyseMedicalReport } from "./ai.service-DmJX46uV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.reports-C8X9vXE0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [reports, setReports] = (0, import_react.useState)([]);
	const [imageBase64, setImageBase64] = (0, import_react.useState)(null);
	const [fileName, setFileName] = (0, import_react.useState)("Uploaded Report");
	(0, import_react.useEffect)(() => {
		async function load() {
			const data = await patientService.getReports();
			setReports(data);
		}
		load();
	}, []);
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setFileName(file.name);
			const reader = new FileReader();
			reader.onloadend = () => {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement("canvas");
					const max_size = 1200;
					let width = img.width;
					let height = img.height;
					if (width > height) {
						if (width > max_size) {
							height *= max_size / width;
							width = max_size;
						}
					} else if (height > max_size) {
						width *= max_size / height;
						height = max_size;
					}
					canvas.width = width;
					canvas.height = height;
					canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
					const dataUrl = canvas.toDataURL("image/jpeg", .8);
					setImageBase64(dataUrl);
				};
				img.src = reader.result;
			};
			reader.readAsDataURL(file);
		}
	};
	const run = async () => {
		if (!imageBase64 && !result) return;
		setBusy(true);
		try {
			const res = await analyseMedicalReport(fileName, imageBase64 || void 0);
			setResult(res);
		} catch (e) {
			console.error(e);
		}
		setBusy(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Medical reports",
				description: "Blood, MRI, CT, biopsy and laboratory reports in PDF or image form."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Upload a report"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "We store it in your record after analysis." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-5",
						children: [
							imageBase64 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "relative block cursor-pointer rounded-2xl border border-border overflow-hidden group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: imageBase64,
										alt: "Uploaded report",
										className: "w-full h-auto object-contain max-h-[300px]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
											className: "size-8 mb-2",
											"aria-hidden": "true"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium",
											children: "Change report"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "sr-only",
										onChange: handleFileChange
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center hover:bg-muted/80 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
										className: "size-6 text-muted-foreground",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: "Choose a report image"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "JPG or PNG · up to 20 MB"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "sr-only",
										onChange: handleFileChange
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								disabled: busy || !imageBase64 && !result,
								onClick: () => void run(),
								children: busy ? "Analysing…" : "Analyse report"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, {})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Analysis"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: result ? result.fileName : "Awaiting a report" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-4",
						children: result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							result.abnormal && result.abnormal.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Values outside the reference range"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2",
								children: result.abnormal.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-right",
										children: [a.value, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-xs text-muted-foreground",
											children: ["Range ", a.range]
										})]
									})]
								}, a.label))
							})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-success/30 bg-success/10 p-3 text-sm flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-success font-semibold",
									children: "✓"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No abnormal values detected outside standard reference ranges." })]
							}),
							result.plainLanguage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base",
										role: "img",
										"aria-label": "lightbulb",
										children: "💡"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-emerald-800 dark:text-emerald-300",
										children: "What this means in simple terms"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed",
									children: result.plainLanguage
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								children: ["Suggested specialist: ", result.suggestedSpecialty]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, {})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Highlighted abnormal values, a plain-language summary and a suggested specialist appear here."
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Stored reports"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Report" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "hidden sm:table-cell",
							children: "Type"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "hidden md:table-cell",
							children: "Summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-right",
							children: "Status"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: reports.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: r.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "hidden sm:table-cell text-muted-foreground",
							children: r.type
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-muted-foreground",
							children: r.date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "hidden md:table-cell max-w-sm text-muted-foreground",
							children: r.summary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: r.status === "Analysed" ? "secondary" : "outline",
								children: r.status
							})
						})
					] }, r.id)) })] })
				})]
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
