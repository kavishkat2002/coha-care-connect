import { n as supabase } from "./supabase-CAKutjCx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hospital.service-CPNkTzfz.js
var hospitalService = {
	/**
	* Fetch all hospitals from Supabase
	*/
	async getAllHospitals() {
		const { data, error } = await supabase.from("hospitals").select("*");
		if (error) {
			console.error("Error fetching hospitals:", error);
			return [];
		}
		return data || [];
	},
	/**
	* Save a single hospital to Supabase (insert or update)
	*/
	async saveHospital(hospital) {
		const { error } = await supabase.from("hospitals").upsert([hospital], { onConflict: "id" });
		if (error) {
			console.error("Error saving hospital:", error);
			return false;
		}
		return true;
	},
	/**
	* Fetch reviews for a specific hospital
	*/
	async getHospitalReviews(hospitalId) {
		const { data, error } = await supabase.from("hospital_reviews").select("*").eq("hospital_id", hospitalId).order("created_at", { ascending: false });
		if (error) {
			console.warn("Error fetching hospital reviews from Supabase, falling back to LocalStorage:", error);
			try {
				return JSON.parse(localStorage.getItem("mock_hospital_reviews") || "[]").filter((r) => r.hospital_id === hospitalId);
			} catch (e) {
				return [];
			}
		}
		return data || [];
	},
	/**
	* Submit a new hospital review
	*/
	async addHospitalReview(review) {
		const { error } = await supabase.from("hospital_reviews").insert([review]);
		if (error) {
			console.warn("Error adding hospital review to Supabase, falling back to LocalStorage:", error);
			try {
				const localReviews = JSON.parse(localStorage.getItem("mock_hospital_reviews") || "[]");
				localReviews.push({
					...review,
					id: "local-" + Date.now(),
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				});
				localStorage.setItem("mock_hospital_reviews", JSON.stringify(localReviews));
				return true;
			} catch (e) {
				return false;
			}
		}
		return true;
	}
};
//#endregion
export { hospitalService as t };
