import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { a as signIn, i as portalHome, s as signUp } from "./auth.service-cQpuFi04.mjs";
import { t as Logo } from "./Logo-yB58szO4.mjs";
import { S as ShieldCheck, _ as Stethoscope, bt as Building2, l as UserRound } from "../_libs/lucide-react.mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as AiDisclaimer } from "./AiDisclaimer-DQCQj0Xf.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CnJ0mmPG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var roles = [
	{
		value: "patient",
		label: "Patient",
		icon: UserRound,
		blurb: "Book care and track your health"
	},
	{
		value: "doctor",
		label: "Doctor",
		icon: Stethoscope,
		blurb: "Manage your clinic and queue"
	},
	{
		value: "hospital",
		label: "Hospital",
		icon: Building2,
		blurb: "Run departments and staff"
	},
	{
		value: "admin",
		label: "Administrator",
		icon: ShieldCheck,
		blurb: "Platform operations"
	}
];
function RoleSelect({ value, onChange, allowed }) {
	const visibleRoles = allowed ? roles.filter((r) => allowed.includes(r.value)) : roles;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
			className: "text-sm font-medium text-foreground",
			children: "I am signing in as"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: visibleRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
				type: "button",
				"aria-pressed": value === r.value,
				onClick: () => onChange(r.value),
				whileHover: { scale: 1.01 },
				whileTap: { scale: .99 },
				className: cn("relative flex items-start gap-3 rounded-lg border p-4 text-left transition-colors duration-200", value === r.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-border/80 hover:bg-muted/50"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md transition-colors", value === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.icon, {
						className: "size-4",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "z-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("block text-sm font-medium transition-colors", value === r.value ? "text-primary" : "text-foreground"),
						children: r.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted-foreground mt-0.5 leading-snug",
						children: r.blurb
					})]
				})]
			}, r.value))
		})]
	});
}
function AuthPage() {
	const navigate = useNavigate();
	const [role, setRole] = (0, import_react.useState)("patient");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const handleLogin = async (email, password) => {
		setIsLoading(true);
		try {
			await signIn(email, password);
			toast.success("Signed in successfully");
			navigate({ to: portalHome[role] });
		} catch (error) {
			toast.error(error.message || "Failed to sign in");
		} finally {
			setIsLoading(false);
		}
	};
	const handleRegister = async (email, password, name, registerRole = "patient") => {
		setIsLoading(true);
		try {
			await signUp(email, password, registerRole, name);
			toast.success("Account created successfully");
			navigate({ to: portalHome[registerRole] });
		} catch (error) {
			toast.error(error.message || "Failed to create account");
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-dvh lg:grid-cols-2 bg-background font-sans",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative hidden flex-col justify-between p-12 lg:flex bg-slate-950 text-slate-50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-white drop-shadow-sm brightness-0 invert",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-20 max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							y: 15
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: {
							delay: .1,
							duration: .5
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-4xl font-semibold tracking-tight text-white leading-tight",
								children: "Care that starts with understanding."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 text-slate-300 leading-relaxed text-lg",
								children: "One seamless account connects your appointments, AI assessments, reports, and medical timeline across every hospital in the network."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-10 bg-slate-900 p-5 rounded-xl border border-slate-800",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiDisclaimer, { className: "text-slate-300 [&_svg]:text-slate-400" })
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "relative z-20 text-sm text-slate-500",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" MedDoc · Secure, consent-based health records"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center px-4 py-12 sm:px-8 bg-background",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md relative z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-8 lg:hidden flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						scale: .98
					},
					animate: {
						opacity: 1,
						scale: 1
					},
					transition: { duration: .4 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "login",
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "grid w-full grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "login",
									children: "Sign in"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "register",
									children: "Register"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "forgot",
									children: "Reset"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "login",
									className: "mt-0 outline-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: {
											opacity: 0,
											y: 5
										},
										animate: {
											opacity: 1,
											y: 0
										},
										transition: { duration: .2 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
											className: "border-border shadow-sm bg-card rounded-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
												className: "space-y-1.5 pb-6 pt-8 px-8",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
													className: "text-2xl font-semibold tracking-tight",
													children: "Welcome back"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
													className: "text-base",
													children: "Sign in to your MedDoc portal."
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
												className: "px-8 pb-8",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
													className: "space-y-5",
													onSubmit: (e) => {
														e.preventDefault();
														const data = new FormData(e.currentTarget);
														handleLogin(String(data.get("email")), String(data.get("password")));
													},
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleSelect, {
															value: role,
															onChange: setRole
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																htmlFor: "login-email",
																children: "Email address"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "login-email",
																name: "email",
																type: "email",
																required: true,
																placeholder: "you@example.com"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																htmlFor: "login-password",
																children: "Password"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "login-password",
																name: "password",
																type: "password",
																required: true,
																placeholder: "••••••••"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															type: "submit",
															className: "w-full h-11 text-base font-medium",
															disabled: isLoading,
															children: isLoading ? "Signing in..." : "Sign in"
														})
													]
												})
											})]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "register",
									className: "mt-0 outline-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: {
											opacity: 0,
											y: 5
										},
										animate: {
											opacity: 1,
											y: 0
										},
										transition: { duration: .2 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
											className: "border-border shadow-sm bg-card rounded-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
												className: "space-y-1.5 pb-6 pt-8 px-8",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
													className: "text-2xl font-semibold tracking-tight",
													children: "Create account"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
													className: "text-base",
													children: "Choose the role that matches how you will use MedDoc."
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
												className: "px-8 pb-8",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
													className: "space-y-5",
													onSubmit: (e) => {
														e.preventDefault();
														const data = new FormData(e.currentTarget);
														handleRegister(String(data.get("email")), String(data.get("password")), String(data.get("name")), role);
													},
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleSelect, {
															value: role,
															onChange: setRole,
															allowed: ["patient", "admin"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																htmlFor: "reg-name",
																children: "Full name"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "reg-name",
																name: "name",
																required: true,
																placeholder: "Dilani Rathnayake"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																htmlFor: "reg-email",
																children: "Email address"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "reg-email",
																name: "email",
																type: "email",
																required: true,
																placeholder: "you@example.com"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																htmlFor: "reg-password",
																children: "Password"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "reg-password",
																name: "password",
																type: "password",
																required: true,
																minLength: 8,
																placeholder: "At least 8 characters"
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															type: "submit",
															className: "w-full h-11 text-base font-medium",
															disabled: isLoading,
															children: isLoading ? "Creating account..." : "Create account"
														})
													]
												})
											})]
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "forgot",
									className: "mt-0 outline-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: {
											opacity: 0,
											y: 5
										},
										animate: {
											opacity: 1,
											y: 0
										},
										transition: { duration: .2 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
											className: "border-border shadow-sm bg-card rounded-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
												className: "space-y-1.5 pb-6 pt-8 px-8",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
													className: "text-2xl font-semibold tracking-tight",
													children: "Reset password"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
													className: "text-base",
													children: "We will email you a secure reset link."
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
												className: "px-8 pb-8",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
													className: "space-y-5",
													onSubmit: (e) => {
														e.preventDefault();
														toast.success("If the email exists, a reset link is on its way.");
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															htmlFor: "forgot-email",
															children: "Email address"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "forgot-email",
															type: "email",
															required: true,
															placeholder: "you@example.com"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														type: "submit",
														variant: "default",
														className: "w-full h-11 text-base font-medium",
														children: "Send reset link"
													})]
												})
											})]
										})
									})
								})
							]
						})]
					})
				})]
			})
		})]
	});
}
//#endregion
export { AuthPage as component };
