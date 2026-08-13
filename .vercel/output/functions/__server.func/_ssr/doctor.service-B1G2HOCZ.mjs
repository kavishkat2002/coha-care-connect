import { n as supabase } from "./supabase-CAKutjCx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/doctor.service-B1G2HOCZ.js
var doctorService = {
	/**
	* Fetch all doctors from Supabase
	*/
	async getAllDoctors() {
		const { data, error } = await supabase.from("doctors_roster").select("*");
		if (error) {
			console.error("Error fetching doctors:", error);
			return [];
		}
		return data || [];
	},
	/**
	* Fetch doctors by specialty, ordered by rating and distance
	*/
	async getDoctorsBySpecialty(specialty) {
		const searchPrefix = specialty ? specialty.slice(0, 5).toLowerCase() : "";
		const searchTerm = searchPrefix ? `%${searchPrefix}%` : "%";
		const { data, error } = await supabase.from("doctors_roster").select("*").ilike("specialty", searchTerm).order("rating", { ascending: false }).order("distanceKm", { ascending: true }).limit(3);
		if (error || !data || data.length === 0) {
			console.warn("Falling back to mock doctors for specialty:", specialty);
			const { doctors: mockDoctors } = await import("../_libs/_.mjs").then((n) => (n.a(), n.o));
			return mockDoctors.filter((d) => searchPrefix ? d.specialty.toLowerCase().includes(searchPrefix) : true).sort((a, b) => b.rating - a.rating || a.distanceKm - b.distanceKm).slice(0, 3);
		}
		return data;
	},
	/**
	* Save a single doctor to Supabase (insert or update)
	*/
	async saveDoctor(doctor) {
		const { error } = await supabase.from("doctors_roster").upsert([doctor], { onConflict: "id" });
		if (error) {
			console.error("Error saving doctor:", error);
			return false;
		}
		return true;
	},
	/**
	* Save multiple doctors (batch insert/update)
	*/
	async saveAllDoctors(doctors) {
		if (!doctors.length) return true;
		const { error } = await supabase.from("doctors_roster").upsert(doctors, { onConflict: "id" });
		if (error) {
			console.error("Error saving doctors batch:", error);
			return false;
		}
		return true;
	},
	/**
	* Delete a doctor by ID
	*/
	async deleteDoctor(id) {
		const { error } = await supabase.from("doctors_roster").delete().eq("id", id);
		if (error) {
			console.error("Error deleting doctor:", error);
			return false;
		}
		return true;
	}
};
//#endregion
export { doctorService as t };
