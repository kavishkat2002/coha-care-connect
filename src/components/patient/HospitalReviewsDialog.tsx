import { useState, useEffect } from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { hospitalService, type HospitalReview } from "@/services/hospital.service";
import { getSession, type Session } from "@/services/auth.service";
import type { Hospital } from "@/data/mock";

interface HospitalReviewsDialogProps {
  hospital: Hospital;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HospitalReviewsDialog({ hospital, isOpen, onOpenChange }: HospitalReviewsDialogProps) {
  const [reviews, setReviews] = useState<HospitalReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  
  // Write Review State
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      setIsWriting(false);
      setRating(5);
      setComment("");
    }
  }, [isOpen, hospital.id]);

  const loadData = async () => {
    setLoading(true);
    const [fetchedReviews, currentSession] = await Promise.all([
      hospitalService.getHospitalReviews(hospital.id),
      getSession()
    ]);
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
      rating: rating,
      comment: comment.trim()
    });
    setIsSubmitting(false);

    if (success) {
      toast.success("Review submitted successfully!");
      setIsWriting(false);
      setComment("");
      loadData();
    } else {
      toast.error("Failed to submit review. Try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[85vh] sm:h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>{hospital.name} Reviews</DialogTitle>
          <DialogDescription>
            {reviews.length > 0 
              ? `Read ${reviews.length} patient review${reviews.length === 1 ? '' : 's'} for this hospital.`
              : "No reviews yet. Be the first to share your experience!"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="size-8 animate-spin text-primary/50" />
            </div>
          ) : isWriting ? (
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">

              
              <div className="space-y-3 flex-1">
                <label className="text-sm font-medium">Your Experience</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about your experience at this hospital..."
                  className="min-h-[150px] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
                <Button variant="outline" onClick={() => setIsWriting(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Submit Review
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-3">
                      <MessageSquare className="size-12 text-muted-foreground/30" />
                      <p>No reviews have been posted yet.</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="space-y-3 pb-6 border-b last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                                {review.patient_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{review.patient_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(new Date(review.created_at), "MMM d, yyyy")}
                              </div>
                            </div>
                          </div>

                        </div>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-muted/20">
                <Button 
                  className="w-full" 
                  onClick={() => setIsWriting(true)}
                  disabled={!session}
                >
                  {session ? "Write a Review" : "Log in to write a review"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
