import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { n as getSession } from "./auth.service-cQpuFi04.mjs";
import { n as AvatarFallback, t as Avatar } from "./avatar-CiQwCJNR.mjs";
import { B as MessageSquare, F as Pencil, H as MapPin, K as LoaderCircle, O as QrCode, X as Info, bt as Building2, ct as Clock, ft as CircleCheck, g as ThumbsUp, j as Phone, kt as Activity, m as Trash2, n as X, s as Users, st as CreditCard, v as Star, w as Search } from "../_libs/lucide-react.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PageHeader } from "./PageHeader-CqM8ISGV.mjs";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./card-BfBj_YIE.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as SPECIALTIES, c as doctors, l as hospitals, u as init_mock } from "./server-qE7WcvYQ.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DIo89e4g.mjs";
import { n as Route$7 } from "./router-BNCUifkZ.mjs";
import { t as patientService } from "./patient.service-ClJFNjzy.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as doctorService } from "./doctor.service-B1G2HOCZ.mjs";
import { t as hospitalService } from "./hospital.service-CPNkTzfz.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as DoctorCard } from "./DoctorCard-XUB_iiAL.mjs";
import { t as Separator } from "./separator-B3hsz7IR.mjs";
import { t as format } from "../_libs/date-fns.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/patient.book-CIUqawao.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function HospitalReviewsDialog({ hospital, isOpen, onOpenChange }) {
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [session, setSession] = (0, import_react.useState)(null);
	const [isWriting, setIsWriting] = (0, import_react.useState)(false);
	const [rating, setRating] = (0, import_react.useState)(5);
	const [comment, setComment] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isOpen) loadData();
		else {
			setIsWriting(false);
			setRating(5);
			setComment("");
		}
	}, [isOpen, hospital.id]);
	const loadData = async () => {
		setLoading(true);
		const [fetchedReviews, currentSession] = await Promise.all([hospitalService.getHospitalReviews(hospital.id), getSession()]);
		setReviews(fetchedReviews);
		setSession(currentSession);
		setLoading(false);
	};
	const handleSubmitReview = async () => {
		if (!session) {
			toast.error("Please log in to submit a review");
			return;
		}
		if (comment.trim().length < 5) {
			toast.error("Please write a slightly longer review (min 5 characters)");
			return;
		}
		setIsSubmitting(true);
		const success = await hospitalService.addHospitalReview({
			hospital_id: hospital.id,
			patient_id: session.id,
			patient_name: session.name,
			rating,
			comment: comment.trim()
		});
		setIsSubmitting(false);
		if (success) {
			toast.success("Review submitted successfully!");
			setIsWriting(false);
			setComment("");
			loadData();
		} else toast.error("Failed to submit review. Try again.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isOpen,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-[500px] h-[85vh] sm:h-[600px] flex flex-col p-0 gap-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
				className: "px-6 pt-6 pb-4 border-b",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [hospital.name, " Reviews"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: reviews.length > 0 ? `Read ${reviews.length} patient review${reviews.length === 1 ? "" : "s"} for this hospital.` : "No reviews yet. Be the first to share your experience!" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-hidden flex flex-col",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-primary/50" })
				}) : isWriting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 p-6 flex flex-col gap-6 overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Your Rating"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-2",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRating(star),
									className: "focus:outline-none hover:scale-110 transition-transform",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-8 ${star <= rating ? "fill-yellow-400 text-yellow-500" : "fill-muted text-muted"}` })
								}, star))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Your Experience"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: comment,
								onChange: (e) => setComment(e.target.value),
								placeholder: "Tell us about your experience at this hospital...",
								className: "min-h-[150px] resize-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-3 pt-4 border-t mt-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setIsWriting(false),
								disabled: isSubmitting,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleSubmitReview,
								disabled: isSubmitting,
								children: [isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin mr-2" }) : null, "Submit Review"]
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 space-y-6",
						children: reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center py-10 text-muted-foreground flex flex-col items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-12 text-muted-foreground/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No reviews have been posted yet." })]
						}) : reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pb-6 border-b last:border-0 last:pb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										className: "size-8",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "bg-primary/10 text-primary text-xs font-medium",
											children: review.patient_name.substring(0, 2).toUpperCase()
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-sm",
										children: review.patient_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: format(new Date(review.created_at), "MMM d, yyyy")
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-0.5",
									children: [...Array(5)].map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-500" : "fill-muted text-muted"}` }, i))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-foreground/90 whitespace-pre-wrap",
								children: review.comment
							})]
						}, review.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 border-t bg-muted/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: () => setIsWriting(true),
						disabled: !session,
						children: session ? "Write a Review" : "Log in to write a review"
					})
				})] })
			})]
		})
	});
}
function DoctorProfileDialog({ doctor, open, onOpenChange }) {
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [canReview, setCanReview] = (0, import_react.useState)(false);
	const [rating, setRating] = (0, import_react.useState)(5);
	const [comment, setComment] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
	const [editingReviewId, setEditingReviewId] = (0, import_react.useState)(null);
	const [realNextSlot, setRealNextSlot] = (0, import_react.useState)(null);
	const [realQueue, setRealQueue] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (open && doctor) loadData();
	}, [open, doctor]);
	const loadData = async () => {
		if (!doctor) return;
		setLoading(true);
		try {
			const data = await patientService.getDoctorReviews(doctor.id);
			setReviews(data);
			const user = await getSession();
			if (user) {
				setCurrentUser(user);
				const hasBooking = await patientService.hasPreviousBooking(doctor.id, user.id);
				setCanReview(hasBooking);
			}
			const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			const slots = await patientService.getDoctorAvailability(doctor.id, today);
			const now = /* @__PURE__ */ new Date();
			const currentMinutes = now.getHours() * 60 + now.getMinutes();
			let next = slots.find((s) => {
				const parts = s.split(":").map(Number);
				const h = parts[0] ?? 0;
				const m = parts[1] ?? 0;
				return h * 60 + m > currentMinutes;
			});
			if (!next && slots.length > 0) next = slots[0];
			if (next) {
				setRealNextSlot(next);
				const qCount = await patientService.getSlotQueueCount(doctor.id, today, next);
				setRealQueue(qCount);
			} else {
				setRealNextSlot("None");
				setRealQueue(0);
			}
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	const handleSubmitReview = async () => {
		if (!doctor || !comment.trim()) return;
		setSubmitting(true);
		try {
			const user = currentUser || await getSession();
			if (!user) {
				toast.error("You must be logged in to leave a review.");
				return;
			}
			if (editingReviewId) {
				if (await patientService.updateDoctorReview(editingReviewId, rating, comment.trim())) {
					setReviews(reviews.map((r) => r.id === editingReviewId ? {
						...r,
						rating,
						comment: comment.trim()
					} : r));
					setComment("");
					setRating(5);
					setEditingReviewId(null);
					toast.success("Review updated successfully!");
				} else toast.error("Failed to update review.");
			} else {
				const newReview = await patientService.addDoctorReview({
					doctor_id: doctor.id,
					patient_id: user.id,
					patient_name: user.name || "Anonymous Patient",
					rating,
					comment: comment.trim()
				});
				if (newReview) {
					setReviews([newReview, ...reviews]);
					setComment("");
					setRating(5);
					toast.success("Review submitted successfully!");
				} else toast.error("Failed to submit review.");
			}
		} catch (e) {
			toast.error("An unexpected error occurred.");
		} finally {
			setSubmitting(false);
		}
	};
	const handleDeleteReview = async (reviewId) => {
		if (!confirm("Are you sure you want to delete this review?")) return;
		if (await patientService.deleteDoctorReview(reviewId)) {
			setReviews(reviews.filter((r) => r.id !== reviewId));
			toast.success("Review deleted.");
		} else toast.error("Failed to delete review.");
	};
	const handleEditClick = (review) => {
		setEditingReviewId(review.id);
		setRating(review.rating);
		setComment(review.comment);
	};
	const handleCancelEdit = () => {
		setEditingReviewId(null);
		setRating(5);
		setComment("");
	};
	if (!doctor) return null;
	const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
	const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : doctor.rating;
	const reviewCount = reviews.length > 0 ? reviews.length : doctor.reviews;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-[600px] p-0 overflow-hidden flex flex-col max-h-[85vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-primary/5 p-6 border-b",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							className: "size-16 border-2 border-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "bg-primary/10 text-xl font-semibold text-primary",
								children: doctor.photoInitials
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
									className: "text-xl",
									children: doctor.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
									className: "mt-1",
									children: [
										doctor.specialty,
										" · ",
										doctor.experienceYears,
										" yrs experience"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-primary text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: avgRating
											}),
											" (",
											reviewCount,
											" reviews)"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
											" ",
											doctor.hospital
										]
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold mb-2",
								children: "About"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground leading-relaxed",
								children: [
									"Dr. ",
									doctor.name.split(" ").pop(),
									" is a highly experienced ",
									doctor.specialty.toLowerCase(),
									" at ",
									doctor.hospital,
									". They speak ",
									doctor.languages.join(", "),
									" and are dedicated to providing excellent patient care."
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border p-3 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4 mx-auto mb-1 text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold",
												children: realQueue !== null ? realQueue : doctor.queue
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wider",
												children: "Queue"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border p-3 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 mx-auto mb-1 text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold",
												children: realNextSlot !== null ? realNextSlot === "None" ? "None" : `Today · ${realNextSlot}` : doctor.nextSlot
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wider",
												children: "Next Slot"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border p-3 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 mx-auto mb-1 text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold",
												children: doctor.rating
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wider",
												children: "Rating"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border p-3 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "size-4 mx-auto mb-1 text-primary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm font-semibold",
												children: [doctor.experienceYears, "+"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wider",
												children: "Years Exp"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Patient Reviews" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: reviews.length
									})]
								}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-8 flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [canReview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `bg-muted/50 rounded-lg p-4 space-y-3 mb-6 ${editingReviewId ? "ring-2 ring-primary/50" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between mb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-sm font-medium",
												children: editingReviewId ? "Edit Your Review" : "Write a Review"
											}), editingReviewId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "size-6 text-muted-foreground",
												onClick: handleCancelEdit,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2 mb-2",
											children: [
												1,
												2,
												3,
												4,
												5
											].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
												className: `size-5 cursor-pointer transition-colors ${rating >= star ? "fill-primary text-primary" : "text-muted-foreground/30"}`,
												onClick: () => setRating(star)
											}, star))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											placeholder: "Share your experience with this doctor...",
											value: comment,
											onChange: (e) => setComment(e.target.value),
											className: "resize-none",
											rows: 3
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex justify-end",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												onClick: handleSubmitReview,
												disabled: !comment.trim() || submitting,
												children: [submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin mr-2" }) : null, editingReviewId ? "Update Review" : "Submit Review"]
											})
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center py-6 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-8 mx-auto mb-2 opacity-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm",
											children: "No reviews yet for this doctor."
										})]
									}) : reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-b pb-4 last:border-0 last:pb-0 group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between mb-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-sm",
													children: review.patient_name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground",
														children: new Date(review.created_at).toLocaleDateString()
													}), currentUser && currentUser.id === review.patient_id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleEditClick(review),
															className: "p-1 hover:text-primary hover:bg-muted rounded-sm",
															title: "Edit",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => handleDeleteReview(review.id),
															className: "p-1 hover:text-destructive hover:bg-muted rounded-sm",
															title: "Delete",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3" })
														})]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-0.5 mb-2",
												children: [
													1,
													2,
													3,
													4,
													5
												].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-3 ${review.rating >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}` }, star))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-foreground/80",
												children: review.comment
											})
										]
									}, review.id))
								})] })]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t bg-muted/20 flex justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold",
						children: ["LKR ", doctor.fee.toLocaleString()]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => onOpenChange(false),
						children: "Close"
					})]
				})
			]
		})
	});
}
init_mock();
function BookPage() {
	const { doctorId } = Route$7.useSearch();
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const [showSuggestions, setShowSuggestions] = (0, import_react.useState)(false);
	const [date, setDate] = (0, import_react.useState)("");
	const [specialty, setSpecialty] = (0, import_react.useState)("all");
	const [hospital, setHospital] = (0, import_react.useState)("");
	const [showHospitalSuggestions, setShowHospitalSuggestions] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [slot, setSlot] = (0, import_react.useState)(null);
	const [confirmed, setConfirmed] = (0, import_react.useState)(false);
	const [showReviewsDialog, setShowReviewsDialog] = (0, import_react.useState)(false);
	const [viewingDoctor, setViewingDoctor] = (0, import_react.useState)(null);
	const [selectedDate, setSelectedDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0] || "");
	const [availableSlots, setAvailableSlots] = (0, import_react.useState)([]);
	const [slotQueues, setSlotQueues] = (0, import_react.useState)({});
	const [assignedQueue, setAssignedQueue] = (0, import_react.useState)(null);
	const [isBooking, setIsBooking] = (0, import_react.useState)(false);
	const [patientDetails, setPatientDetails] = (0, import_react.useState)({
		name: "",
		email: "",
		mobile: "",
		nic: "",
		city: ""
	});
	const [rosterDoctors, setRosterDoctors] = (0, import_react.useState)([]);
	const [dbHospitals, setDbHospitals] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		async function loadData() {
			const [docs, hosps] = await Promise.all([doctorService.getAllDoctors(), hospitalService.getAllHospitals()]);
			if (docs && docs.length > 0) setRosterDoctors(docs);
			if (hosps && hosps.length > 0) setDbHospitals(hosps);
			if (doctorId) {
				const autoSelectedDoctor = (docs && docs.length > 0 ? docs : doctors).find((d) => d.id === doctorId);
				if (autoSelectedDoctor) {
					setSelected(autoSelectedDoctor);
					setQuery(autoSelectedDoctor.name);
					setSpecialty(autoSelectedDoctor.specialty);
				}
			}
		}
		loadData();
	}, [doctorId]);
	(0, import_react.useEffect)(() => {
		async function fetchSlots() {
			if (!selected || !selectedDate) {
				setAvailableSlots([]);
				setSlotQueues({});
				return;
			}
			const slots = await patientService.getDoctorAvailability(selected.id, selectedDate);
			setAvailableSlots(slots);
			const queues = {};
			for (const s of slots) queues[s] = await patientService.getSlotQueueCount(selected.id, selectedDate, s);
			setSlotQueues(queues);
		}
		fetchSlots();
	}, [selected, selectedDate]);
	const selectedHospitalInfo = (0, import_react.useMemo)(() => {
		const hQ = hospital.trim().toLowerCase();
		if (!hQ) return null;
		const dbMatch = dbHospitals.find((x) => x.name.toLowerCase() === hQ);
		if (dbMatch) return dbMatch;
		return hospitals.find((x) => x.name.toLowerCase() === hQ);
	}, [hospital, dbHospitals]);
	const branches = (0, import_react.useMemo)(() => {
		const hQ = hospital.trim().toLowerCase();
		const h = dbHospitals.find((x) => x.name.toLowerCase() === hQ);
		if (h && h.branches && h.branches.length > 0) return h.branches;
		const docBranches = (rosterDoctors.length > 0 ? rosterDoctors : doctors).filter((d) => (d.hospital || "").toLowerCase() === hQ).map((d) => d.branch).filter(Boolean);
		return Array.from(new Set(docBranches));
	}, [
		hospital,
		dbHospitals,
		rosterDoctors,
		doctors
	]);
	const hospitalSuggestions = (0, import_react.useMemo)(() => {
		if (!hospital.trim()) return [];
		const q = hospital.trim().toLowerCase();
		const dbHospitalNames = dbHospitals.map((h) => h.name);
		const docHospitalNames = (rosterDoctors.length > 0 ? rosterDoctors : doctors).map((d) => d.hospital || "");
		return Array.from(/* @__PURE__ */ new Set([...dbHospitalNames, ...docHospitalNames])).filter(Boolean).filter((name) => name.toLowerCase().includes(q));
	}, [
		hospital,
		dbHospitals,
		rosterDoctors,
		doctors
	]);
	const suggestions = (0, import_react.useMemo)(() => {
		if (!query.trim()) return [];
		const allDoctors = rosterDoctors.length > 0 ? rosterDoctors : doctors;
		return Array.from(new Set(allDoctors.map((d) => d.name || ""))).filter((name) => name && name.toLowerCase().includes(query.trim().toLowerCase()));
	}, [
		query,
		rosterDoctors,
		doctors
	]);
	const results = (0, import_react.useMemo)(() => {
		if (!query.trim() && !hospital.trim()) return [];
		return (rosterDoctors.length > 0 ? rosterDoctors : doctors).filter((d) => {
			const q = query.trim().toLowerCase();
			const hQ = hospital.trim().toLowerCase();
			return (!q || (d.name || "").toLowerCase().includes(q) || (d.hospital || "").toLowerCase().includes(q) || (d.specialty || "").toLowerCase().includes(q) || (d.city || "").toLowerCase().includes(q)) && (specialty === "all" || d.specialty === specialty) && (!hQ || (d.hospital || "").toLowerCase().includes(hQ));
		});
	}, [
		query,
		specialty,
		hospital,
		rosterDoctors,
		doctors
	]);
	if (confirmed && selected) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Booking confirmed",
			description: "Show the QR ticket at reception."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "max-w-xl shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-5 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
							className: "size-6 text-success",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: selected.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								selected.specialty,
								" · ",
								selected.hospital,
								" · ",
								selected.branch
							]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid gap-3 text-sm sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: selectedDate
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: slot
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Reference"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-medium",
								children: [
									"COHA-",
									selected.id.toUpperCase(),
									"-4821"
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Paid"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "font-medium",
								children: ["LKR ", selected.fee.toLocaleString()]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-sm font-semibold mb-2",
										children: "Patient Details"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-y-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Name: "
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: patientDetails.name
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "NIC: "
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: patientDetails.nic
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Mobile: "
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: patientDetails.mobile
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "City: "
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: patientDetails.city
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Email: "
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: patientDetails.email
												})]
											})
										]
									})
								]
							}),
							assignedQueue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2 mt-2 bg-primary/10 p-3 rounded-lg border border-primary/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-primary font-semibold",
									children: "Your Queue Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "font-bold text-2xl text-primary",
									children: ["Patient #", assignedQueue]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 rounded-2xl border border-border bg-muted/40 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, {
							className: "size-16 text-foreground",
							"aria-hidden": "true"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Your QR ticket. Arrive 10 minutes early for registration."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							navigate({ to: "/patient" });
						},
						children: "Back to Home"
					})
				]
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Book an appointment",
				description: "Search by doctor, hospital, specialty or branch, then pick an available slot."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-[#0E3860] dark:text-blue-100",
					children: "Quick Access"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
					children: [
						{
							id: "dl",
							label: "MedMind eCare",
							image: "/brain-care-icon-white-background-brain-care-icon-361728746.webp",
							isNew: false,
							color: "text-purple-500"
						},
						{
							id: "mfa",
							label: "MedDoc ePass",
							image: "/eSubscription.svg",
							isNew: false,
							color: "text-blue-500"
						},
						{
							id: "ayur",
							label: "eAyurveda",
							image: "/ayurvedic-medicine-illustration_1480904-73.avif",
							isNew: true,
							color: "text-green-500"
						},
						{
							id: "prem",
							label: "MedDoc ePremium",
							image: "/Screenshot 2026-08-08 at 01.56.15.png",
							isNew: false,
							color: "text-yellow-500"
						},
						{
							id: "hosp",
							label: "eHospital",
							image: "/images.png",
							isNew: true,
							color: "text-emerald-600"
						},
						{
							id: "homec",
							label: "eHomeCare",
							image: "/images.jpg",
							isNew: true,
							color: "text-blue-400"
						},
						{
							id: "pharm",
							label: "ePharmacy",
							image: "/images-1.png",
							isNew: false,
							color: "text-purple-500"
						},
						{
							id: "diag",
							label: "eDiagnostics",
							image: "/eDiagnosis.svg",
							isNew: false,
							color: "text-red-600"
						},
						{
							id: "visa",
							label: "eNutritionist",
							image: "/eNutritionist.svg",
							isNew: true,
							color: "text-sky-500"
						},
						{
							id: "dental",
							label: "eDental",
							image: "/images-1.jpg",
							isNew: true,
							color: "text-indigo-500"
						},
						{
							id: "skin",
							label: "eSkinCare",
							image: "/images-2.png",
							isNew: true,
							color: "text-amber-500"
						},
						{
							id: "homeo",
							label: "MediFit",
							image: "/healthcare-trackers-wearables-sensors-abstract-concept-illustration_335657-2181.avif",
							isNew: true,
							color: "text-green-600"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => {
							if (item.id === "hosp") navigate({ to: "/patient/telemedicine" });
							else if (item.id === "dl") navigate({ to: "/patient/medmind-ecare" });
							else if (item.id === "mfa") navigate({ to: "/patient/epass" });
						},
						className: "relative p-5 bg-card border border-border shadow-soft rounded-2xl flex flex-col items-center justify-center gap-4 hover:shadow-md transition-shadow cursor-pointer",
						children: [
							item.isNew && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-0 left-0 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-tl-2xl rounded-br-lg",
								children: "New"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "absolute top-3 right-3 size-4 text-muted-foreground/50 hover:text-muted-foreground" }),
							item.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-16 h-16 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.image,
									alt: item.label,
									className: "w-full h-full object-contain"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-4 rounded-full bg-muted/30 ${item.color}`,
								children: item.icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
									className: "size-8",
									strokeWidth: 1.5
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium text-foreground text-center",
								children: item.label
							})
						]
					}, item.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-4 p-5 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "search",
								children: "Doctor Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "search",
										autoComplete: "off",
										value: query,
										onChange: (e) => {
											setQuery(e.target.value);
											setShowSuggestions(true);
										},
										onFocus: () => setShowSuggestions(true),
										onBlur: () => setTimeout(() => setShowSuggestions(false), 200),
										placeholder: "Search doctor name",
										className: "pl-9"
									}),
									showSuggestions && query.trim().length > 0 && suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute z-10 w-full bg-popover text-popover-foreground border border-border shadow-md rounded-md mt-1 max-h-60 overflow-y-auto",
										children: suggestions.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "px-4 py-2 hover:bg-muted cursor-pointer text-sm",
											onClick: () => {
												setQuery(name);
												setShowSuggestions(false);
											},
											children: name
										}, name))
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "specialty",
								children: "Specialization"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: specialty,
								onValueChange: setSpecialty,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "specialty",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All specialties" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All specialties"
								}), SPECIALTIES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s))] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "hospital",
								children: "Hospital"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "hospital",
										autoComplete: "off",
										value: hospital,
										onChange: (e) => {
											setHospital(e.target.value);
											setShowHospitalSuggestions(true);
										},
										onFocus: () => setShowHospitalSuggestions(true),
										onBlur: () => setTimeout(() => setShowHospitalSuggestions(false), 200),
										placeholder: "Search hospital",
										className: "pl-9"
									}),
									showHospitalSuggestions && hospital.trim().length > 0 && hospitalSuggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute z-10 w-full bg-popover text-popover-foreground border border-border shadow-md rounded-md mt-1 max-h-60 overflow-y-auto",
										children: hospitalSuggestions.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "px-4 py-2 hover:bg-muted cursor-pointer text-sm",
											onClick: () => {
												setHospital(name);
												setShowHospitalSuggestions(false);
											},
											children: name
										}, name))
									})
								]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4 lg:col-span-2",
					children: selectedHospitalInfo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "shadow-soft border-primary/20 bg-primary/5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-5 sm:p-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-3 bg-primary/10 rounded-xl text-primary shrink-0 hidden sm:block",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-6" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-4 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold text-lg",
											children: selectedHospitalInfo.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }),
														" ",
														selectedHospitalInfo.city
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => setShowReviewsDialog(true),
													className: "flex items-center gap-1.5 hover:underline decoration-muted-foreground/50 transition-colors",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-yellow-400 text-yellow-500" }),
														selectedHospitalInfo.rating,
														" (",
														selectedHospitalInfo.reviews,
														" reviews)"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-3.5" }),
														" ",
														selectedHospitalInfo.phone
													]
												})
											]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid sm:grid-cols-2 gap-4 text-sm pt-2 border-t border-border/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium flex items-center gap-1.5 mb-2 text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4" }), " Departments"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-1.5",
												children: selectedHospitalInfo.departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "secondary",
													className: "font-normal bg-background/50",
													children: d
												}, d))
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium flex items-center gap-1.5 mb-2 text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-4" }), " Facilities"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex flex-wrap gap-1.5",
												children: selectedHospitalInfo.facilities.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "font-normal bg-background/50 border-border/50",
													children: f
												}, f))
											})] })]
										})]
									})]
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-lg px-1",
								children: "Available Branches"
							}), branches.map((b) => {
								const branchDoctors = results.filter((d) => d.branch === b);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "shadow-soft overflow-hidden border-border/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-muted/50 px-5 py-3 border-b border-border/50 font-medium flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-primary" }),
												" ",
												b,
												" Branch"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											className: "bg-background",
											children: [branchDoctors.length, " Specialists"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-4 space-y-3",
										children: branchDoctors.length > 0 ? branchDoctors.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												setSelected(d);
												setSlot(null);
											},
											"aria-pressed": selected?.id === d.id,
											className: "block w-full rounded-2xl text-left transition-shadow " + (selected?.id === d.id ? "ring-2 ring-primary ring-offset-2" : ""),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorCard, {
												doctor: d,
												onProfileClick: setViewingDoctor
											})
										}, d.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground text-center py-4",
											children: "No specialists match your filters at this branch."
										})
									})]
								}, b);
							})]
						})]
					}) : !query.trim() && !hospital.trim() && specialty === "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft border-dashed",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-12 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-8 text-muted-foreground/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Please enter a doctor name, select a specialization, or search for a hospital to see available specialists." })]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [results.length, " specialists available"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: results.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setSelected(d);
									setSlot(null);
								},
								"aria-pressed": selected?.id === d.id,
								className: "block w-full rounded-2xl text-left transition-shadow " + (selected?.id === d.id ? "ring-2 ring-primary ring-offset-2" : ""),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorCard, {
									doctor: d,
									onProfileClick: setViewingDoctor
								})
							}, d.id))
						}),
						!results.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "shadow-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-8 text-center text-sm text-muted-foreground",
								children: "No specialists match these filters."
							})
						}) : null
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-fit shadow-soft lg:sticky lg:top-24",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Availability & payment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: selected ? `${selected.name} · ${selected.branch}` : "Select a specialist to continue" })] }), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: "Select Date & Time"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: selectedDate,
									onChange: (e) => {
										setSelectedDate(e.target.value);
										setSlot(null);
									},
									min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
									className: "h-8 w-[140px] text-xs"
								})]
							}), availableSlots.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: availableSlots.map((s) => {
									const queue = slotQueues[s] || 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										size: "sm",
										variant: slot === s ? "default" : "outline",
										onClick: () => setSlot(s),
										className: "flex flex-col gap-0.5 h-auto py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-normal opacity-70",
											children: [queue, " in queue"]
										})]
									}, s);
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground py-4 text-center bg-muted/20 rounded-md",
								children: "Loading slots..."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: "Patient Details"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "Patient Name",
										value: patientDetails.name,
										onChange: (e) => setPatientDetails({
											...patientDetails,
											name: e.target.value
										}),
										className: "h-9 text-sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Mobile Number",
											value: patientDetails.mobile,
											onChange: (e) => setPatientDetails({
												...patientDetails,
												mobile: e.target.value
											}),
											className: "h-9 text-sm"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "NIC Number",
											value: patientDetails.nic,
											onChange: (e) => setPatientDetails({
												...patientDetails,
												nic: e.target.value
											}),
											className: "h-9 text-sm"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Email Address",
											type: "email",
											value: patientDetails.email,
											onChange: (e) => setPatientDetails({
												...patientDetails,
												email: e.target.value
											}),
											className: "h-9 text-sm"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Area / City",
											value: patientDetails.city,
											onChange: (e) => setPatientDetails({
												...patientDetails,
												city: e.target.value
											}),
											className: "h-9 text-sm"
										})]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardFooter, {
						className: "flex flex-col gap-4 bg-muted/20 border-t p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full space-y-1.5 text-sm rounded-lg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Consultation fee"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["LKR ", selected.fee.toLocaleString()] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Platform fee"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LKR 250" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-1.5 border-border/50" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["LKR ", (selected.fee + 250).toLocaleString()] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "gap-1.5 w-full justify-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-3.5" }), " Card payment on confirmation"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								size: "lg",
								disabled: !slot || !patientDetails.name || !patientDetails.mobile || !patientDetails.nic || isBooking,
								onClick: async () => {
									setIsBooking(true);
									const session = await getSession();
									const newAppointment = await patientService.bookAppointment({
										patient_id: session ? session.id : null,
										patient_name: patientDetails.name,
										patient_mobile: patientDetails.mobile,
										patient_nic: patientDetails.nic,
										patient_email: patientDetails.email,
										patient_city: patientDetails.city,
										doctor_id: selected.id,
										hospital_id: selectedHospitalInfo?.id || selected.hospital || "",
										date: selectedDate,
										time: slot,
										status: "Confirmed",
										fee: selected.fee
									});
									if (newAppointment) {
										setAssignedQueue(newAppointment.queue_number);
										toast.success(`Digital receipt sent to ${patientDetails.email || "your email"}`);
										setConfirmed(true);
									} else toast.error("Failed to book appointment");
									setIsBooking(false);
								},
								children: isBooking ? "Booking..." : "Pay & confirm"
							})
						]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "space-y-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Choose a specialist from the list to see their available times."
						})
					})]
				})]
			}),
			selectedHospitalInfo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HospitalReviewsDialog, {
				hospital: selectedHospitalInfo,
				isOpen: showReviewsDialog,
				onOpenChange: setShowReviewsDialog
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoctorProfileDialog, {
				doctor: viewingDoctor,
				open: !!viewingDoctor,
				onOpenChange: (open) => !open && setViewingDoctor(null)
			})
		]
	});
}
//#endregion
export { BookPage as component };
