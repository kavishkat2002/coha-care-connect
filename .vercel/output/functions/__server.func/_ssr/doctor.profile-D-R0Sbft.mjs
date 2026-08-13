import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { n as getSession, o as signOut } from "./auth.service-cQpuFi04.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.mjs";
import { E as Save, Et as Banknote, W as LogOut, Y as Languages, _ as Stethoscope, bt as Building2, l as UserRound, wt as BookOpen } from "../_libs/lucide-react.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as doctorService } from "./doctor.service-B1G2HOCZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/doctor.profile-D-R0Sbft.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DoctorProfile() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		getSession().then(setSession);
	}, []);
	const handleSave = (e) => {
		e.preventDefault();
		setIsSaving(true);
		setTimeout(() => {
			setIsSaving(false);
			toast.success("Profile updated successfully");
		}, 1e3);
	};
	const handleSignOut = async () => {
		await signOut();
		navigate({ to: "/auth" });
	};
	const initials = (session?.name ?? "Doctor").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Doctor Profile",
			description: "Manage your professional details and system scope."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-8 lg:col-span-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-sm border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "text-center pb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									className: "mx-auto size-24 mb-4 ring-2 ring-primary/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "text-2xl bg-accent text-accent-foreground",
										children: initials
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-xl",
									children: session?.name ?? "Loading..."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: session?.email })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Account Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: "Doctor",
									disabled: true,
									className: "bg-muted/50 font-medium text-primary"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Registration ID" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: session?.registration_id || `DOC-${session?.id?.substring(0, 6).toUpperCase() || "UNKNOWN"}`,
											disabled: true,
											className: "bg-muted/50 font-mono text-sm tracking-wide text-foreground pr-10"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground",
											onClick: () => {
												const id = session?.registration_id || `DOC-${session?.id?.substring(0, 6).toUpperCase() || "UNKNOWN"}`;
												navigator.clipboard.writeText(id);
												toast.success("Registration ID copied to clipboard!");
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
												xmlns: "http://www.w3.org/2000/svg",
												width: "14",
												height: "14",
												viewBox: "0 0 24 24",
												fill: "none",
												stroke: "currentColor",
												strokeWidth: "2",
												strokeLinecap: "round",
												strokeLinejoin: "round",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													width: "14",
													height: "14",
													x: "8",
													y: "8",
													rx: "2",
													ry: "2"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" })]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-1",
										children: "Share this ID with hospitals to link your profile."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
							className: "flex-col gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "w-full text-destructive hover:bg-destructive/10 hover:text-destructive",
								onClick: handleSignOut,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 size-4" }), "Sign Out"]
							})
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					onSubmit: handleSave,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "shadow-sm border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
								className: "text-lg flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "size-5 text-primary" }), "Professional Settings"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Update your clinical specialties, hospital affiliations, and consultation details." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "space-y-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-6 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "prof-name",
												children: "Full Name (Public Display)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "prof-name",
													defaultValue: session?.name,
													className: "pl-9"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "prof-specialty",
												children: "Specialty"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "prof-specialty",
													defaultValue: "General Medicine",
													className: "pl-9"
												})]
											})]
										}),
										(() => {
											const [rosterDetails, setRosterDetails] = (0, import_react.useState)(null);
											(0, import_react.useEffect)(() => {
												if (!session) return;
												const fetchDetails = async () => {
													const data = await doctorService.getAllDoctors();
													const id = session.registration_id || `DOC-${session.id.substring(0, 6).toUpperCase()}`;
													const match = data.find((d) => d.id === id || d.name === session.name);
													if (match) setRosterDetails(match);
												};
												fetchDetails();
											}, [session]);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "prof-hospital",
													children: "Affiliated Hospital"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "prof-hospital",
														value: rosterDetails?.hospital || "Not Affiliated",
														disabled: true,
														className: "pl-9 bg-muted/50"
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "prof-branch",
													children: "Assigned Branch"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "prof-branch",
														value: rosterDetails?.branch || "N/A",
														disabled: true,
														className: "pl-9 bg-muted/50"
													})]
												})]
											})] });
										})(),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "prof-fee",
												children: "Consultation Fee (LKR)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "prof-fee",
													type: "number",
													defaultValue: "2500",
													className: "pl-9"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 sm:col-span-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "prof-languages",
													children: "Languages Spoken"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "prof-languages",
														defaultValue: "English, Sinhala",
														className: "pl-9"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground",
													children: "Separate multiple languages with commas."
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "prof-about",
												children: "About / Biography"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "absolute left-3 top-3 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													id: "prof-about",
													defaultValue: "Primary care physician coordinating referrals and preventive health reviews.",
													className: "min-h-[100px] pl-9 pt-2.5"
												})]
											})]
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
								className: "bg-muted/30 pt-6 border-t border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: isSaving,
									className: "ml-auto",
									children: isSaving ? "Saving changes..." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 size-4" }), "Save Profile"] })
								})
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "mt-8 shadow-sm border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-lg flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							xmlns: "http://www.w3.org/2000/svg",
							width: "20",
							height: "20",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "2",
							strokeLinecap: "round",
							strokeLinejoin: "round",
							className: "text-primary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									width: "18",
									height: "18",
									x: "3",
									y: "4",
									rx: "2",
									ry: "2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "16",
									x2: "16",
									y1: "2",
									y2: "6"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "8",
									x2: "8",
									y1: "2",
									y2: "6"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1: "3",
									x2: "21",
									y1: "10",
									y2: "10"
								})
							]
						}), "Availability Schedule"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Set your availability for specific dates. Hospitals will see this status for your assigned branch." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col sm:flex-row gap-4 items-end",
						children: (() => {
							const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
							const [date, setDate] = (0, import_react.useState)(today);
							const [status, setStatus] = (0, import_react.useState)(true);
							(0, import_react.useEffect)(() => {
								if (!session) return;
								const fetchStatus = async () => {
									const data = await doctorService.getAllDoctors();
									const id = session.registration_id || `DOC-${session.id.substring(0, 6).toUpperCase()}`;
									const doc = data.find((d) => d.id === id || d.name === session.name);
									if (doc) {
										const isAvailable = doc.availability && doc.availability[date] !== void 0 ? doc.availability[date] : doc.online;
										setStatus(isAvailable);
									}
								};
								fetchStatus();
							}, [date, session]);
							const handleUpdateStatus = async (newStatus) => {
								if (!session) return;
								const data = await doctorService.getAllDoctors();
								const id = session.registration_id || `DOC-${session.id.substring(0, 6).toUpperCase()}`;
								const docIndex = data.findIndex((d) => d.id === id || d.name === session.name);
								if (docIndex > -1) {
									const currentDoc = data[docIndex];
									const updatedDoc = {
										...currentDoc,
										availability: {
											...currentDoc.availability || {},
											[date]: newStatus
										}
									};
									if (await doctorService.saveDoctor(updatedDoc)) {
										setStatus(newStatus);
										toast.success(`Marked as ${newStatus ? "Available" : "Offline"} for ${date}`);
									} else toast.error("Failed to update status");
								}
							};
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 w-full sm:w-auto flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "schedule-date",
									children: "Select Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "schedule-date",
									type: "date",
									value: date,
									onChange: (e) => setDate(e.target.value),
									min: today
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 w-full sm:w-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: status ? "default" : "outline",
									className: status ? "bg-green-600 hover:bg-green-700" : "",
									onClick: () => handleUpdateStatus(true),
									children: "Available"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: !status ? "destructive" : "outline",
									onClick: () => handleUpdateStatus(false),
									children: "Offline"
								})]
							})] });
						})()
					}) })]
				})]
			})]
		})]
	});
}
//#endregion
export { DoctorProfile as component };
