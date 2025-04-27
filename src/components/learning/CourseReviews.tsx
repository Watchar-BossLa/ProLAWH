
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CourseReview } from "@/types/learning";
import { Star, StarHalf } from "lucide-react";
import { useState } from "react";

interface CourseReviewsProps {
  reviews: CourseReview[];
  averageRating: number;
  isEnrolled: boolean;
  onSubmitReview: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
}

export function CourseReviews({
  reviews,
  averageRating,
  isEnrolled,
  onSubmitReview,
  isSubmitting = false
}: CourseReviewsProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onSubmitReview(rating, comment);
      setRating(0);
      setComment('');
      setShowReviewForm(false);
    }
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };
  
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Reviews</h2>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {renderStars(averageRating)}
          </div>
          <span className="font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">({reviews.length} reviews)</span>
        </div>
      </div>
      
      {isEnrolled && !showReviewForm && (
        <Button 
          variant="outline" 
          onClick={() => setShowReviewForm(true)} 
          className="mb-4"
        >
          Write a Review
        </Button>
      )}
      
      {showReviewForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Your Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        size={24} 
                        className={rating >= star 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                        } 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="review" className="block mb-2 text-sm font-medium">Your Review</label>
                <Textarea
                  id="review"
                  placeholder="Write your review here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={rating === 0 || !comment.trim() || isSubmitting}
                >
                  Submit Review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-4 mb-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.avatar_url} alt={review.username} />
                  <AvatarFallback>{review.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-medium">{review.username}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          No reviews yet. Be the first to review this course!
        </div>
      )}
    </div>
  );
}
