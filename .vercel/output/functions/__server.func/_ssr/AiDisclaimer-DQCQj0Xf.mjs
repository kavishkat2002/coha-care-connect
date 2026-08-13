import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { X as Info } from "../_libs/lucide-react.mjs";
import { i as AI_DISCLAIMER, u as init_mock } from "./server-IqVcekK3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AiDisclaimer-DQCQj0Xf.js
var import_jsx_runtime = require_jsx_runtime();
init_mock();
function AiDisclaimer({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "flex items-start gap-2 rounded-xl border border-border bg-muted/60 p-3 text-xs text-muted-foreground " + (className ?? ""),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
			className: "mt-0.5 size-3.5 shrink-0",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: AI_DISCLAIMER })]
	});
}
//#endregion
export { AiDisclaimer as t };
