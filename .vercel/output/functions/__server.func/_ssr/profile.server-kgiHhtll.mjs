import { r as createServerFn } from "./server-B024QcWx2.mjs";
import { t as createServerRpc } from "./createServerRpc-Bj_K7Hff.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile.server-kgiHhtll.js
var globalProfileStore = null;
var fetchServerProfile_createServerFn_handler = createServerRpc({
	id: "a842eda2cee2fd9da27026f17f67c2340d86ebad4d44aaa9b9b3c4b09f4d3d00",
	name: "fetchServerProfile",
	filename: "src/services/profile.server.ts"
}, (opts) => fetchServerProfile.__executeServer(opts));
var fetchServerProfile = createServerFn({ method: "GET" }).handler(fetchServerProfile_createServerFn_handler, async () => {
	return globalProfileStore;
});
var updateServerProfile_createServerFn_handler = createServerRpc({
	id: "0089292b98181cd7dbfe5e8fbca3a6a3dc29bf87ad599183c4c0a889188688d4",
	name: "updateServerProfile",
	filename: "src/services/profile.server.ts"
}, (opts) => updateServerProfile.__executeServer(opts));
var updateServerProfile = createServerFn({ method: "POST" }).validator((data) => data).handler(updateServerProfile_createServerFn_handler, async ({ data }) => {
	globalProfileStore = data;
	return {
		success: true,
		profile: globalProfileStore
	};
});
//#endregion
export { fetchServerProfile_createServerFn_handler, updateServerProfile_createServerFn_handler };
