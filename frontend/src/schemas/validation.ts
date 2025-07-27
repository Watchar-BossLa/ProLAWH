
import { z } from 'zod';

// User Profile Schemas
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  avatar_url: z.string().url('Invalid avatar URL').optional()
});

// Study Bee Schemas
export const studyGoalSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  target_hours: z.number().min(1, 'Target hours must be at least 1').max(1000),
  deadline: z.string().refine((date) => {
    const targetDate = new Date(date);
    const today = new Date();
    return targetDate > today;
  }, 'Deadline must be in the future'),
  subject: z.string().max(50, 'Subject must be less than 50 characters').optional()
});

// Mentorship Schemas
export const mentorshipRequestSchema = z.object({
  mentor_id: z.string().uuid('Invalid mentor ID'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
  focus_areas: z.array(z.string()).min(1, 'At least one focus area is required'),
  industry: z.string().min(2, 'Industry is required'),
  expected_duration: z.string().optional(),
  goals: z.array(z.string()).optional()
});

// Network Message Schema
export const networkMessageSchema = z.object({
  receiver_id: z.string().uuid('Invalid receiver ID'),
  content: z.string().min(1, 'Message cannot be empty').max(2000),
  attachment_data: z.object({
    file_name: z.string(),
    file_size: z.number(),
    file_type: z.string()
  }).optional()
});

// Skill Schemas
export const skillSchema = z.object({
  name: z.string().min(2, 'Skill name must be at least 2 characters').max(100),
  category: z.string().min(2, 'Category is required'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  is_green_skill: z.boolean().default(false),
  sustainability_score: z.number().min(0).max(100).optional()
});

export const userSkillSchema = z.object({
  skill_id: z.string().uuid('Invalid skill ID'),
  proficiency_level: z.number().min(1, 'Proficiency level must be between 1-5').max(5)
});

// Course Schemas
export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
  estimated_duration: z.string().max(50).optional(),
  cover_image: z.string().url('Invalid cover image URL').optional()
});

// Validation helper functions
export const validateWithSchema = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};
