import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { C as Send, Ct as Bot, D as RotateCcw, I as Paperclip, R as Mic, St as BrainCircuit, c as User, y as Sparkles } from "../_libs/lucide-react.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as AiDisclaimer } from "./AiDisclaimer-DQCQj0Xf.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-uwqhymWC.mjs";
import { n as RiskBadge, t as Progress } from "./progress-CiQpvHNN.mjs";
import { t as DoctorCard } from "./DoctorCard-uUBbziMa.mjs";
import { a as recommendCare, o as transcribeAudio, r as analyseSymptoms } from "./ai.service-dWsWhT0F.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.assistant-Du3EUOsh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var suggestions = [
	"I have a mouth ulcer that has not healed in three weeks.",
	"I have a skin rash on my forearm.",
	"I have breast pain on one side.",
	"I need a dermatologist near Colombo."
];
function AssistantPage() {
	const [messages, setMessages] = (0, import_react.useState)(() => {
		const saved = localStorage.getItem("meddoc_messages");
		if (saved) return JSON.parse(saved);
		return [{
			id: "m0",
			role: "assistant",
			text: "Hello, I am MedDoc. Tell me what you are experiencing in your own words. You can also attach a photo of the affected area, a prescription, or a lab report."
		}];
	});
	const [input, setInput] = (0, import_react.useState)("");
	const [attachment, setAttachment] = (0, import_react.useState)(null);
	const [imageBase64, setImageBase64] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [assessment, setAssessment] = (0, import_react.useState)(() => {
		const saved = localStorage.getItem("meddoc_assessment");
		return saved ? JSON.parse(saved) : null;
	});
	const [care, setCare] = (0, import_react.useState)(() => {
		const saved = localStorage.getItem("meddoc_care");
		return saved ? JSON.parse(saved) : null;
	});
	const [dynamicSuggestions, setDynamicSuggestions] = (0, import_react.useState)(() => {
		const saved = localStorage.getItem("meddoc_dynamicSuggestions");
		return saved ? JSON.parse(saved) : [];
	});
	const [isListening, setIsListening] = (0, import_react.useState)(false);
	const [isTranscribing, setIsTranscribing] = (0, import_react.useState)(false);
	const endRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const audioChunksRef = (0, import_react.useRef)([]);
	const textareaRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("meddoc_messages", JSON.stringify(messages));
		localStorage.setItem("meddoc_assessment", JSON.stringify(assessment));
		localStorage.setItem("meddoc_care", JSON.stringify(care));
		localStorage.setItem("meddoc_dynamicSuggestions", JSON.stringify(dynamicSuggestions));
	}, [
		messages,
		assessment,
		care,
		dynamicSuggestions
	]);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end"
		});
	}, [messages, busy]);
	const clearHistory = () => {
		setMessages([{
			id: "m0",
			role: "assistant",
			text: "Hello, I am MedDoc. Tell me what you are experiencing in your own words. You can also attach a photo of the affected area, a prescription, or a lab report."
		}]);
		setAssessment(null);
		setCare(null);
		setDynamicSuggestions([]);
		localStorage.removeItem("meddoc_messages");
		localStorage.removeItem("meddoc_assessment");
		localStorage.removeItem("meddoc_care");
		localStorage.removeItem("meddoc_dynamicSuggestions");
	};
	const toggleListen = async () => {
		if (isListening && mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setIsListening(false);
		} else try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];
			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) audioChunksRef.current.push(event.data);
			};
			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
				stream.getTracks().forEach((track) => track.stop());
				setIsTranscribing(true);
				const transcript = await transcribeAudio(audioBlob);
				setIsTranscribing(false);
				if (transcript) setInput((prev) => (prev ? prev + " " : "") + transcript.trim());
			};
			mediaRecorder.start();
			setIsListening(true);
		} catch (err) {
			console.error("Error accessing microphone:", err);
			alert("Microphone access is required to use voice input.");
		}
	};
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setAttachment(file.name);
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
					setImageBase64(canvas.toDataURL("image/jpeg", .7));
				};
				img.src = reader.result;
			};
			reader.readAsDataURL(file);
		}
	};
	const removeAttachment = () => {
		setAttachment(null);
		setImageBase64(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const buildConversationHistory = (msgs) => {
		return msgs.filter((m) => m.role === "user" || m.role === "assistant" && m.id !== "m0").map((m) => ({
			role: m.role,
			content: m.text,
			...m.imageBase64 ? { imageBase64: m.imageBase64 } : {}
		}));
	};
	const send = async (text) => {
		if (!text.trim() && !imageBase64) return;
		if (busy) return;
		const userMsg = {
			id: `u${Date.now()}`,
			role: "user",
			text,
			...attachment ? { attachment } : {},
			...imageBase64 ? { imageBase64 } : {}
		};
		const updatedMessages = [...messages, userMsg];
		setMessages(updatedMessages);
		setInput("");
		setAttachment(null);
		setImageBase64(null);
		if (textareaRef.current) textareaRef.current.style.height = "auto";
		if (fileInputRef.current) fileInputRef.current.value = "";
		setBusy(true);
		const conversationHistory = buildConversationHistory(updatedMessages);
		const result = await analyseSymptoms(conversationHistory);
		setAssessment(result);
		if (result.followUpQuestions && result.followUpQuestions.length > 0) setDynamicSuggestions(result.followUpQuestions);
		else setDynamicSuggestions([]);
		if (result.possibleConditions.length > 0 || result.followUpQuestions && result.followUpQuestions.length === 0) setCare(await recommendCare(result.suggestedSpecialty || ""));
		else setCare(null);
		setMessages((m) => [...m, {
			id: `a${Date.now()}`,
			role: "assistant",
			text: result.plainLanguageSummary || result.summary,
			...result.reasoning ? { reasoning: result.reasoning } : {}
		}]);
		setBusy(false);
	};
	const activeSuggestions = dynamicSuggestions.length > 0 ? dynamicSuggestions : suggestions;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "AI health assistant",
			description: "Intent detection, symptom analysis, image and report review, then a care recommendation."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "flex h-[38rem] flex-col shadow-soft lg:col-span-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "border-b border-border flex-row items-center justify-between py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2 text-base",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, {
								className: "size-4 text-primary",
								"aria-hidden": "true"
							}), " Conversation"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Natural language · attachments supported" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: clearHistory,
							className: "text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4 mr-2" }), " Reset"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex-1 space-y-4 overflow-y-auto py-5",
						children: [
							messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start"),
								children: [
									m.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, {
											className: "size-4",
											"aria-hidden": "true"
										})
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm flex flex-col gap-2", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"),
										children: [
											m.imageBase64 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: m.imageBase64,
												alt: "User upload",
												className: "rounded-xl w-48 h-auto object-cover border border-black/10 dark:border-white/10"
											}),
											m.reasoning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
												type: "single",
												collapsible: true,
												className: "w-full mb-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
													value: "reasoning",
													className: "border-none",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionTrigger, {
														className: "py-1 px-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-medium flex items-center justify-start gap-2 h-8 w-fit [&>svg]:size-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrainCircuit, { className: "size-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground",
															children: "Thought Process"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
														className: "p-3 text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed bg-black/5 dark:bg-white/5 rounded-lg mt-2",
														children: m.reasoning
													})]
												})
											}),
											m.text && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "leading-relaxed whitespace-pre-wrap",
												children: m.text
											}),
											m.attachment && !m.imageBase64 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-1 block text-xs opacity-80",
												children: ["Attached: ", m.attachment]
											}) : null
										]
									}),
									m.role === "user" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
											className: "size-4",
											"aria-hidden": "true"
										})
									}) : null
								]
							}, m.id)),
							busy || isTranscribing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								role: "status",
								children: isTranscribing ? "Transcribing your voice…" : "Analysing your message…"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 flex flex-wrap gap-2",
								children: activeSuggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => send(s),
									className: cn("rounded-full border px-3 py-1.5 text-xs transition-colors", dynamicSuggestions.length > 0 ? "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 font-medium" : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"),
									children: [dynamicSuggestions.length > 0 ? "→ " : "", s]
								}, s))
							}),
							(attachment || imageBase64) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center gap-2 p-2 rounded-xl bg-muted/50 w-fit relative group",
								children: [
									imageBase64 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: imageBase64,
										alt: "Preview",
										className: "h-10 w-10 rounded-lg object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-lg bg-muted flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4 text-muted-foreground" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col max-w-[200px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-medium truncate",
											children: attachment || "Image"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "Ready to send"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: removeAttachment,
										className: "absolute -top-1.5 -right-1.5 bg-background border border-border rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted",
										"aria-label": "Remove attachment",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "12",
											height: "12",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											strokeLinecap: "round",
											strokeLinejoin: "round",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 6 6 18" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m6 6 12 12" })]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex items-center gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									send(input);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*,application/pdf",
										className: "sr-only",
										ref: fileInputRef,
										onChange: handleFileChange
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										size: "icon",
										"aria-label": "Attach a file",
										onClick: () => fileInputRef.current?.click(),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: isListening ? "default" : "outline",
										size: "icon",
										"aria-label": isListening ? "Stop recording" : "Start voice input",
										onClick: toggleListen,
										className: isListening ? "bg-red-500 hover:bg-red-600 animate-pulse text-white" : "",
										disabled: isTranscribing,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										ref: textareaRef,
										value: input,
										onChange: (e) => {
											setInput(e.target.value);
											e.target.style.height = "auto";
											e.target.style.height = `${e.target.scrollHeight}px`;
										},
										onKeyDown: (e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												if (!busy && input.trim()) send(input);
											}
										},
										placeholder: "Describe your symptoms…",
										"aria-label": "Message",
										className: "min-h-[44px] max-h-[200px] resize-none py-3 overflow-y-auto",
										rows: 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										size: "icon",
										"aria-label": "Send message",
										disabled: busy,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, { className: "mt-3" })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "size-4 text-primary",
							"aria-hidden": "true"
						}), " Assessment"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: assessment ? assessment.intent : "Send a message to generate an assessment" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-4",
						children: assessment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBadge, { level: assessment.risk }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									children: [
										"Confidence ",
										assessment.confidence,
										"%"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: assessment.possibleConditions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [c.likelihood, "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: c.likelihood,
									className: "mt-1.5 h-1.5"
								})] }, c.name))
							}),
							assessment.plainLanguageSummary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
										children: "What this means"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed",
									children: assessment.plainLanguageSummary
								})]
							}),
							assessment.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-muted/40 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5",
									children: "Clinical Summary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground leading-relaxed",
									children: assessment.summary
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Recommended next steps"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-1.5 text-sm text-muted-foreground",
								children: assessment.recommendation.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["• ", r] }, r))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, {})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Possible conditions, risk indication, confidence score and recommendations will appear here."
						})
					})]
				}), care ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Recommended care"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Ranked by rating, distance and availability" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "topRated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid w-full grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "topRated",
									children: "Top rated"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "nearest",
									children: "Nearest"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "mostAvailable",
									children: "Available"
								})
							]
						}), [
							"topRated",
							"nearest",
							"mostAvailable"
						].map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: key,
							className: "mt-4 space-y-3",
							children: care[key].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorCard, {
								doctor: d,
								compact: true
							}, d.id))
						}, key))]
					}) })]
				}) : null]
			})]
		})]
	});
}
//#endregion
export { AssistantPage as component };
