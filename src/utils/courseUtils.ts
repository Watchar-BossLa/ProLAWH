
import { CourseContent, CourseModule } from "@/types/learning";

// Helper function to organize contents into modules
export function organizeContentIntoModules(contents: CourseContent[]): CourseModule[] {
  const moduleMap: Record<string, CourseModule> = {};
  
  // Group contents by their module_id or create a default module
  contents.forEach((content) => {
    const moduleId = content.module_id || 'default';
    
    if (!moduleMap[moduleId]) {
      moduleMap[moduleId] = {
        id: moduleId,
        title: moduleId === 'default' ? 'Course Content' : `Module ${Object.keys(moduleMap).length + 1}`,
        order: Object.keys(moduleMap).length,
        contents: []
      };
    }
    
    moduleMap[moduleId].contents.push(content);
  });
  
  // Sort modules by order
  return Object.values(moduleMap).sort((a, b) => a.order - b.order);
}
