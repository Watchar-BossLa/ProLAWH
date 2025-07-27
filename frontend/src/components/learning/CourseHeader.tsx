
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseInstructor } from "@/types/learning";
import { Clock, Book, GraduationCap, Share2, BookmarkPlus } from "lucide-react";

interface CourseHeaderProps {
  title: string;
  description: string;
  coverImage?: string;
  estimatedDuration?: string;
  difficultyLevel: string;
  instructor?: CourseInstructor | null;
  enrollmentProgress?: number;
  isEnrolled: boolean;
  onEnroll: () => void;
  onContinue: (contentId?: string) => void;
  onBookmark: () => void;
  isEnrolling: boolean;
  lastContentId?: string;
}

export function CourseHeader({
  title,
  description,
  coverImage,
  estimatedDuration,
  difficultyLevel,
  instructor,
  enrollmentProgress = 0,
  isEnrolled,
  onEnroll,
  onContinue,
  onBookmark,
  isEnrolling,
  lastContentId
}: CourseHeaderProps) {
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      {coverImage && (
        <div className="w-full rounded-lg overflow-hidden h-60 relative mb-4">
          <img 
            src={coverImage} 
            alt={`${title} cover`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <Badge className={`${getDifficultyColor(difficultyLevel)} text-white`}>
              {difficultyLevel}
            </Badge>
          </div>
        </div>
      )}

      {/* Course Info and Actions */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-3 flex-1">
          <h1 className="text-3xl font-bold">{title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {estimatedDuration && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{estimatedDuration}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <GraduationCap size={16} />
              <span>{difficultyLevel}</span>
            </div>
          </div>

          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-col gap-2">
          {isEnrolled ? (
            <Button 
              onClick={() => onContinue(lastContentId)}
              className="w-full"
            >
              <Book className="mr-2" />
              {enrollmentProgress > 0 ? "Continue Learning" : "Start Learning"}
            </Button>
          ) : (
            <Button 
              onClick={onEnroll}
              disabled={isEnrolling}
              className="w-full"
            >
              <Book className="mr-2" />
              Enroll Now
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBookmark} className="flex-1">
              <BookmarkPlus size={18} className="mr-2" />
              Save
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 size={18} className="mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar (for enrolled users) */}
      {isEnrolled && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Your progress</span>
            <span>{enrollmentProgress}% complete</span>
          </div>
          <Progress value={enrollmentProgress} className="h-2" />
        </div>
      )}

      {/* Instructor Info */}
      {instructor && (
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={instructor.avatar_url} alt={instructor.name} />
            <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{instructor.name}</h3>
            <p className="text-sm text-muted-foreground">{instructor.title}</p>
            <p className="text-sm mt-1">{instructor.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
}
