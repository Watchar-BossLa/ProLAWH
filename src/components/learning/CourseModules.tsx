
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseContent, CourseModule, EnrollmentStatus } from "@/types/learning";
import { Book, BookOpen, FileText, MessageSquare, Video } from "lucide-react";
import { useState } from "react";

interface CourseModulesProps {
  modules: CourseModule[];
  enrollmentStatus?: EnrollmentStatus;
  onSelectContent: (contentId: string) => void;
}

export function CourseModules({ 
  modules, 
  enrollmentStatus,
  onSelectContent
}: CourseModulesProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id || '']);
  
  const isContentCompleted = (contentId: string) => {
    return enrollmentStatus?.completed_content_ids?.includes(contentId) || false;
  };
  
  const calculateModuleProgress = (moduleContents: CourseContent[]) => {
    if (!enrollmentStatus || !enrollmentStatus.is_enrolled) return 0;
    if (moduleContents.length === 0) return 0;
    
    const completedCount = moduleContents.filter(content => 
      isContentCompleted(content.id)
    ).length;
    
    return Math.round((completedCount / moduleContents.length) * 100);
  };
  
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'video': return <Video size={18} />;
      case 'article': return <FileText size={18} />;
      case 'quiz': return <Book size={18} />;
      case 'discussion': return <MessageSquare size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Course Content</h2>
      
      <Accordion 
        type="multiple" 
        value={expandedModules} 
        onValueChange={setExpandedModules}
        className="w-full border rounded-md"
      >
        {modules.map((module) => (
          <AccordionItem key={module.id} value={module.id} className="border-b last:border-0">
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left gap-2">
                <div>
                  <span className="font-medium">{module.title}</span>
                  {module.description && (
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  )}
                </div>
                
                {enrollmentStatus?.is_enrolled && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {calculateModuleProgress(module.contents)}% complete
                    </span>
                    <Progress 
                      value={calculateModuleProgress(module.contents)} 
                      className="h-2 w-20" 
                    />
                  </div>
                )}
              </div>
            </AccordionTrigger>
            
            <AccordionContent className="px-4 pb-3">
              <ul className="space-y-2">
                {module.contents.map((content) => (
                  <li key={content.id} className="border-b last:border-0 pb-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 text-muted-foreground">
                        {getContentTypeIcon(content.content_type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{content.title}</p>
                            {content.description && (
                              <p className="text-sm text-muted-foreground">{content.description}</p>
                            )}
                          </div>
                          
                          {content.duration && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {content.duration}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {content.is_preview ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onSelectContent(content.id)}
                            >
                              Preview
                            </Button>
                          ) : (
                            <Button 
                              variant={isContentCompleted(content.id) ? "outline" : "default"}
                              size="sm" 
                              onClick={() => onSelectContent(content.id)}
                              disabled={!enrollmentStatus?.is_enrolled}
                            >
                              {isContentCompleted(content.id) ? (
                                <>
                                  <BookOpen size={14} className="mr-1" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <Book size={14} className="mr-1" />
                                  Start
                                </>
                              )}
                            </Button>
                          )}
                          
                          {isContentCompleted(content.id) && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
