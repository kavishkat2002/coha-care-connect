import { t as TSS_SERVER_FUNCTION } from "./server-B024QcWx2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createServerRpc-Bj_K7Hff.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
export { createServerRpc as t };
