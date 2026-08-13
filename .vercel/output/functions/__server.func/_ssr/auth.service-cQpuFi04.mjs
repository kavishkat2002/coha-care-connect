import { n as supabase, t as adminAuthClient } from "./supabase-CAKutjCx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth.service-cQpuFi04.js
var mapUserToSession = (user) => {
	if (!user) return null;
	return {
		id: user.id,
		email: user.email,
		role: user.user_metadata?.role || "patient",
		name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Member",
		registration_id: user.user_metadata?.registration_id
	};
};
async function getSession() {
	const { data, error } = await supabase.auth.getSession();
	if (error || !data.session) return null;
	return mapUserToSession(data.session.user);
}
var generateRegId = (role) => {
	if (role !== "doctor") return void 0;
	return `DOC-${Math.floor(Math.random() * 9e5) + 1e5}`;
};
async function signUp(email, password, role, name) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: { data: {
			role,
			name,
			registration_id: generateRegId(role)
		} }
	});
	if (error) throw error;
	return mapUserToSession(data.user);
}
async function adminCreateAccount(email, password, role, name) {
	const { data: currentSessionData } = await supabase.auth.getSession();
	const { data, error } = await adminAuthClient.auth.signUp({
		email,
		password,
		options: { data: {
			role,
			name,
			registration_id: generateRegId(role)
		} }
	});
	if (error) throw error;
	await adminAuthClient.auth.signOut();
	if (currentSessionData.session) await supabase.auth.setSession({
		access_token: currentSessionData.session.access_token,
		refresh_token: currentSessionData.session.refresh_token
	});
	return mapUserToSession(data.user);
}
async function signIn(email, password) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});
	if (error) throw error;
	return mapUserToSession(data.user);
}
async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}
function onAuthStateChange(callback) {
	const { data } = supabase.auth.onAuthStateChange((_event, session) => {
		callback(mapUserToSession(session?.user));
	});
	return data.subscription;
}
var portalHome = {
	patient: "/patient",
	doctor: "/doctor",
	hospital: "/hospital",
	admin: "/admin"
};
//#endregion
export { signIn as a, portalHome as i, getSession as n, signOut as o, onAuthStateChange as r, signUp as s, adminCreateAccount as t };
