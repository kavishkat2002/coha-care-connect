import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { $ as HeartPulse, H as MapPin, T as ScanLine, f as Upload, nt as Eye, u as UserPlus, v as Star, y as Sparkles } from "../_libs/lucide-react.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as AiDisclaimer } from "./AiDisclaimer-DQCQj0Xf.mjs";
import { t as doctorService } from "./doctor.service-B1G2HOCZ.mjs";
import { n as RiskBadge, t as Progress } from "./progress-CiQpvHNN.mjs";
import { t as analyseMedicalImage } from "./ai.service-FHxvDG7b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.images-DS2fPY0r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var regions = [
	{
		label: "Oral",
		icon: Sparkles
	},
	{
		label: "Skin",
		icon: ScanLine
	},
	{
		label: "Breast",
		icon: HeartPulse
	},
	{
		label: "Eye",
		icon: Eye
	}
];
var stages = [
	"Upload",
	"Image quality check",
	"Image enhancement",
	"Lesion detection",
	"Risk assessment",
	"Clinical explanation"
];
function ImagesPage() {
	const [region, setRegion] = (0, import_react.useState)("Skin");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [result, setResult] = (0, import_react.useState)(null);
	const [imageBase64, setImageBase64] = (0, import_react.useState)(null);
	const [recommendedDoctors, setRecommendedDoctors] = (0, import_react.useState)([]);
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement("canvas");
					const max_size = 800;
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
					const dataUrl = canvas.toDataURL("image/jpeg", .7);
					setImageBase64(dataUrl);
				};
				img.src = reader.result;
			};
			reader.readAsDataURL(file);
		}
	};
	const run = async () => {
		setBusy(true);
		setResult(null);
		setRecommendedDoctors([]);
		try {
			const res = await analyseMedicalImage(region, imageBase64 || void 0);
			setResult(res);
			if (res.suggestedSpecialty) {
				const doctors = await doctorService.getDoctorsBySpecialty(res.suggestedSpecialty);
				setRecommendedDoctors(doctors);
			}
		} catch (e) {
			console.error(e);
		}
		setBusy(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Medical image analysis",
			description: "Supported areas: oral, skin, breast and eye. Results are indications for clinical review."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Upload an image"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Well-lit, in-focus photographs give the best results." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
							children: regions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								"aria-pressed": region === r.label,
								onClick: () => setRegion(r.label),
								className: cn("flex flex-col items-center gap-2 rounded-xl border p-3 text-sm transition-colors", region === r.label ? "border-primary bg-accent text-accent-foreground" : "border-border hover:bg-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.icon, {
									className: "size-4",
									"aria-hidden": "true"
								}), r.label]
							}, r.label))
						}),
						imageBase64 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "relative block cursor-pointer rounded-2xl border border-border overflow-hidden group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: imageBase64,
									alt: "Uploaded",
									className: "w-full h-auto object-contain"
								}),
								result?.boundingBox && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute rounded-lg border-2 border-orange-500 bg-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.8)] backdrop-blur-[2px] transition-all duration-1000 ease-in-out",
									style: {
										left: `${result.boundingBox[0] * 100}%`,
										top: `${result.boundingBox[1] * 100}%`,
										width: `${result.boundingBox[2] * 100}%`,
										height: `${result.boundingBox[3] * 100}%`
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 text-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
										className: "size-8 mb-2",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: "Change image"
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
							className: "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-muted/40 p-10 text-center overflow-hidden relative hover:bg-muted/80 transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "z-10 flex flex-col items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
										className: "size-6 text-muted-foreground",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: "Choose an image or drop it here"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "JPG or PNG · up to 20 MB"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								className: "sr-only",
								onChange: handleFileChange
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							onClick: () => void run(),
							disabled: busy,
							children: busy ? "Analysing…" : `Run ${region.toLowerCase()} assessment`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, {})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Assessment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: result ? `${result.region} · quality: ${result.quality}` : "Awaiting analysis" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-2 text-sm",
						children: stages.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-3 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("flex size-6 items-center justify-center rounded-full border text-xs", result ? "border-success/30 bg-success/10 text-success" : "border-border"),
								children: i + 1
							}), s]
						}, s))
					}), result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { level: result.risk }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									children: [
										"Confidence ",
										result.confidence,
										"%"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									children: [result.lesionsDetected, " region highlighted"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: result.confidence,
							className: "h-1.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-muted/40 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Heatmap overlay"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: result.boundingBox ? "A heatmap overlay was successfully generated over the affected region on your image." : "A highlighted overlay is generated on the uploaded image to show the region the model attended to."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Clinical explanation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: result.explanation
						})] }),
						result.plainLanguageExplanation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								children: result.plainLanguageExplanation
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Recommendation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1.5 text-sm text-muted-foreground",
							children: result.recommendation.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", r] }, r))
						})] }),
						result.skinCancerClassification && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border-2 overflow-hidden",
							style: { borderColor: result.skinCancerClassification.classification === "malignant" ? "var(--destructive)" : "var(--success)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 px-4 border-b",
								style: {
									backgroundColor: result.skinCancerClassification.classification === "malignant" ? "hsl(0 72% 51% / 0.08)" : "hsl(142 71% 45% / 0.08)",
									borderColor: result.skinCancerClassification.classification === "malignant" ? "var(--destructive)" : "var(--success)"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: "Skin Cancer Classification"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: result.skinCancerClassification.classification === "malignant" ? "destructive" : "secondary",
										className: "uppercase tracking-wider text-xs",
										children: result.skinCancerClassification.classification
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: [
										"Subtype: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium capitalize",
											children: result.skinCancerClassification.subtype.replace("_", " ")
										}),
										" · ",
										"Malignancy probability: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: [result.skinCancerClassification.malignancyProbability, "%"]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
									children: "ABCDE Criteria Analysis"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-2",
									children: [
										{
											letter: "A",
											label: "Asymmetry",
											value: result.skinCancerClassification.abcde.asymmetry
										},
										{
											letter: "B",
											label: "Border",
											value: result.skinCancerClassification.abcde.border
										},
										{
											letter: "C",
											label: "Color",
											value: result.skinCancerClassification.abcde.color
										},
										{
											letter: "D",
											label: "Diameter",
											value: result.skinCancerClassification.abcde.diameter
										},
										{
											letter: "E",
											label: "Evolution",
											value: result.skinCancerClassification.abcde.evolution
										}
									].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3 items-start text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0",
											children: item.letter
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium",
											children: [item.label, ": "]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: item.value
										})] })]
									}, item.letter))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-4 text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📊 ", result.skinCancerClassification.sensitivity] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["📈 ", result.skinCancerClassification.specificity] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1.5",
										children: "Clinical threshold: 23% (sensitivity-optimized to minimize false negatives for malignant detection)"
									})]
								})]
							})]
						}),
						recommendedDoctors.slice(0, 1).map((doctor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-muted/40 p-3 px-4 border-b border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Recommended Specialist Nearby"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 flex gap-4 items-start",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0",
										children: doctor.photoInitials
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: doctor.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: doctor.specialty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }),
														doctor.distanceKm,
														" km away"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1 text-amber-500 font-medium",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current" }),
														doctor.rating,
														" (",
														doctor.reviews,
														")"
													]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/patient/book",
										search: { doctorId: doctor.id },
										className: "shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "gap-2 w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-3" }), "Book"]
										})
									})
								]
							})]
						}, doctor.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, {})
					] }) : null]
				})]
			})]
		})]
	});
}
//#endregion
export { ImagesPage as component };
