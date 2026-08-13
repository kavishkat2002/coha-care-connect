import { o as server_exports } from "./server-DlLVIWDa2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mock-Cg4HUMGV.js
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toCommonJS = (mod) => __hasOwnProp.call(mod, "module.exports") ? mod["module.exports"] : __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var mock_exports = /* @__PURE__ */ __exportAll({
	AI_DISCLAIMER: () => AI_DISCLAIMER,
	SPECIALTIES: () => SPECIALTIES,
	appointments: () => appointments,
	doctors: () => doctors,
	hospitals: () => hospitals,
	patientProfile: () => patientProfile,
	reports: () => reports,
	timeline: () => timeline
});
var SPECIALTIES;
var doctors;
var hospitals;
var appointments;
var reports;
var timeline;
var patientProfile;
var AI_DISCLAIMER;
var init_mock = __esmMin((() => {
	SPECIALTIES = [
		"Psychiatry & Mental Health",
		"Dermatology",
		"Oncology",
		"Ophthalmology",
		"Dentistry & Oral Medicine",
		"General Medicine",
		"Radiology",
		"Cardiology",
		"Gynaecology"
	];
	doctors = [
		{
			id: "d1",
			name: "Dr. Amara Silva",
			specialty: "Dermatology",
			hospital: "Lakeside General Hospital",
			branch: "Colombo 07",
			city: "Colombo",
			distanceKm: 2.4,
			experienceYears: 14,
			rating: 4.9,
			reviews: 412,
			fee: 4500,
			languages: ["English", "Sinhala"],
			online: true,
			queue: 3,
			nextSlot: "Today · 16:30",
			photoInitials: "AS",
			about: "Consultant dermatologist focused on early detection of skin lesions and pigmented mole assessment."
		},
		{
			id: "d1-b",
			name: "Dr. Amara Silva",
			specialty: "Dermatology",
			hospital: "Nawaloka Hospital",
			branch: "Colombo 02",
			city: "Colombo",
			distanceKm: 4.1,
			experienceYears: 14,
			rating: 4.9,
			reviews: 412,
			fee: 5e3,
			languages: ["English", "Sinhala"],
			online: true,
			queue: 1,
			nextSlot: "Tomorrow · 10:00",
			photoInitials: "AS",
			about: "Consultant dermatologist focused on early detection of skin lesions and pigmented mole assessment."
		},
		{
			id: "d2",
			name: "Dr. Nuwan Perera",
			specialty: "Oncology",
			hospital: "Metro Cancer Institute",
			branch: "Nugegoda",
			city: "Colombo",
			distanceKm: 6.1,
			experienceYears: 21,
			rating: 4.8,
			reviews: 289,
			fee: 7500,
			languages: [
				"English",
				"Sinhala",
				"Tamil"
			],
			online: false,
			queue: 8,
			nextSlot: "Tomorrow · 09:00",
			photoInitials: "NP",
			about: "Medical oncologist specialising in breast and oral cancer screening pathways."
		},
		{
			id: "d3",
			name: "Dr. Hasini Fernando",
			specialty: "Ophthalmology",
			hospital: "Vision Care Hospital",
			branch: "Kandy",
			city: "Kandy",
			distanceKm: 12.8,
			experienceYears: 9,
			rating: 4.7,
			reviews: 168,
			fee: 3500,
			languages: ["English", "Sinhala"],
			online: true,
			queue: 1,
			nextSlot: "Today · 18:00",
			photoInitials: "HF",
			about: "Eye surgeon treating anterior segment infections and diabetic retinal screening."
		},
		{
			id: "d4",
			name: "Dr. Ravi Kumar",
			specialty: "Dentistry & Oral Medicine",
			hospital: "Lakeside General Hospital",
			branch: "Dehiwala",
			city: "Colombo",
			distanceKm: 4.9,
			experienceYears: 17,
			rating: 4.6,
			reviews: 233,
			fee: 3e3,
			languages: ["English", "Tamil"],
			online: false,
			queue: 5,
			nextSlot: "Fri · 11:15",
			photoInitials: "RK",
			about: "Oral medicine specialist with an interest in persistent ulcers and mucosal lesions."
		},
		{
			id: "d5",
			name: "Dr. Ishara Jayawardena",
			specialty: "General Medicine",
			hospital: "Riverstone Medical Centre",
			branch: "Galle",
			city: "Galle",
			distanceKm: 3.2,
			experienceYears: 11,
			rating: 4.8,
			reviews: 351,
			fee: 2500,
			languages: ["English", "Sinhala"],
			online: true,
			queue: 2,
			nextSlot: "Today · 15:00",
			photoInitials: "IJ",
			about: "Primary care physician coordinating referrals and preventive health reviews."
		},
		{
			id: "d6",
			name: "Dr. Menaka De Alwis",
			specialty: "Gynaecology",
			hospital: "Metro Cancer Institute",
			branch: "Colombo 05",
			city: "Colombo",
			distanceKm: 5.5,
			experienceYears: 16,
			rating: 4.9,
			reviews: 402,
			fee: 5500,
			languages: ["English", "Sinhala"],
			online: true,
			queue: 4,
			nextSlot: "Tomorrow · 10:30",
			photoInitials: "MD",
			about: "Consultant gynaecologist leading the breast and cervical screening clinic."
		},
		{
			id: "d7-psych",
			name: "Dr. Anura Senanayake",
			specialty: "Psychiatry & Mental Health",
			hospital: "Lakeside General Hospital",
			branch: "Colombo 07",
			city: "Colombo",
			distanceKm: 2.1,
			experienceYears: 18,
			rating: 4.9,
			reviews: 489,
			fee: 4500,
			languages: ["English", "Sinhala"],
			online: true,
			queue: 2,
			nextSlot: "Today · 17:00",
			photoInitials: "AS",
			about: "Consultant Psychiatrist specializing in anxiety disorders, clinical depression, CBT therapy, and stress management."
		},
		{
			id: "d8-psych",
			name: "Dr. Diluka Wickramasinghe",
			specialty: "Psychiatry & Mental Health",
			hospital: "Metro Mind Wellness Institute",
			branch: "Colombo 05",
			city: "Colombo",
			distanceKm: 3.8,
			experienceYears: 14,
			rating: 4.8,
			reviews: 310,
			fee: 4e3,
			languages: ["English", "Sinhala"],
			online: true,
			queue: 1,
			nextSlot: "Tomorrow · 10:00",
			photoInitials: "DW",
			about: "Senior Consultant Psychiatrist & Behavioral Therapist focusing on holistic mental wellness and adult psychiatry."
		}
	];
	hospitals = [
		{
			id: "h1",
			name: "Lakeside General Hospital",
			city: "Colombo",
			rating: 4.7,
			reviews: 1840,
			branches: [
				"Colombo 07",
				"Dehiwala",
				"Kelaniya"
			],
			departments: [
				"Dermatology",
				"Oral Medicine",
				"General Medicine",
				"Radiology"
			],
			emergency: true,
			facilities: [
				"24/7 Emergency",
				"Digital Imaging",
				"Pharmacy",
				"Laboratory"
			],
			phone: "+94 11 234 5678"
		},
		{
			id: "h2",
			name: "Metro Cancer Institute",
			city: "Colombo",
			rating: 4.9,
			reviews: 962,
			branches: ["Nugegoda", "Colombo 05"],
			departments: [
				"Oncology",
				"Gynaecology",
				"Pathology",
				"Radiology"
			],
			emergency: true,
			facilities: [
				"PET-CT",
				"Biopsy Unit",
				"Chemotherapy Suite",
				"Counselling"
			],
			phone: "+94 11 765 4321"
		},
		{
			id: "h3",
			name: "Vision Care Hospital",
			city: "Kandy",
			rating: 4.6,
			reviews: 512,
			branches: ["Kandy", "Matale"],
			departments: [
				"Ophthalmology",
				"Optometry",
				"General Medicine"
			],
			emergency: false,
			facilities: [
				"OCT Scanning",
				"Day Surgery",
				"Optical Store"
			],
			phone: "+94 81 220 1122"
		},
		{
			id: "h4",
			name: "Riverstone Medical Centre",
			city: "Galle",
			rating: 4.5,
			reviews: 738,
			branches: ["Galle", "Hikkaduwa"],
			departments: [
				"General Medicine",
				"Cardiology",
				"Dermatology"
			],
			emergency: true,
			facilities: [
				"24/7 Emergency",
				"Laboratory",
				"Physiotherapy"
			],
			phone: "+94 91 224 3344"
		}
	];
	appointments = [
		{
			id: "a1",
			doctor: "Dr. Amara Silva",
			specialty: "Dermatology",
			hospital: "Lakeside General Hospital · Colombo 07",
			date: "12 Aug 2026",
			time: "16:30",
			mode: "In-person",
			status: "Confirmed"
		},
		{
			id: "a2",
			doctor: "Dr. Ishara Jayawardena",
			specialty: "General Medicine",
			hospital: "Telemedicine",
			date: "15 Aug 2026",
			time: "10:00",
			mode: "Telemedicine",
			status: "Pending"
		},
		{
			id: "a3",
			doctor: "Dr. Ravi Kumar",
			specialty: "Oral Medicine",
			hospital: "Lakeside General Hospital · Dehiwala",
			date: "24 Jul 2026",
			time: "11:15",
			mode: "In-person",
			status: "Completed"
		},
		{
			id: "a4",
			doctor: "Dr. Menaka De Alwis",
			specialty: "Gynaecology",
			hospital: "Metro Cancer Institute · Colombo 05",
			date: "02 Jun 2026",
			time: "09:30",
			mode: "In-person",
			status: "Completed"
		}
	];
	reports = [
		{
			id: "r1",
			title: "Full Blood Count",
			type: "Blood",
			date: "28 Jul 2026",
			status: "Analysed",
			flagged: 2,
			summary: "Haemoglobin slightly below reference range; white cell count normal."
		},
		{
			id: "r2",
			title: "Breast Ultrasound",
			type: "MRI",
			date: "14 Jul 2026",
			status: "Analysed",
			flagged: 1,
			summary: "One well-defined lesion noted. Follow-up imaging suggested in 6 months."
		},
		{
			id: "r3",
			title: "Oral Biopsy",
			type: "Biopsy",
			date: "02 Jul 2026",
			status: "Processing",
			flagged: 0,
			summary: "Awaiting histopathology summary."
		}
	];
	timeline = [
		{
			id: "t1",
			date: "28 Jul 2026",
			title: "Blood report analysed",
			detail: "2 values outside reference range · specialist suggestion: General Medicine",
			kind: "report"
		},
		{
			id: "t2",
			date: "24 Jul 2026",
			title: "Consultation completed",
			detail: "Dr. Ravi Kumar · Oral Medicine · Lakeside General Hospital",
			kind: "appointment"
		},
		{
			id: "t3",
			date: "22 Jul 2026",
			title: "Oral image assessment",
			detail: "Low risk indication · review advised if unchanged after 14 days",
			kind: "image"
		},
		{
			id: "t4",
			date: "18 Jul 2026",
			title: "Preventive insight generated",
			detail: "Annual skin screening recommended based on your history",
			kind: "insight"
		},
		{
			id: "t5",
			date: "24 Jun 2026",
			title: "Prescription issued",
			detail: "Topical antifungal · 14 day course",
			kind: "prescription"
		}
	];
	patientProfile = {
		name: "Mahinda Rajapaksha",
		age: 84,
		gender: "Male",
		bloodGroup: "O+",
		city: "Colombo",
		phone: "+94 77 123 4567",
		email: "Mahinda@pohottuwa.com",
		pastDiseases: ["Iron deficiency anaemia (2023)", "Seasonal allergic rhinitis"],
		medications: ["Ferrous sulphate 200mg", "Cetirizine 10mg (as needed)"],
		allergies: ["Penicillin"],
		familyHistory: ["Breast cancer — maternal aunt", "Type 2 diabetes — father"]
	};
	AI_DISCLAIMER = "This is an AI-assisted health assessment and should not replace professional medical advice.";
}));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/createCsrfMiddleware-B2To0gPJ.js
var createMiddleware = (options, __opts) => {
	const resolvedOptions = {
		type: "request",
		...__opts || options
	};
	const setValidator = (validator) => {
		return createMiddleware({}, Object.assign(resolvedOptions, {
			validator,
			inputValidator: validator
		}));
	};
	return {
		options: resolvedOptions,
		middleware: (middleware) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { middleware }));
		},
		validator: setValidator,
		inputValidator: setValidator,
		client: (client) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { client }));
		},
		server: (server) => {
			return createMiddleware({}, Object.assign(resolvedOptions, { server }));
		}
	};
};
var innerCreateCsrfMiddleware = (opts = {}) => {
	return createMiddleware().server(async (ctx) => {
		const csrfCtx = ctx;
		if (opts.filter && !await opts.filter(csrfCtx)) return ctx.next();
		if (await isCsrfRequestAllowed(opts, csrfCtx)) return ctx.next();
		return getFailureResponse(opts, csrfCtx);
	});
};
var createCsrfMiddleware = innerCreateCsrfMiddleware;
async function isCsrfRequestAllowed(opts, ctx) {
	const result = await getCsrfRequestValidationResult(opts, ctx);
	return result === true || result === void 0 && opts.allowRequestsWithoutOriginCheck === true;
}
async function getCsrfRequestValidationResult(opts, ctx) {
	const fetchSite = ctx.request.headers.get("Sec-Fetch-Site");
	if (fetchSite !== null) return matchValue(opts.secFetchSite ?? "same-origin", fetchSite, ctx);
	const origin = ctx.request.headers.get("Origin");
	if (origin !== null) {
		if (opts.origin) return matchValue(opts.origin, origin, ctx);
		return origin === new URL(ctx.request.url).origin;
	}
	const referer = ctx.request.headers.get("Referer");
	if (referer === null || opts.referer === false) return;
	if (typeof opts.referer === "function") return opts.referer(referer, ctx);
	if (opts.origin) {
		const refererOrigin = getOriginFromUrl(referer);
		return refererOrigin !== void 0 && matchValue(opts.origin, refererOrigin, ctx);
	}
	return isRefererSameOrigin(referer, new URL(ctx.request.url).origin);
}
async function matchValue(matcher, value, ctx) {
	if (typeof matcher === "function") return matcher(value, ctx);
	if (Array.isArray(matcher)) return matcher.includes(value);
	return value === matcher;
}
function getOriginFromUrl(url) {
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
function isRefererSameOrigin(referer, requestOrigin) {
	if (referer === requestOrigin) return true;
	if (!referer.startsWith(requestOrigin)) return false;
	if (referer.length === requestOrigin.length) return true;
	const code = referer.charCodeAt(requestOrigin.length);
	return code === 47 || code === 63 || code === 35;
}
async function getFailureResponse(opts, ctx) {
	if (typeof opts.failureResponse === "function") return opts.failureResponse(ctx);
	return opts.failureResponse?.clone() ?? new Response("Forbidden", { status: 403 });
}
//#endregion
export { SPECIALTIES as a, doctors as c, mock_exports as d, patientProfile as f, AI_DISCLAIMER as i, hospitals as l, timeline as m, createCsrfMiddleware as n, __exportAll as o, reports as p, createMiddleware as r, __toCommonJS as s, server_exports as t, init_mock as u };
