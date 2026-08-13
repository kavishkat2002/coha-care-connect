import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { t as adminCreateAccount } from "./auth.service-cQpuFi04.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.mjs";
import { K as LoaderCircle, _ as Stethoscope, it as Ellipsis, k as Plus, q as Link, u as UserPlus, w as Search } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuPortal, c as DropdownMenuSubContent, l as DropdownMenuSubTrigger, n as DropdownMenuContent, r as DropdownMenuItem, s as DropdownMenuSub, t as DropdownMenu, u as DropdownMenuTrigger } from "./dropdown-menu-ixSL0whH.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { c as doctors, d as mock_exports, s as __toCommonJS, u as init_mock } from "./server-DlLVIWDa.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { t as doctorService } from "./doctor.service-B1G2HOCZ.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hospital.doctors-DhwpamPr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
init_mock();
function HospitalDoctors() {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [roster, setRoster] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function loadRoster() {
			const data = await doctorService.getAllDoctors();
			setRoster(data.length > 0 ? data : doctors);
			setIsLoading(false);
		}
		loadRoster();
	}, []);
	const [branchesData] = (0, import_react.useState)(() => {
		const saved = localStorage.getItem("mock_hospital_branches_data");
		if (saved) try {
			return JSON.parse(saved);
		} catch (e) {
			return [];
		}
		return (init_mock(), __toCommonJS(mock_exports)).hospitals[0].branches.map((b) => ({
			name: b,
			capacity: 100
		}));
	});
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [doctorId, setDoctorId] = (0, import_react.useState)("");
	const [isLinking, setIsLinking] = (0, import_react.useState)(false);
	const [isCreating, setIsCreating] = (0, import_react.useState)(false);
	const [filterBranch, setFilterBranch] = (0, import_react.useState)("all");
	const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	const [filterDate, setFilterDate] = (0, import_react.useState)(today);
	const filteredDoctors = roster.filter((doc) => {
		const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesBranch = filterBranch === "all" || doc.branch === filterBranch;
		return matchesSearch && matchesBranch;
	});
	const handleLinkDoctor = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const linkId = formData.get("linkId");
		const linkName = formData.get("linkName");
		const linkSpecialty = formData.get("linkSpecialty");
		if (!linkId.trim()) {
			toast.error("Please enter a Doctor ID");
			return;
		}
		setIsLinking(true);
		setTimeout(async () => {
			const initials = (linkName || "Doctor").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
			const newDoctor = {
				id: linkId,
				name: linkName,
				specialty: linkSpecialty,
				hospital: "Lakeside General Hospital",
				branch: branchesData[0]?.name || "Main Branch",
				rating: 0,
				reviews: 0,
				fee: 2e3,
				about: "Transferred physician.",
				languages: ["English"],
				photoInitials: initials,
				online: false,
				city: "Colombo",
				distanceKm: 0,
				experienceYears: 5,
				queue: 0,
				nextSlot: "Available"
			};
			await doctorService.saveDoctor(newDoctor);
			setRoster([newDoctor, ...roster]);
			setIsAddOpen(false);
			setIsLinking(false);
			toast.success("Doctor successfully linked to your hospital roster!");
		}, 1500);
	};
	const handleCreateDoctor = async (e) => {
		e.preventDefault();
		setIsCreating(true);
		const formData = new FormData(e.currentTarget);
		const name = formData.get("name");
		const email = formData.get("email");
		const password = formData.get("password");
		const specialty = formData.get("specialty");
		try {
			await adminCreateAccount(email, password, "doctor", name);
			const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
			const newDoctor = {
				id: `DOC-${Math.floor(Math.random() * 9e4) + 1e4}`,
				name,
				specialty,
				hospital: "Lakeside General Hospital",
				branch: branchesData[0]?.name || "Main Branch",
				rating: 0,
				reviews: 0,
				fee: 2500,
				about: "Newly provisioned physician.",
				languages: ["English"],
				photoInitials: initials,
				online: false,
				city: "Colombo",
				distanceKm: 0,
				experienceYears: 5,
				queue: 0,
				nextSlot: "Available"
			};
			await doctorService.saveDoctor(newDoctor);
			setRoster([newDoctor, ...roster]);
			setIsAddOpen(false);
			toast.success(`Account created for ${name} and added to roster.`);
		} catch (error) {
			toast.error(error.message || "Failed to create doctor account");
		} finally {
			setIsCreating(false);
		}
	};
	const handleRemoveDoctor = async (id) => {
		const doc = roster.find((d) => d.id === id);
		if (!doc) return;
		await doctorService.deleteDoctor(id);
		setRoster(roster.filter((d) => d.id !== id));
		toast.success(`${doc.name} was removed from your hospital roster.`);
	};
	const handleReassignBranch = async (id, newBranch) => {
		const updatedDocs = roster.map((d) => d.id === id ? {
			...d,
			branch: newBranch
		} : d);
		setRoster(updatedDocs);
		const doc = updatedDocs.find((d) => d.id === id);
		if (doc) {
			await doctorService.saveDoctor(doc);
			toast.success(`${doc.name} reassigned to ${newBranch}`);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Manage Doctors",
				description: "View and assign medical staff to your branches."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: isAddOpen,
				onOpenChange: setIsAddOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), " Add Doctor"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[475px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add Doctor to Roster" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Link an existing doctor or provision a new account." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "link",
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
								className: "grid w-full grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "link",
									children: "Link Existing"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
									value: "create",
									children: "Create New Account"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "link",
								className: "pt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleLinkDoctor,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4 mb-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: "Enter the Registration ID of a doctor who is already registered on the platform."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "doc-id",
													children: "Doctor Registration ID"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "doc-id",
														name: "linkId",
														placeholder: "e.g. DOC-98421",
														className: "pl-9",
														required: true
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "doc-name",
													children: "Confirm Doctor Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "doc-name",
													name: "linkName",
													placeholder: "e.g. Dr. Sandun Perera",
													required: true
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "doc-spec",
													children: "Doctor Specialty"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "doc-spec",
													name: "linkSpecialty",
													placeholder: "e.g. General Medicine",
													required: true
												})]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: isLinking,
										children: isLinking ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Verifying..."] }) : "Verify & Link Doctor"
									}) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "create",
								className: "pt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleCreateDoctor,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Provision a new Doctor account. They will receive an email to access the platform."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2 col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "new-name",
														children: "Full Name"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "new-name",
														name: "name",
														placeholder: "Dr. Jane Doe",
														required: true
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2 col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "new-email",
														children: "Email Address"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "new-email",
														name: "email",
														type: "email",
														placeholder: "jane.doe@example.com",
														required: true
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "new-password",
														children: "Temporary Password"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "new-password",
														name: "password",
														type: "password",
														placeholder: "••••••••",
														minLength: 6,
														required: true
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "new-specialty",
														children: "Specialty"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "new-specialty",
														name: "specialty",
														placeholder: "Cardiology",
														required: true
													})]
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: isCreating,
										children: isCreating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Provisioning..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-2 size-4" }), "Create Account"] })
									}) })]
								})
							})
						]
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "shadow-soft",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Medical Staff Roster"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "All doctors currently affiliated with your organization." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-3 w-full sm:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full sm:w-64",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Search by name...",
									className: "pl-9",
									value: searchTerm,
									onChange: (e) => setSearchTerm(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: filterBranch,
								onValueChange: setFilterBranch,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full sm:w-48",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Branches" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Branches"
								}), branchesData.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: b.name,
									children: b.name
								}, b.name))] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: filterDate,
								onChange: (e) => setFilterDate(e.target.value),
								className: "w-full sm:w-40"
							})
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Doctor" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden md:table-cell",
						children: "Specialty"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "hidden sm:table-cell",
						children: "Primary Branch"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Action"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredDoctors.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							className: "size-9 hidden sm:flex",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "bg-primary/10 text-primary text-xs",
								children: doc.photoInitials
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-foreground",
							children: doc.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground md:hidden",
							children: doc.specialty
						})] })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "hidden md:table-cell text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "size-3.5" }), doc.specialty]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "hidden sm:table-cell text-muted-foreground",
						children: doc.branch
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: (() => {
						return (doc.availability?.[filterDate] !== void 0 ? doc.availability[filterDate] : doc.online) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
							children: "Available"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "text-muted-foreground",
							children: "Offline"
						});
					})() }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "icon",
								className: "text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Actions"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSub, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubTrigger, { children: "Reassign Branch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent, { children: branchesData.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								onClick: () => handleReassignBranch(doc.id, b.name),
								disabled: doc.branch === b.name,
								children: b.name
							}, b.name)) }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								className: "text-destructive focus:bg-destructive/10 focus:text-destructive",
								onClick: () => handleRemoveDoctor(doc.id),
								children: "Remove from Hospital"
							})]
						})] })
					})
				] }, doc.id)), filteredDoctors.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					colSpan: 5,
					className: "text-center py-12 text-muted-foreground",
					children: [
						"No doctors found matching \"",
						searchTerm,
						"\""
					]
				}) })] })] })
			})]
		})]
	});
}
//#endregion
export { HospitalDoctors as component };
