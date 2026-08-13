import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as Logo } from "./Logo-yB58szO4.mjs";
import { $ as HeartPulse, B as MessageSquare, Ct as Bot, H as MapPin, L as Microscope, S as ShieldCheck, T as ScanLine, U as Mail, V as Menu, Z as Image, _ as Stethoscope, bt as Building2, ft as CircleCheck, j as Phone, kt as Activity, nt as Eye, o as Video, r as Watch, tt as FileText, v as Star, vt as CalendarCheck, xt as Brain, y as Sparkles } from "../_libs/lucide-react.mjs";
import { i as SheetTrigger, n as SheetContent, r as SheetTitle, t as Sheet } from "./sheet-CgVIxXqZ.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-BfBj_YIE.mjs";
import { t as AiDisclaimer } from "./AiDisclaimer-DQCQj0Xf.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-uwqhymWC.mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bxt5kqzb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var links = [
	{
		label: "Platform",
		href: "#platform"
	},
	{
		label: "How it works",
		href: "#how-it-works"
	},
	{
		label: "Services",
		href: "#services"
	},
	{
		label: "AI features",
		href: "#ai"
	},
	{
		label: "Screening",
		href: "#screening"
	},
	{
		label: "FAQ",
		href: "#faq"
	}
];
function LandingNav() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					"aria-label": "MedDoc home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-1 md:flex",
					"aria-label": "Main",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: l.href,
						className: "rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
						children: l.label
					}, l.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "hidden sm:inline-flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: "Sign in"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/patient/book",
								children: "Book appointment"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open,
							onOpenChange: setOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "md:hidden",
									"aria-label": "Open menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								side: "right",
								className: "w-72 p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "sr-only",
									children: "Menu"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-col gap-1",
									children: [links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: l.href,
										onClick: () => setOpen(false),
										className: "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
										children: l.label
									}, l.href)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										className: "mt-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/auth",
											children: "Sign in"
										})
									})]
								})]
							})]
						})
					]
				})
			]
		})
	});
}
var columns = [{
	title: "Platform",
	items: [
		{
			label: "AI assistant",
			to: "/patient/assistant"
		},
		{
			label: "Book appointment",
			to: "/patient/book"
		},
		{
			label: "Telemedicine",
			to: "/patient/telemedicine"
		},
		{
			label: "Health timeline",
			to: "/patient/timeline"
		}
	]
}, {
	title: "For providers",
	items: [
		{
			label: "Doctor portal",
			to: "/doctor"
		},
		{
			label: "Hospital portal",
			to: "/hospital"
		},
		{
			label: "Administration",
			to: "/admin"
		}
	]
}];
function LandingFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-sm text-sm text-muted-foreground",
					children: "MedDoc supports earlier screening and better coordinated care. It assists clinical decisions — it never replaces them."
				})]
			}), columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: col.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2.5",
				children: col.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
					children: item.label
				}) }, item.to))
			})] }, col.title))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" MedDoc. AI-assisted assessments are informational and do not constitute a medical diagnosis."
				]
			})
		})]
	});
}
var hero_care_default = "/assets/hero-care-DvCWDfGR.jpg";
function Reveal({ children, delay = 0, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className,
		initial: {
			opacity: 0,
			y: 16
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			amount: .2
		},
		transition: {
			duration: .5,
			delay,
			ease: [
				.22,
				1,
				.36,
				1
			]
		},
		children
	});
}
function Section({ id, eyebrow, title, description, children, muted = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		className: muted ? "bg-card" : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				className: "max-w-2xl",
				children: [
					eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: eyebrow
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-3xl font-semibold sm:text-4xl",
						children: title
					}),
					description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-muted-foreground",
						children: description
					}) : null
				]
			}), children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12",
				children
			}) : null]
		})
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "rounded-full border-border bg-accent/60 px-3 py-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "mr-1.5 size-3.5",
						"aria-hidden": "true"
					}), "AI-assisted early screening"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl",
					children: "Intelligent healthcare, from first symptom to the right specialist"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-xl text-lg text-muted-foreground",
					children: "MedDoc brings appointment booking, an AI health assistant, medical image and report analysis, telemedicine and your digital health record into one calm, connected platform."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/patient/book",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-2 size-4" }), " Book appointment"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/patient/assistant",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "mr-2 size-4" }), " Try AI assistant"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, { className: "mt-8 max-w-xl" })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: .1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-3xl border border-border shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: hero_care_default,
						alt: "A doctor reviewing results with a patient in a bright consultation room",
						width: 1280,
						height: 960,
						className: "h-full w-full object-cover"
					})
				})
			})]
		})
	});
}
var overview = [
	{
		icon: Bot,
		title: "AI health assistant",
		body: "Describe symptoms in your own words, attach images or reports, and get a plain-language assessment."
	},
	{
		icon: CalendarCheck,
		title: "Appointments that fit",
		body: "Search by doctor, hospital, specialty or branch, then book a slot with instant confirmation."
	},
	{
		icon: Microscope,
		title: "Early screening pathways",
		body: "Structured oral, skin, breast and eye screening flows designed around earlier detection."
	},
	{
		icon: Activity,
		title: "One health record",
		body: "Reports, images, prescriptions and visits collected into a single personal timeline."
	},
	{
		icon: Video,
		title: "Telemedicine built in",
		body: "Video, voice or chat consultations with digital prescriptions and follow-up booking."
	},
	{
		icon: ShieldCheck,
		title: "Clinician oversight",
		body: "Every AI output is reviewable by the treating doctor before it informs care."
	}
];
function PlatformOverview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		id: "platform",
		eyebrow: "Platform overview",
		title: "A complete healthcare ecosystem, not a single tool",
		description: "Patients, doctors, hospitals and administrators work in dedicated portals that share the same record.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: overview.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .05,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-full shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "size-5",
								"aria-hidden": "true"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "pt-3 text-base",
							children: item.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "text-sm text-muted-foreground",
						children: item.body
					})]
				})
			}, item.title))
		})
	});
}
var steps = [
	{
		step: "01",
		title: "Share what you feel",
		body: "Start a chat, describe your symptoms, and attach an image, prescription or lab report if you have one."
	},
	{
		step: "02",
		title: "Get an AI assessment",
		body: "MedDoc identifies your intent, reviews attachments and returns possible conditions with a confidence score."
	},
	{
		step: "03",
		title: "See the right specialist",
		body: "We recommend a hospital, branch, department and specialist with slots that match your location and urgency."
	},
	{
		step: "04",
		title: "Keep everything together",
		body: "Visits, reports and insights flow into your health timeline so future care starts with full context."
	}
];
function HowItWorks() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		id: "how-it-works",
		muted: true,
		eyebrow: "How it works",
		title: "Four steps from symptom to specialist",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 md:grid-cols-2 lg:grid-cols-4",
			children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .05,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-full rounded-2xl border border-border bg-background p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-primary",
							children: s.step
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 text-base font-semibold",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: s.body
						})
					]
				})
			}, s.step))
		})
	});
}
var services = [
	{
		icon: Stethoscope,
		title: "Specialist consultations",
		body: "Across 20+ departments and partner hospitals."
	},
	{
		icon: Building2,
		title: "Hospital & branch search",
		body: "Compare ratings, facilities, distance and queue length."
	},
	{
		icon: FileText,
		title: "Report analysis",
		body: "Blood, MRI, CT, biopsy and laboratory reports explained simply."
	},
	{
		icon: Image,
		title: "Medical image review",
		body: "Oral, skin, breast and eye images with lesion highlighting."
	},
	{
		icon: HeartPulse,
		title: "Preventive health reviews",
		body: "Personalised screening reminders based on your history."
	},
	{
		icon: MessageSquare,
		title: "Care coordination",
		body: "Referrals, follow-ups and prescriptions in one thread."
	}
];
function Services() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		id: "services",
		eyebrow: "Healthcare services",
		title: "Everyday care and specialist pathways",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
			children: services.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .04,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, {
						className: "size-5 shrink-0 text-primary",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: s.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: s.body
					})] })]
				})
			}, s.title))
		})
	});
}
var aiFeatures = [
	{
		icon: Brain,
		title: "Intent detection",
		body: "Understands whether you need triage, a report explained or a specialist."
	},
	{
		icon: ScanLine,
		title: "Image quality checks",
		body: "Flags blurry or poorly lit photos before analysis runs."
	},
	{
		icon: FileText,
		title: "Abnormal value highlighting",
		body: "Marks out-of-range results and explains what they mean."
	},
	{
		icon: MapPin,
		title: "Recommendation engine",
		body: "Ranks care by rating, distance, availability and experience."
	}
];
function AiFeatures() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "ai",
		muted: true,
		eyebrow: "AI features",
		title: "Assistive intelligence with clear boundaries",
		description: "MedDoc never claims to diagnose. It summarises, highlights and recommends — the clinician decides.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2",
			children: aiFeatures.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .05,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full gap-4 rounded-2xl border border-border bg-background p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, {
						className: "size-5 shrink-0 text-primary",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold",
						children: f.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 text-sm text-muted-foreground",
						children: f.body
					})] })]
				})
			}, f.title))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, { className: "mt-8 max-w-2xl" })]
	});
}
var screening = [
	{
		icon: MessageSquare,
		title: "Oral",
		body: "Persistent ulcers, white or red patches, mucosal changes."
	},
	{
		icon: Sparkles,
		title: "Skin",
		body: "Moles, pigmented lesions, non-healing sores."
	},
	{
		icon: HeartPulse,
		title: "Breast",
		body: "Lumps, pain, skin or nipple changes."
	},
	{
		icon: Eye,
		title: "Eye",
		body: "Lesions, persistent redness, vision changes."
	}
];
function CancerScreening() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "screening",
		eyebrow: "Cancer screening",
		title: "Structured early screening for four areas",
		description: "Each pathway walks through capture, quality check, lesion detection, risk indication and next steps.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
			children: screening.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .05,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-full shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, {
							className: "size-5 text-primary",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "pt-3 text-base",
							children: s.title
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "text-sm text-muted-foreground",
						children: s.body
					})]
				})
			}, s.title))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: .1,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/patient/images",
						children: "Start an image assessment"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted-foreground",
					children: "Results are indications for review, never a diagnosis."
				})]
			})
		})]
	});
}
function Telemedicine() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		id: "telemedicine",
		muted: true,
		eyebrow: "Telemedicine",
		title: "Consult from wherever you are",
		description: "See which doctors are online now and choose video, voice or chat. Prescriptions and follow-ups are digital.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-3",
			children: [
				{
					icon: Video,
					title: "Video consultation",
					body: "Face-to-face review with screen sharing for reports."
				},
				{
					icon: Phone,
					title: "Voice consultation",
					body: "Lower bandwidth option for quick follow-ups."
				},
				{
					icon: MessageSquare,
					title: "Chat consultation",
					body: "Asynchronous messaging with attachments."
				}
			].map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .05,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-full rounded-2xl border border-border bg-background p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(t.icon, {
							className: "size-5 text-primary",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 text-base font-semibold",
							children: t.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: t.body
						})
					]
				})
			}, t.title))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
			delay: .15,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Watch, {
						className: "size-5 text-muted-foreground",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Wearable integrations — Apple Health, Google Fit, Samsung Health, Fitbit, Garmin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Coming soon"
					})
				]
			})
		})]
	});
}
var stats = [
	{
		value: "180k+",
		label: "Assessments assisted"
	},
	{
		value: "42",
		label: "Partner hospitals"
	},
	{
		value: "1,300+",
		label: "Verified specialists"
	},
	{
		value: "6 min",
		label: "Median time to a slot"
	}
];
function Stats() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4",
			children: stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, {
				delay: i * .05,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-3xl font-semibold sm:text-4xl",
					children: s.value
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-sm text-muted-foreground",
					children: s.label
				})]
			}, s.label))
		})
	});
}
var testimonials = [
	{
		quote: "A patient uploaded a photo of a mouth ulcer that had lasted three weeks. The assistant flagged it for review and she was in my clinic two days later.",
		name: "Dr. Ravi Kumar",
		role: "Oral Medicine, Lakeside General Hospital"
	},
	{
		quote: "My blood report finally made sense. It showed which values were low and which specialist to see, without alarming language.",
		name: "Dilani R.",
		role: "Patient, Colombo"
	},
	{
		quote: "Queue visibility across our three branches changed how we schedule screening clinics.",
		name: "Suresh Bandara",
		role: "Operations Director, Metro Cancer Institute"
	}
];
function Testimonials() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		eyebrow: "Testimonials",
		title: "Trusted by clinicians and patients",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 lg:grid-cols-3",
			children: testimonials.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: i * .05,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "h-full shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-0.5 text-primary",
								"aria-label": "Five out of five",
								children: Array.from({ length: 5 }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
									className: "size-4 fill-current",
									"aria-hidden": "true"
								}, idx))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 text-sm leading-relaxed",
								children: [
									"“",
									t.quote,
									"”"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-sm font-semibold",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: t.role
							})
						]
					})
				})
			}, t.name))
		})
	});
}
var faqs = [
	{
		q: "Does MedDoc diagnose disease?",
		a: "No. MedDoc produces an AI-assisted assessment with possible conditions, a risk indication and a confidence score. Diagnosis is made by a licensed clinician."
	},
	{
		q: "What can I upload?",
		a: "Photographs of an affected area, prescriptions, laboratory reports, blood reports, and scan reports such as MRI, CT or biopsy summaries in PDF or image form."
	},
	{
		q: "How are hospitals and specialists recommended?",
		a: "The recommendation engine weighs your location and distance, the required specialty, doctor and hospital ratings, experience, availability and current queue length."
	},
	{
		q: "Who can see my medical data?",
		a: "You, and the clinicians you book with. Hospital and system administrators see only the operational data needed to run services."
	},
	{
		q: "Is telemedicine included?",
		a: "Yes. Video, voice and chat consultations are available with online doctors, including digital prescriptions and follow-up booking."
	}
];
function Faq() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		id: "faq",
		muted: true,
		title: "Frequently asked questions",
		eyebrow: "FAQ",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-3xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
				type: "single",
				collapsible: true,
				className: "w-full",
				children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
					value: f.q,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
						className: "text-left text-base",
						children: f.q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
						className: "text-sm text-muted-foreground",
						children: f.a
					})]
				}, f.q))
			})
		})
	});
}
function Contact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		id: "contact",
		eyebrow: "Contact",
		title: "Talk to our team",
		description: "Hospitals and clinics can request a walkthrough of the provider portals.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft",
				onSubmit: (e) => {
					e.preventDefault();
					toast.success("Thanks — our team will reply within one working day.");
					e.target.reset();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "contact-name",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "contact-name",
								required: true,
								placeholder: "Jane Perera"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "contact-org",
								children: "Organisation"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "contact-org",
								placeholder: "Hospital or clinic"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "contact-email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "contact-email",
							type: "email",
							required: true,
							placeholder: "you@hospital.lk"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "contact-message",
							children: "How can we help?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "contact-message",
							rows: 4,
							placeholder: "Tell us about your needs"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full sm:w-auto",
						children: "Send message"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				delay: .1,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [[
						{
							icon: Mail,
							label: "Email",
							value: "care@coha.ai"
						},
						{
							icon: Phone,
							label: "Phone",
							value: "+94 11 500 0100"
						},
						{
							icon: MapPin,
							label: "Office",
							value: "Level 6, Union Place, Colombo 02"
						}
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, {
							className: "size-5 text-primary",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: c.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: c.value
						})] })]
					}, c.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-soft",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: "Emergencies"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm text-muted-foreground",
								children: "MedDoc is not an emergency service. For urgent symptoms, contact your nearest emergency department immediately."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2 text-sm text-muted-foreground",
								children: [
									"Verified clinicians only",
									"Consent-based record sharing",
									"Audit trail on AI outputs"
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
											className: "size-4 text-success",
											"aria-hidden": "true"
										}),
										" ",
										item
									]
								}, item))
							})
						]
					})]
				})
			})]
		})
	});
}
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlatformOverview, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorks, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Services, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiFeatures, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancerScreening, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Telemedicine, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stats, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Testimonials, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Faq, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingFooter, {})
		]
	});
}
//#endregion
export { Landing as component };
