import { n as supabase } from "./supabase-CAKutjCx.mjs";
import { f as patientProfile, m as timeline, p as reports, u as init_mock } from "./server-BBwoW3Vo.mjs";
import { r as createServerFn } from "./server-BBwoW3Vo2.mjs";
import { r as createSsrRpc } from "./router-Bv4bCY6n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.service-CVz31mvu.js
init_mock();
var fetchServerProfile = createServerFn({ method: "GET" }).handler(createSsrRpc("a842eda2cee2fd9da27026f17f67c2340d86ebad4d44aaa9b9b3c4b09f4d3d00"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0089292b98181cd7dbfe5e8fbca3a6a3dc29bf87ad599183c4c0a889188688d4"));
var profileSyncChannel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("coha_profile_sync") : null;
var patientService = {
	/**
	* Fetch all appointments from Supabase
	*/
	async getAppointments() {
		try {
			const res = await fetch("/api/appointments");
			if (res.ok) {
				const data = await res.json();
				if (Array.isArray(data) && data.length > 0) return data;
			}
		} catch (e) {}
		const { data, error } = await supabase.from("appointments").select("*");
		if (!error && data && data.length > 0) return data;
		try {
			const localApps = JSON.parse(localStorage.getItem("mock_appointments") || "[]");
			if (Array.isArray(localApps)) return localApps;
		} catch (e) {}
		return [];
	},
	/**
	* Fetch custom time slots for a doctor on a specific date, or fallback to defaults
	*/
	async getDoctorAvailability(doctorId, date) {
		const { data, error } = await supabase.from("doctor_availability").select("time_slots").eq("doctor_id", doctorId).eq("date", date).single();
		if (error || !data || !data.time_slots || data.time_slots.length === 0) return [
			"09:00",
			"10:30",
			"12:00",
			"14:30",
			"16:30",
			"18:00"
		];
		return data.time_slots;
	},
	/**
	* Fetch how many patients are booked for a specific doctor, date, and time slot
	*/
	async getSlotQueueCount(doctorId, date, time) {
		const { count, error } = await supabase.from("appointments").select("*", {
			count: "exact",
			head: true
		}).eq("doctor_id", doctorId).eq("date", date).eq("time", time);
		if (error) {
			console.warn("Supabase count failed, falling back to LocalStorage:", error);
			try {
				return JSON.parse(localStorage.getItem("mock_appointments") || "[]").filter((a) => a.doctor_id === doctorId && a.date === date && a.time === time).length;
			} catch (e) {
				return 0;
			}
		}
		return count || 0;
	},
	/**
	* Securely book an appointment and return the assigned queue number
	*/
	async bookAppointment(appointment) {
		const assignedQueueNumber = await this.getSlotQueueCount(appointment.doctor_id, appointment.date, appointment.time) + 1;
		const newApp = {
			...appointment,
			queue_number: assignedQueueNumber,
			id: "app-" + Date.now()
		};
		try {
			fetch("/api/appointments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newApp)
			});
		} catch (e) {}
		const { data, error } = await supabase.from("appointments").insert([{
			...appointment,
			queue_number: assignedQueueNumber
		}]).select().single();
		if (error) {
			console.warn("Supabase insert failed, falling back to LocalStorage:", error);
			try {
				const localApps = JSON.parse(localStorage.getItem("mock_appointments") || "[]");
				localApps.push(newApp);
				localStorage.setItem("mock_appointments", JSON.stringify(localApps));
				return newApp;
			} catch (e) {
				return newApp;
			}
		}
		return data || newApp;
	},
	/**
	* Fetch all reports from Supabase
	*/
	async getReports() {
		try {
			const { data, error } = await supabase.from("reports").select("*");
			if (!error && data && data.length > 0) return data;
		} catch (e) {}
		return reports;
	},
	/**
	* Fetch timeline from Supabase or fallback
	*/
	async getTimeline() {
		try {
			const { data, error } = await supabase.from("timeline").select("*").order("date", { ascending: false });
			if (!error && data && data.length > 0) return data;
		} catch (e) {}
		return timeline;
	},
	/**
	* Fetch patient profile from domain cookie, Supabase, or local storage
	*/
	async getPatientProfile(id) {
		let activeId = id || "p1";
		try {
			const res = await fetch("/api/profile");
			if (res.ok) {
				const data = await res.json();
				if (data && data.name) return data;
			}
		} catch (e) {}
		try {
			const serverProfile = await fetchServerProfile();
			if (serverProfile && serverProfile.name) return serverProfile;
		} catch (e) {}
		if (typeof document !== "undefined") try {
			const match = document.cookie.match(/(?:^|; )coha_patient_profile=([^;]*)/);
			if (match && match[1]) {
				const parsed = JSON.parse(decodeURIComponent(match[1]));
				if (parsed && parsed.name) return parsed;
			}
		} catch (e) {}
		try {
			const shared = localStorage.getItem("coha_patient_profile_shared");
			if (shared) {
				const parsed = JSON.parse(shared);
				if (parsed && parsed.name) return parsed;
			}
			const local = localStorage.getItem(`mock_patient_profile_${activeId}`);
			if (local) {
				const parsed = JSON.parse(local);
				if (parsed && parsed.name) return parsed;
			}
		} catch (e) {}
		try {
			const { data, error } = await supabase.from("patient_profiles").select("*").eq("id", activeId).single();
			if (!error && data) return data;
		} catch (e) {}
		return {
			id: activeId,
			...patientProfile
		};
	},
	/**
	* Update patient profile with domain cookie and shared storage persistence
	*/
	async updatePatientProfile(profile) {
		try {
			Object.assign(patientProfile, profile);
		} catch (e) {}
		try {
			fetch("/api/profile", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(profile)
			});
		} catch (e) {}
		if (typeof document !== "undefined") try {
			const cookieVal = encodeURIComponent(JSON.stringify(profile));
			document.cookie = `coha_patient_profile=${cookieVal}; path=/; max-age=31536000; SameSite=Lax`;
		} catch (e) {}
		try {
			localStorage.setItem(`mock_patient_profile_${profile.id}`, JSON.stringify(profile));
			localStorage.setItem("coha_patient_profile_shared", JSON.stringify(profile));
			profileSyncChannel?.postMessage({
				type: "PROFILE_UPDATED",
				profile
			});
		} catch (e) {}
		try {
			const { data, error } = await supabase.from("patient_profiles").upsert(profile).select().single();
			if (!error && data) return data;
		} catch (e) {}
		return profile;
	},
	/**
	* Instantly sync active MedDoc ePass membership & profile details to Supabase
	*/
	async syncEPassMembershipToSupabase(membership) {
		try {
			const { data, error } = await supabase.from("patient_memberships").upsert({
				id: membership.patient_id,
				patient_name: membership.patient_name,
				patient_phone: membership.patient_phone,
				patient_nic: membership.patient_nic,
				plan_id: membership.plan_id,
				plan_name: membership.plan_name,
				status: membership.status,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).select();
			if (!error) console.log("Supabase ePass sync success:", data);
		} catch (e) {
			console.warn("Supabase ePass sync notice:", e);
		}
		try {
			fetch("/api/epass", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(membership)
			});
		} catch (e) {}
	},
	/**
	* Fetch doctor reviews
	*/
	async getDoctorReviews(doctorId) {
		const { data, error } = await supabase.from("doctor_reviews").select("*").eq("doctor_id", doctorId).order("created_at", { ascending: false });
		let results = data || [];
		if (error) console.warn("Error fetching doctor reviews from Supabase, falling back to local storage:", error);
		try {
			const localForDoc = JSON.parse(localStorage.getItem("mock_doctor_reviews") || "[]").filter((r) => r.doctor_id === doctorId);
			results = [...results, ...localForDoc].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
		} catch (e) {}
		return results;
	},
	/**
	* Add a new doctor review
	*/
	async addDoctorReview(review) {
		const { data, error } = await supabase.from("doctor_reviews").insert([review]).select().single();
		if (error) {
			console.warn("Supabase insert failed, falling back to LocalStorage:", error);
			try {
				const localReviews = JSON.parse(localStorage.getItem("mock_doctor_reviews") || "[]");
				const newReview = {
					...review,
					id: "local-rev-" + Date.now(),
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				};
				localReviews.push(newReview);
				localStorage.setItem("mock_doctor_reviews", JSON.stringify(localReviews));
				return newReview;
			} catch (e) {
				return null;
			}
		}
		return data;
	},
	/**
	* Update an existing doctor review
	*/
	async updateDoctorReview(reviewId, rating, comment) {
		const { data, error } = await supabase.from("doctor_reviews").update({
			rating,
			comment
		}).eq("id", reviewId).select().single();
		if (error) {
			console.warn("Supabase update failed, falling back to LocalStorage:", error);
			try {
				const localReviews = JSON.parse(localStorage.getItem("mock_doctor_reviews") || "[]");
				const index = localReviews.findIndex((r) => r.id === reviewId);
				if (index > -1) {
					localReviews[index] = {
						...localReviews[index],
						rating,
						comment
					};
					localStorage.setItem("mock_doctor_reviews", JSON.stringify(localReviews));
					return localReviews[index];
				}
				return null;
			} catch (e) {
				return null;
			}
		}
		return data;
	},
	/**
	* Delete a doctor review
	*/
	async deleteDoctorReview(reviewId) {
		const { error } = await supabase.from("doctor_reviews").delete().eq("id", reviewId);
		if (error) {
			console.warn("Supabase delete failed, falling back to LocalStorage:", error);
			try {
				const filtered = JSON.parse(localStorage.getItem("mock_doctor_reviews") || "[]").filter((r) => r.id !== reviewId);
				localStorage.setItem("mock_doctor_reviews", JSON.stringify(filtered));
				return true;
			} catch (e) {
				return false;
			}
		}
		return true;
	},
	/**
	* Check if patient has a previous booking with a doctor
	*/
	async hasPreviousBooking(doctorId, patientId) {
		const { count, error } = await supabase.from("appointments").select("*", {
			count: "exact",
			head: true
		}).eq("doctor_id", doctorId).eq("patient_id", patientId).in("status", ["Completed", "Confirmed"]);
		if (error) console.warn("Error checking previous bookings in Supabase, falling back to local:", error);
		try {
			if (JSON.parse(localStorage.getItem("mock_appointments") || "[]").some((app) => app.doctor_id === doctorId && app.patient_id === patientId && (app.status === "Completed" || app.status === "Confirmed"))) return true;
		} catch (e) {}
		return count ? count > 0 : false;
	}
};
//#endregion
export { patientService as t };
