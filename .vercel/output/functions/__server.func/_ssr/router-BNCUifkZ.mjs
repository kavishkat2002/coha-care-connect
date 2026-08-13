import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as createRootRouteWithContext, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { o as __exportAll } from "./server-qE7WcvYQ.mjs";
import { i as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-qE7WcvYQ2.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BNCUifkZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-LT0L8CXk.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$25 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "MedDoc — Intelligent Healthcare Platform" },
			{
				name: "description",
				content: "MedDoc unifies appointment booking, an AI healthcare assistant, medical image and report analysis, and telemedicine in one platform."
			},
			{
				name: "author",
				content: "MedDoc"
			},
			{
				property: "og:title",
				content: "MedDoc — Intelligent Healthcare Platform"
			},
			{
				property: "og:description",
				content: "AI-assisted early screening, specialist recommendation, and connected care for patients, doctors and hospitals."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$25.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-right" })]
	});
}
var $$splitComponentImporter$24 = () => import("./routes-Bxt5kqzb.mjs");
var Route$24 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "MedDoc — AI-Powered Healthcare & Early Cancer Screening" },
		{
			name: "description",
			content: "Book appointments, chat with an AI health assistant, analyse medical images and reports, and consult online — all in one healthcare platform."
		},
		{
			property: "og:title",
			content: "MedDoc — AI-Powered Healthcare & Early Cancer Screening"
		},
		{
			property: "og:description",
			content: "AI-assisted assessments, specialist recommendation and telemedicine for patients, doctors and hospitals."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./admin-C4OUHA5j.mjs");
var Route$23 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./auth-CnJ0mmPG.mjs");
var Route$22 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in — MedDoc" },
		{
			name: "description",
			content: "Sign in or create a MedDoc account as a patient, doctor or hospital to access your care portal."
		},
		{
			property: "og:title",
			content: "Sign in — MedDoc"
		},
		{
			property: "og:description",
			content: "Access your MedDoc patient, doctor or hospital portal."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./doctor-ebJ-e0Gv.mjs");
var Route$21 = createFileRoute("/doctor")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./hospital-BW8qQlD8.mjs");
var Route$20 = createFileRoute("/hospital")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./patient-kxKi-WNa.mjs");
var Route$19 = createFileRoute("/patient")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./admin.index-qSlY5W_F.mjs");
var Route$18 = createFileRoute("/admin/")({
	head: () => ({ meta: [
		{ title: "Platform administration — MedDoc" },
		{
			name: "description",
			content: "Users, hospitals, appointments, AI monitoring and platform settings."
		},
		{
			property: "og:title",
			content: "Platform administration — MedDoc"
		},
		{
			property: "og:description",
			content: "Operational and AI monitoring for the MedDoc platform."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var $$splitComponentImporter$17 = () => import("./api.profile-D0CD6DPY.mjs");
createServerFn({ method: "GET" }).handler(createSsrRpc("87ece0118feb81ffcebb1e76c3d745627d89c53ae28ed207ce312d19d9344727"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("f2ad9920ba57fb9ca49cbffd8f8e0244c86636432c3ab611909798c1f1e437c8"));
var Route$17 = createFileRoute("/api/profile")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./doctor.index-CwZeJdwA.mjs");
var Route$16 = createFileRoute("/doctor/")({
	head: () => ({ meta: [
		{ title: "Doctor dashboard — MedDoc" },
		{
			name: "description",
			content: "Today's appointments, patient queue and AI assessments awaiting review."
		},
		{
			property: "og:title",
			content: "Doctor dashboard — MedDoc"
		},
		{
			property: "og:description",
			content: "Clinic queue, AI assessments and follow-ups."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./doctor.profile-D-R0Sbft.mjs");
var Route$15 = createFileRoute("/doctor/profile")({
	head: () => ({ meta: [{ title: "Doctor Profile — MedDoc" }, {
		name: "description",
		content: "Manage your professional doctor profile and settings."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./hospital.index-Jvxe1Mhf.mjs");
var Route$14 = createFileRoute("/hospital/")({
	head: () => ({ meta: [
		{ title: "Hospital dashboard — MedDoc" },
		{
			name: "description",
			content: "Doctors, departments, appointments, revenue and ratings across your branches."
		},
		{
			property: "og:title",
			content: "Hospital dashboard — MedDoc"
		},
		{
			property: "og:description",
			content: "Operational view of departments, staff and appointments."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./hospital.branches-BkZyQw2m.mjs");
var Route$13 = createFileRoute("/hospital/branches")({
	head: () => ({ meta: [{ title: "Manage Branches — Hospital Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./hospital.doctors-DhwpamPr.mjs");
var Route$12 = createFileRoute("/hospital/doctors")({
	head: () => ({ meta: [{ title: "Manage Doctors — Hospital Portal" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./hospital.profile-BjUscJfZ.mjs");
var Route$11 = createFileRoute("/hospital/profile")({
	head: () => ({ meta: [{ title: "Hospital Profile — MedDoc" }, {
		name: "description",
		content: "Manage your hospital profile, facilities, and contact details."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./patient.index-Cq2cCCYf.mjs");
var Route$10 = createFileRoute("/patient/")({
	head: () => ({ meta: [
		{ title: "Patient dashboard — MedDoc" },
		{
			name: "description",
			content: "Your health summary, upcoming appointments, recent reports and AI health insights in one place."
		},
		{
			property: "og:title",
			content: "Patient dashboard — MedDoc"
		},
		{
			property: "og:description",
			content: "Health summary, appointments and AI insights."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./patient.appointments-CbNc6Uh5.mjs");
var Route$9 = createFileRoute("/patient/appointments")({
	head: () => ({ meta: [
		{ title: "My appointments — MedDoc" },
		{
			name: "description",
			content: "Upcoming and past appointments with status and QR tickets."
		},
		{
			property: "og:title",
			content: "My appointments — MedDoc"
		},
		{
			property: "og:description",
			content: "Track upcoming and past consultations."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./patient.assistant-DE9NeY2s.mjs");
var Route$8 = createFileRoute("/patient/assistant")({
	head: () => ({ meta: [
		{ title: "AI health assistant — MedDoc" },
		{
			name: "description",
			content: "Describe your symptoms, attach images or reports, and receive an AI-assisted assessment with specialist recommendations."
		},
		{
			property: "og:title",
			content: "AI health assistant — MedDoc"
		},
		{
			property: "og:description",
			content: "AI-assisted symptom assessment and care recommendations."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./patient.book-CIUqawao.mjs");
var Route$7 = createFileRoute("/patient/book")({
	validateSearch: (search) => {
		const doctorId = search["doctorId"];
		if (typeof doctorId === "string" && doctorId) return { doctorId };
		return {};
	},
	head: () => ({ meta: [
		{ title: "Book an appointment — MedDoc" },
		{
			name: "description",
			content: "Search doctors, hospitals, branches and specialties, compare ratings and availability, then confirm your appointment."
		},
		{
			property: "og:title",
			content: "Book an appointment — MedDoc"
		},
		{
			property: "og:description",
			content: "Find a specialist and confirm a slot in minutes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./patient.epass-Oataj_3l.mjs");
var Route$6 = createFileRoute("/patient/epass")({
	head: () => ({ meta: [{ title: "MedDoc ePass — Digital Health Pass" }, {
		name: "description",
		content: "Access priority hospital queues, discounted diagnostics, and 24/7 digital care with MedDoc ePass."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./patient.images-CEb7SyZa.mjs");
var Route$5 = createFileRoute("/patient/images")({
	head: () => ({ meta: [
		{ title: "Medical image analysis — MedDoc" },
		{
			name: "description",
			content: "Upload oral, skin, breast or eye images for an AI-assisted quality check, lesion highlighting and risk indication."
		},
		{
			property: "og:title",
			content: "Medical image analysis — MedDoc"
		},
		{
			property: "og:description",
			content: "AI-assisted review of oral, skin, breast and eye images."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./patient.medmind-ecare-DDHDPkiS.mjs");
var Route$4 = createFileRoute("/patient/medmind-ecare")({
	head: () => ({ meta: [{ title: "MedMind eCare — Gemini Live Doctor Voice Call" }, {
		name: "description",
		content: "Experience real-time hands-free voice calls with Dr. Nuwan & Dr. Ishani."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./patient.profile-C0w2_B3Y.mjs");
var Route$3 = createFileRoute("/patient/profile")({
	head: () => ({ meta: [
		{ title: "My health profile — MedDoc" },
		{
			name: "description",
			content: "Personal details, medical history, medications, allergies and family history."
		},
		{
			property: "og:title",
			content: "My health profile — MedDoc"
		},
		{
			property: "og:description",
			content: "Your digital health record in one place."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./patient.reports-BUumxcIW.mjs");
var Route$2 = createFileRoute("/patient/reports")({
	head: () => ({ meta: [
		{ title: "Medical report analysis — MedDoc" },
		{
			name: "description",
			content: "Upload blood, MRI, CT, biopsy or laboratory reports and get abnormal values highlighted and explained in plain language."
		},
		{
			property: "og:title",
			content: "Medical report analysis — MedDoc"
		},
		{
			property: "og:description",
			content: "Understand your medical reports in plain language."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./patient.telemedicine-CPI90hNS.mjs");
var Route$1 = createFileRoute("/patient/telemedicine")({
	head: () => ({ meta: [
		{ title: "Telemedicine — MedDoc" },
		{
			name: "description",
			content: "Consult online doctors by video, voice or chat, with digital prescriptions and follow-ups."
		},
		{
			property: "og:title",
			content: "Telemedicine — MedDoc"
		},
		{
			property: "og:description",
			content: "Video, voice and chat consultations with online doctors."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./patient.timeline-CO0NcH9e.mjs");
var Route = createFileRoute("/patient/timeline")({
	head: () => ({ meta: [
		{ title: "Health timeline — MedDoc" },
		{
			name: "description",
			content: "A chronological view of your visits, reports, image assessments and health insights."
		},
		{
			property: "og:title",
			content: "Health timeline — MedDoc"
		},
		{
			property: "og:description",
			content: "Your care history in one chronological record."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$24.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var AdminRoute = Route$23.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$25
});
var AuthRoute = Route$22.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$25
});
var DoctorRoute = Route$21.update({
	id: "/doctor",
	path: "/doctor",
	getParentRoute: () => Route$25
});
var HospitalRoute = Route$20.update({
	id: "/hospital",
	path: "/hospital",
	getParentRoute: () => Route$25
});
var PatientRoute = Route$19.update({
	id: "/patient",
	path: "/patient",
	getParentRoute: () => Route$25
});
var AdminIndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var ApiProfileRoute = Route$17.update({
	id: "/api/profile",
	path: "/api/profile",
	getParentRoute: () => Route$25
});
var DoctorIndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => DoctorRoute
});
var DoctorProfileRoute = Route$15.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => DoctorRoute
});
var HospitalIndexRoute = Route$14.update({
	id: "/",
	path: "/",
	getParentRoute: () => HospitalRoute
});
var HospitalBranchesRoute = Route$13.update({
	id: "/branches",
	path: "/branches",
	getParentRoute: () => HospitalRoute
});
var HospitalDoctorsRoute = Route$12.update({
	id: "/doctors",
	path: "/doctors",
	getParentRoute: () => HospitalRoute
});
var HospitalProfileRoute = Route$11.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => HospitalRoute
});
var PatientIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => PatientRoute
});
var PatientAppointmentsRoute = Route$9.update({
	id: "/appointments",
	path: "/appointments",
	getParentRoute: () => PatientRoute
});
var PatientAssistantRoute = Route$8.update({
	id: "/assistant",
	path: "/assistant",
	getParentRoute: () => PatientRoute
});
var PatientBookRoute = Route$7.update({
	id: "/book",
	path: "/book",
	getParentRoute: () => PatientRoute
});
var PatientEpassRoute = Route$6.update({
	id: "/epass",
	path: "/epass",
	getParentRoute: () => PatientRoute
});
var PatientImagesRoute = Route$5.update({
	id: "/images",
	path: "/images",
	getParentRoute: () => PatientRoute
});
var PatientMedmindEcareRoute = Route$4.update({
	id: "/medmind-ecare",
	path: "/medmind-ecare",
	getParentRoute: () => PatientRoute
});
var PatientProfileRoute = Route$3.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => PatientRoute
});
var PatientReportsRoute = Route$2.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => PatientRoute
});
var PatientTelemedicineRoute = Route$1.update({
	id: "/telemedicine",
	path: "/telemedicine",
	getParentRoute: () => PatientRoute
});
var PatientTimelineRoute = Route.update({
	id: "/timeline",
	path: "/timeline",
	getParentRoute: () => PatientRoute
});
var AdminRouteChildren = { AdminIndexRoute };
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var DoctorRouteChildren = {
	DoctorProfileRoute,
	DoctorIndexRoute
};
var DoctorRouteWithChildren = DoctorRoute._addFileChildren(DoctorRouteChildren);
var HospitalRouteChildren = {
	HospitalBranchesRoute,
	HospitalDoctorsRoute,
	HospitalProfileRoute,
	HospitalIndexRoute
};
var HospitalRouteWithChildren = HospitalRoute._addFileChildren(HospitalRouteChildren);
var PatientRouteChildren = {
	PatientAppointmentsRoute,
	PatientAssistantRoute,
	PatientBookRoute,
	PatientEpassRoute,
	PatientImagesRoute,
	PatientMedmindEcareRoute,
	PatientProfileRoute,
	PatientReportsRoute,
	PatientTelemedicineRoute,
	PatientTimelineRoute,
	PatientIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	AuthRoute,
	DoctorRoute: DoctorRouteWithChildren,
	HospitalRoute: HospitalRouteWithChildren,
	PatientRoute: PatientRoute._addFileChildren(PatientRouteChildren),
	ApiProfileRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route$7 as n, createSsrRpc as r, router_exports as t };
