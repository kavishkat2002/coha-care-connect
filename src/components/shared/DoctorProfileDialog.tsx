import { useEffect, useState } from "react";
import { Star, MapPin, Users, Clock, Loader2, MessageSquare, ThumbsUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { patientService } from "@/services/patient.service";
import { getSession } from "@/services/auth.service";
import type { Doctor } from "@/data/mock";

export function DoctorProfileDialog({ 
  doctor, 
  open, 
  onOpenChange 
}: { 
  doctor: Doctor | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && doctor) {
      loadData();
    }
  }, [open, doctor]);

  const loadData = async () => {
    if (!doctor) return;
    setLoading(true);
    try {
      const data = await patientService.getDoctorReviews(doctor.id);
      setReviews(data);

      const user = await getSession();
      if (user) {
        // Assume patient profile ID is same as user ID for now, or just use user ID
        const hasBooking = await patientService.hasPreviousBooking(doctor.id, user.id);
        setCanReview(hasBooking);
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
      const user = await getSession();
      if (!user) return;
      
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
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!doctor) return null;

  // Calculate average rating dynamically
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : doctor.rating;
  const reviewCount = reviews.length > 0 ? reviews.length : doctor.reviews;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-primary/5 p-6 border-b">
          <div className="flex items-start gap-4">
            <Avatar className="size-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                {doctor.photoInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-xl">{doctor.name}</DialogTitle>
              <DialogDescription className="mt-1">
                {doctor.specialty} · {doctor.experienceYears} yrs experience
              </DialogDescription>
              <div className="mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-primary text-primary" />
                  <span className="font-medium text-foreground">{avgRating}</span> ({reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> {doctor.hospital}
                </span>
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dr. {doctor.name.split(" ").pop()} is a highly experienced {doctor.specialty.toLowerCase()} at {doctor.hospital}. 
                They speak {doctor.languages.join(", ")} and are dedicated to providing excellent patient care.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border p-3 text-center">
                <Users className="size-4 mx-auto mb-1 text-primary" />
                <div className="text-sm font-semibold">{doctor.queue}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Queue</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Clock className="size-4 mx-auto mb-1 text-primary" />
                <div className="text-sm font-semibold">{doctor.nextSlot}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Next Slot</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Star className="size-4 mx-auto mb-1 text-primary" />
                <div className="text-sm font-semibold">{doctor.rating}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Rating</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <ThumbsUp className="size-4 mx-auto mb-1 text-primary" />
                <div className="text-sm font-semibold">{doctor.experienceYears}+</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Years Exp</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center justify-between">
                <span>Patient Reviews</span>
                <Badge variant="secondary">{reviews.length}</Badge>
              </h3>

              {loading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  {canReview && (
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3 mb-6">
                      <h4 className="text-sm font-medium">Write a Review</h4>
                      <div className="flex items-center gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`size-5 cursor-pointer transition-colors ${rating >= star ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} 
                            onClick={() => setRating(star)}
                          />
                        ))}
                      </div>
                      <Textarea 
                        placeholder="Share your experience with this doctor..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button 
                          size="sm" 
                          onClick={handleSubmitReview}
                          disabled={!comment.trim() || submitting}
                        >
                          {submitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <MessageSquare className="size-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No reviews yet for this doctor.</p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{review.patient_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`size-3 ${review.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-sm text-foreground/80">{review.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
          <div className="font-semibold">LKR {doctor.fee.toLocaleString()}</div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
