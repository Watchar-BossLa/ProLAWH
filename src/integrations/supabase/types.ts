export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assessment_skills: {
        Row: {
          assessment_id: string
          id: string
          skill_id: string
          weight: number
        }
        Insert: {
          assessment_id: string
          id?: string
          skill_id: string
          weight?: number
        }
        Update: {
          assessment_id?: string
          id?: string
          skill_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_skills_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          difficulty_level: string
          duration: string
          id: string
          question_count: number
          title: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          difficulty_level: string
          duration: string
          id?: string
          question_count: number
          title: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string
          duration?: string
          id?: string
          question_count?: number
          title?: string
        }
        Relationships: []
      }
      blockchain_credentials: {
        Row: {
          credential_hash: string
          credential_type: string
          expires_at: string | null
          id: string
          is_verified: boolean | null
          issued_at: string
          metadata: Json | null
          skill_id: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          credential_hash: string
          credential_type?: string
          expires_at?: string | null
          id?: string
          is_verified?: boolean | null
          issued_at?: string
          metadata?: Json | null
          skill_id: string
          transaction_id: string
          user_id: string
        }
        Update: {
          credential_hash?: string
          credential_type?: string
          expires_at?: string | null
          id?: string
          is_verified?: boolean | null
          issued_at?: string
          metadata?: Json | null
          skill_id?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_credentials_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blockchain_credentials_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_entity_documents: {
        Row: {
          description: string | null
          entity_id: string
          file_type: string
          id: string
          name: string
          size: number
          type: string
          uploaded_at: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          description?: string | null
          entity_id: string
          file_type: string
          id?: string
          name: string
          size: number
          type: string
          uploaded_at?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          description?: string | null
          entity_id?: string
          file_type?: string
          id?: string
          name?: string
          size?: number
          type?: string
          uploaded_at?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      business_incorporation_templates: {
        Row: {
          created_at: string
          description: string | null
          document_type: string
          id: string
          jurisdiction: string
          name: string
          template_content: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type: string
          id?: string
          jurisdiction: string
          name: string
          template_content: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: string
          id?: string
          jurisdiction?: string
          name?: string
          template_content?: string
          updated_at?: string
        }
        Relationships: []
      }
      collaborative_projects: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          duration: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          name: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborative_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          cover_image: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          role: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          role: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_templates: {
        Row: {
          content_type: string
          created_at: string
          description: string | null
          id: string
          name: string
          template_content: string
          updated_at: string
        }
        Insert: {
          content_type: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          template_content: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          template_content?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_contents: {
        Row: {
          content: string
          content_type: string
          course_id: string
          created_at: string
          description: string | null
          id: string
          order: number
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          content_type: string
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          content_type?: string
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_contents_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed_at: string | null
          completed_content_ids: string[]
          completed_quiz_ids: string[]
          course_id: string
          created_at: string
          id: string
          last_accessed_at: string
          overall_progress: number
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_content_ids?: string[]
          completed_quiz_ids?: string[]
          course_id: string
          created_at?: string
          id?: string
          last_accessed_at?: string
          overall_progress?: number
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_content_ids?: string[]
          completed_quiz_ids?: string[]
          course_id?: string
          created_at?: string
          id?: string
          last_accessed_at?: string
          overall_progress?: number
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          cover_image: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string
          estimated_duration: string | null
          id: string
          is_published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level: string
          estimated_duration?: string | null
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string
          estimated_duration?: string | null
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      incorporation_status: {
        Row: {
          current_milestone_index: number
          entity_id: string
          id: string
          last_updated: string
          milestones: Json
        }
        Insert: {
          current_milestone_index?: number
          entity_id: string
          id?: string
          last_updated?: string
          milestones: Json
        }
        Update: {
          current_milestone_index?: number
          entity_id?: string
          id?: string
          last_updated?: string
          milestones?: Json
        }
        Relationships: [
          {
            foreignKeyName: "incorporation_status_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "project_business_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_path_courses: {
        Row: {
          course_id: string
          id: string
          learning_path_id: string
          sequence_order: number
        }
        Insert: {
          course_id: string
          id?: string
          learning_path_id: string
          sequence_order: number
        }
        Update: {
          course_id?: string
          id?: string
          learning_path_id?: string
          sequence_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_path_courses_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_path_progress: {
        Row: {
          completed_at: string | null
          completed_course_ids: string[]
          created_at: string
          current_course_id: string | null
          id: string
          last_accessed_at: string
          learning_path_id: string
          overall_progress: number
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_course_ids?: string[]
          created_at?: string
          current_course_id?: string | null
          id?: string
          last_accessed_at?: string
          learning_path_id: string
          overall_progress?: number
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_course_ids?: string[]
          created_at?: string
          current_course_id?: string | null
          id?: string
          last_accessed_at?: string
          learning_path_id?: string
          overall_progress?: number
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_path_progress_current_course_id_fkey"
            columns: ["current_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_path_progress_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_path_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          cover_image: string | null
          created_at: string
          created_by: string | null
          description: string | null
          estimated_duration: string | null
          id: string
          is_published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          estimated_duration?: string | null
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_paths_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          availability: string | null
          bio: string | null
          created_at: string
          expertise: string[]
          id: string
          is_accepting_mentees: boolean | null
          max_mentees: number | null
          updated_at: string
          years_of_experience: number | null
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          created_at?: string
          expertise?: string[]
          id: string
          is_accepting_mentees?: boolean | null
          max_mentees?: number | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Update: {
          availability?: string | null
          bio?: string | null
          created_at?: string
          expertise?: string[]
          id?: string
          is_accepting_mentees?: boolean | null
          max_mentees?: number | null
          updated_at?: string
          years_of_experience?: number | null
        }
        Relationships: []
      }
      mentorship_relationships: {
        Row: {
          created_at: string
          end_date: string | null
          feedback: string | null
          focus_areas: string[] | null
          goals: string | null
          id: string
          meeting_frequency: string | null
          mentee_id: string
          mentor_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          feedback?: string | null
          focus_areas?: string[] | null
          goals?: string | null
          id?: string
          meeting_frequency?: string | null
          mentee_id: string
          mentor_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          feedback?: string | null
          focus_areas?: string[] | null
          goals?: string | null
          id?: string
          meeting_frequency?: string | null
          mentee_id?: string
          mentor_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          mentee_feedback: string | null
          mentee_rating: number | null
          mentor_feedback: string | null
          mentor_rating: number | null
          notes: string | null
          relationship_id: string
          scheduled_for: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          mentee_feedback?: string | null
          mentee_rating?: number | null
          mentor_feedback?: string | null
          mentor_rating?: number | null
          notes?: string | null
          relationship_id: string
          scheduled_for: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          mentee_feedback?: string | null
          mentee_rating?: number | null
          mentor_feedback?: string | null
          mentor_rating?: number | null
          notes?: string | null
          relationship_id?: string
          scheduled_for?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "mentorship_relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      network_connections: {
        Row: {
          connected_user_id: string
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          connected_user_id: string
          created_at?: string
          id?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          connected_user_id?: string
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_connections_connected_user_id_fkey"
            columns: ["connected_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          location?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      project_applications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          project_id: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          project_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_applications_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_business_entities: {
        Row: {
          authorized_representatives: Json | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          document_urls: Json | null
          entity_name: string
          entity_type: string
          id: string
          incorporation_date: string | null
          jurisdiction: string
          project_id: string
          registered_address: string | null
          registration_number: string | null
          registration_status: string
          tax_id: string | null
          updated_at: string
        }
        Insert: {
          authorized_representatives?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          document_urls?: Json | null
          entity_name: string
          entity_type: string
          id?: string
          incorporation_date?: string | null
          jurisdiction: string
          project_id: string
          registered_address?: string | null
          registration_number?: string | null
          registration_status?: string
          tax_id?: string | null
          updated_at?: string
        }
        Update: {
          authorized_representatives?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          document_urls?: Json | null
          entity_name?: string
          entity_type?: string
          id?: string
          incorporation_date?: string | null
          jurisdiction?: string
          project_id?: string
          registered_address?: string | null
          registration_number?: string | null
          registration_status?: string
          tax_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_business_entities_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_members: {
        Row: {
          created_at: string
          id: string
          joined_at: string | null
          project_id: string
          role: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          joined_at?: string | null
          project_id: string
          role: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          joined_at?: string | null
          project_id?: string
          role?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "collaborative_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_skills: {
        Row: {
          id: string
          project_id: string
          skill_id: string
        }
        Insert: {
          id?: string
          project_id: string
          skill_id: string
        }
        Update: {
          id?: string
          project_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_skills_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "collaborative_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          assignee_id: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          project_id: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          project_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          client_info: Json | null
          compensation: string | null
          compensation_type: string | null
          created_at: string | null
          created_by: string | null
          deadline: string | null
          description: string | null
          duration: string | null
          id: string
          progress_percentage: number | null
          skills_needed: string[] | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          client_info?: Json | null
          compensation?: string | null
          compensation_type?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          progress_percentage?: number | null
          skills_needed?: string[] | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          client_info?: Json | null
          compensation?: string | null
          compensation_type?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          progress_percentage?: number | null
          skills_needed?: string[] | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string
          id: string
          quiz_id: string
          score: number
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          quiz_id: string
          score: number
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          quiz_id?: string
          score?: number
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_options: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          option_text: string
          question_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text: string
          question_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          option_text?: string
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string | null
          created_at: string
          explanation: string | null
          id: string
          order: number
          points: number
          question_text: string
          question_type: string
          quiz_id: string
          updated_at: string
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          order?: number
          points?: number
          question_text: string
          question_type: string
          quiz_id: string
          updated_at?: string
        }
        Update: {
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          order?: number
          points?: number
          question_text?: string
          question_type?: string
          quiz_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          content_id: string | null
          course_id: string
          created_at: string
          description: string | null
          id: string
          passing_score: number
          time_limit: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content_id?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          passing_score: number
          time_limit?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content_id?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          passing_score?: number
          time_limit?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "course_contents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_endorsements: {
        Row: {
          comment: string | null
          created_at: string
          endorser_id: string
          id: string
          skill_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          endorser_id: string
          id?: string
          skill_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          endorser_id?: string
          id?: string
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_endorsements_endorser_id_fkey"
            columns: ["endorser_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_endorsements_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_endorsements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_stakes: {
        Row: {
          amount_usdc: number
          created_at: string
          ends_at: string | null
          id: string
          skill_id: string
          started_at: string
          status: Database["public"]["Enums"]["stake_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_usdc: number
          created_at?: string
          ends_at?: string | null
          id?: string
          skill_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["stake_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_usdc?: number
          created_at?: string
          ends_at?: string | null
          id?: string
          skill_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["stake_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_stakes_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_verifications: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          user_skill_id: string
          verification_evidence: string | null
          verification_score: number | null
          verification_source: string
          verification_type: string
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          user_skill_id: string
          verification_evidence?: string | null
          verification_score?: number | null
          verification_source: string
          verification_type: string
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          user_skill_id?: string
          verification_evidence?: string | null
          verification_score?: number | null
          verification_source?: string
          verification_type?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_verifications_user_skill_id_fkey"
            columns: ["user_skill_id"]
            isOneToOne: false
            referencedRelation: "user_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_verifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_assessment_results: {
        Row: {
          assessment_id: string
          completed_at: string
          created_at: string
          id: string
          score: number
          time_taken: number | null
          user_id: string
        }
        Insert: {
          assessment_id: string
          completed_at?: string
          created_at?: string
          id?: string
          score: number
          time_taken?: number | null
          user_id: string
        }
        Update: {
          assessment_id?: string
          completed_at?: string
          created_at?: string
          id?: string
          score?: number
          time_taken?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_assessment_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          created_at: string
          id: string
          recipient_id: string
          requester_id: string
          status: Database["public"]["Enums"]["connection_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipient_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          recipient_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["connection_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_connections_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          created_at: string
          id: string
          learning_path_id: string | null
          progress_percentage: number
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          learning_path_id?: string | null
          progress_percentage?: number
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string
          id?: string
          learning_path_id?: string | null
          progress_percentage?: number
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_enrollments_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean | null
          last_assessed_date: string | null
          proficiency_level: number
          skill_id: string
          updated_at: string
          user_id: string
          verification_date: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          last_assessed_date?: string | null
          proficiency_level: number
          skill_id: string
          updated_at?: string
          user_id: string
          verification_date?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean | null
          last_assessed_date?: string | null
          proficiency_level?: number
          skill_id?: string
          updated_at?: string
          user_id?: string
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_stakes: {
        Row: {
          amount_usdc: number | null
          created_at: string | null
          ends_at: string | null
          id: string | null
          skill_category: string | null
          skill_id: string | null
          skill_name: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["stake_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skill_stakes_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      connection_status: "pending" | "accepted" | "declined"
      stake_status: "active" | "completed" | "withdrawn"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      connection_status: ["pending", "accepted", "declined"],
      stake_status: ["active", "completed", "withdrawn"],
    },
  },
} as const
