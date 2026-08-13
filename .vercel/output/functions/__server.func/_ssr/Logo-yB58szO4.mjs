import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Logo-yB58szO4.js
var import_jsx_runtime = require_jsx_runtime();
function Logo({ subtitle = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex size-10 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 100 100",
				className: "size-full",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 22,65 A 38,38 0 1,1 78,65",
						stroke: "#15A6A6",
						strokeWidth: "5",
						strokeLinecap: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 28,68 C 28,68 28,35 28,35 L 50,48",
						stroke: "#0E3860",
						strokeWidth: "8",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 72,68 C 72,68 72,35 72,35 L 50,48",
						stroke: "#15A6A6",
						strokeWidth: "8",
						strokeLinecap: "round",
						strokeLinejoin: "round"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M 50,60 V 76 M 42,68 H 58",
						stroke: "#15A6A6",
						strokeWidth: "6",
						strokeLinecap: "round"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-tight flex flex-col justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "block text-[22px] font-bold tracking-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[#0E3860] dark:text-blue-100",
					children: "Med"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[#15A6A6] dark:text-teal-400",
					children: "Doc"
				})]
			}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[8px] font-bold tracking-widest text-muted-foreground uppercase mt-[-1px]",
				children: "Early detection. Better tomorrows."
			}) : null]
		})]
	});
}
//#endregion
export { Logo as t };
