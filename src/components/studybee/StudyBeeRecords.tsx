
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BookOpen, Calendar, Clock } from "lucide-react";

export const StudyBeeRecords: React.FC = () => {
  // Mock data for study records
  const recentNotes = [
    { title: "Algorithms: Quick Sort Implementation", timestamp: "2 days ago", tags: ["Computer Science", "Algorithms"] },
    { title: "Cloud Computing: AWS Services Overview", timestamp: "1 week ago", tags: ["Cloud", "AWS"] },
    { title: "Machine Learning: Neural Networks", timestamp: "2 weeks ago", tags: ["AI", "Machine Learning"] },
    { title: "Data Structures: Binary Trees", timestamp: "3 weeks ago", tags: ["Computer Science", "Data Structures"] }
  ];
  
  const courses = [
    { title: "Advanced Python Programming", progress: 75, lastAccessed: "Yesterday", due: "Next week" },
    { title: "Cloud Architecture Fundamentals", progress: 45, lastAccessed: "3 days ago", due: "2 weeks" },
    { title: "Machine Learning with TensorFlow", progress: 30, lastAccessed: "1 week ago", due: "3 weeks" },
    { title: "Data Structures and Algorithms", progress: 90, lastAccessed: "Today", due: "Tomorrow" }
  ];
  
  const schedule = [
    { title: "Data Structures Quiz", type: "Quiz", date: "Tomorrow, 10:00 AM" },
    { title: "Python Study Group", type: "Group", date: "Wednesday, 3:00 PM" },
    { title: "Cloud Computing Project", type: "Assignment", date: "Friday, 11:59 PM" },
    { title: "Machine Learning Review", type: "Study Session", date: "Saturday, 2:00 PM" }
  ];
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="notes" className="w-full">
        <TabsList>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Recent Notes
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Active Courses
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Upcoming Schedule
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentNotes.map((note, index) => (
                  <li key={index} className="p-3 hover:bg-muted/30 rounded-md border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{note.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {note.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{note.timestamp}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {courses.map((course, index) => (
                  <li key={index} className="p-3 hover:bg-muted/30 rounded-md border">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">{course.title}</p>
                      <Badge variant={course.progress > 80 ? "default" : "secondary"}>
                        {course.progress}% complete
                      </Badge>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Last accessed: {course.lastAccessed}</span>
                      <span className="text-xs text-muted-foreground">Due: {course.due}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {schedule.map((item, index) => (
                  <li key={index} className="p-3 hover:bg-muted/30 rounded-md border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <Badge variant="outline" className="mt-1">
                          {item.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{item.date}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
