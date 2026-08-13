import { r as createServerFn } from "./server-IqVcekK32.mjs";
import { t as createServerRpc } from "./createServerRpc-btCq8XRi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api.profile-DjOnRfzf.js
var globalProfileStore = null;
var fetchProfileServer_createServerFn_handler = createServerRpc({
	id: "87ece0118feb81ffcebb1e76c3d745627d89c53ae28ed207ce312d19d9344727",
	name: "fetchProfileServer",
	filename: "src/routes/api.profile.ts"
}, (opts) => fetchProfileServer.__executeServer(opts));
var fetchProfileServer = createServerFn({ method: "GET" }).handler(fetchProfileServer_createServerFn_handler, async () => {
	return globalProfileStore;
});
var updateProfileServer_createServerFn_handler = createServerRpc({
	id: "f2ad9920ba57fb9ca49cbffd8f8e0244c86636432c3ab611909798c1f1e437c8",
	name: "updateProfileServer",
	filename: "src/routes/api.profile.ts"
}, (opts) => updateProfileServer.__executeServer(opts));
var updateProfileServer = createServerFn({ method: "POST" }).validator((data) => data).handler(updateProfileServer_createServerFn_handler, async ({ data }) => {
	globalProfileStore = data;
	return {
		success: true,
		profile: globalProfileStore
	};
});
//#endregion
export { fetchProfileServer_createServerFn_handler, updateProfileServer_createServerFn_handler };
