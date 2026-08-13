import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { E as Save, F as Pencil, K as LoaderCircle, n as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, t as Card } from "./card-BfBj_YIE.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as patientService } from "./patient.service-ClJFNjzy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.profile-C0w2_B3Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function List({ title, items }) {
	if (!items || items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-soft",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: title
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "space-y-2",
			children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-border bg-muted/40 p-3 text-sm",
				children: i
			}, i))
		})]
	});
}
function ProfilePage() {
	const [p, setP] = (0, import_react.useState)(null);
	const [isEditing, setIsEditing] = (0, import_react.useState)(false);
	const [editData, setEditData] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		async function load() {
			if (isEditing) return;
			const data = await patientService.getPatientProfile();
			if (data) {
				setP(data);
				setEditData(data);
			}
		}
		load();
		const channel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("coha_profile_sync") : null;
		if (channel) channel.onmessage = (event) => {
			if (event.data?.profile && !isEditing) {
				setP(event.data.profile);
				setEditData(event.data.profile);
			}
		};
		const handleStorage = (e) => {
			if (e.key === "coha_patient_profile_shared" && e.newValue && !isEditing) try {
				const parsed = JSON.parse(e.newValue);
				setP(parsed);
				setEditData(parsed);
			} catch (err) {}
		};
		window.addEventListener("storage", handleStorage);
		const pollInterval = setInterval(() => {
			if (!isEditing) load();
		}, 3e3);
		return () => {
			channel?.close();
			window.removeEventListener("storage", handleStorage);
			clearInterval(pollInterval);
		};
	}, [isEditing]);
	const handleSave = async () => {
		if (!p) return;
		setSaving(true);
		try {
			const updated = {
				...p,
				...editData
			};
			setP(updated);
			setIsEditing(false);
			const result = await patientService.updatePatientProfile(updated);
			if (result) {
				setP(result);
				toast.success("Profile updated successfully");
			} else toast.error("Failed to update profile");
		} catch (e) {
			toast.error("An unexpected error occurred");
		} finally {
			setSaving(false);
		}
	};
	if (!p) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-muted-foreground",
		children: "Loading profile..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Health profile",
				description: "Keep this current so recommendations stay accurate."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-soft",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Personal information"
					}), !isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setIsEditing(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5 mr-2" }), "Edit"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setIsEditing(false),
							disabled: saving,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5 mr-2" }), "Cancel"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: handleSave,
							disabled: saving,
							children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-3.5 mr-2" }), "Save"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "grid gap-5 sm:grid-cols-3",
					children: [
						{
							label: "Name",
							key: "name",
							type: "text"
						},
						{
							label: "Age",
							key: "age",
							type: "number"
						},
						{
							label: "Gender",
							key: "gender",
							type: "text"
						},
						{
							label: "Blood group",
							key: "bloodGroup",
							type: "text"
						},
						{
							label: "City",
							key: "city",
							type: "text"
						},
						{
							label: "Phone",
							key: "phone",
							type: "text"
						},
						{
							label: "Email",
							key: "email",
							type: "email"
						}
					].map(({ label, key, type }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground mb-1",
						children: label
					}), isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type,
						value: editData[key] || "",
						onChange: (e) => setEditData({
							...editData,
							[key]: type === "number" ? parseInt(e.target.value) || 0 : e.target.value
						}),
						className: "h-8 text-sm"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "text-sm font-medium",
						children: p[key]
					})] }, key))
				}) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
						title: "Past diseases",
						items: p.pastDiseases
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
						title: "Current medications",
						items: p.medications
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
						title: "Allergies",
						items: p.allergies
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
						title: "Family history",
						items: p.familyHistory
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				children: "Records are shared only with clinicians you book with"
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
