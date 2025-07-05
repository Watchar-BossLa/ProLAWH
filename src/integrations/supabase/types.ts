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
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_actions: {
        Row: {
          action_data: Json
          action_type: string
          agent_id: string | null
          confidence_score: number
          created_at: string
          effectiveness_score: number | null
          id: string
          reasoning: Json
          status: string
          updated_at: string
          urgency_level: number
          user_feedback: Json | null
          user_id: string | null
        }
        Insert: {
          action_data: Json
          action_type: string
          agent_id?: string | null
          confidence_score: number
          created_at?: string
          effectiveness_score?: number | null
          id?: string
          reasoning: Json
          status?: string
          updated_at?: string
          urgency_level: number
          user_feedback?: Json | null
          user_id?: string | null
        }
        Update: {
          action_data?: Json
          action_type?: string
          agent_id?: string | null
          confidence_score?: number
          created_at?: string
          effectiveness_score?: number | null
          id?: string
          reasoning?: Json
          status?: string
          updated_at?: string
          urgency_level?: number
          user_feedback?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_actions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_learning_events: {
        Row: {
          agent_id: string | null
          confidence_after: number
          confidence_before: number
          created_at: string
          event_type: string
          id: string
          input_data: Json
          learning_delta: Json
          output_data: Json
          validation_score: number | null
        }
        Insert: {
          agent_id?: string | null
          confidence_after: number
          confidence_before: number
          created_at?: string
          event_type: string
          id?: string
          input_data: Json
          learning_delta: Json
          output_data: Json
          validation_score?: number | null
        }
        Update: {
          agent_id?: string | null
          confidence_after?: number
          confidence_before?: number
          created_at?: string
          event_type?: string
          id?: string
          input_data?: Json
          learning_delta?: Json
          output_data?: Json
          validation_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_learning_events_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "ai_agents"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          agent_type: string
          autonomy_level: number
          conversation_context: Json
          created_at: string
          goal_hierarchy: Json
          id: string
          is_active: boolean
          knowledge_state: Json
          learning_parameters: Json
          personality_profile: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_type: string
          autonomy_level?: number
          conversation_context?: Json
          created_at?: string
          goal_hierarchy: Json
          id?: string
          is_active?: boolean
          knowledge_state: Json
          learning_parameters: Json
          personality_profile: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_type?: string
          autonomy_level?: number
          conversation_context?: Json
          created_at?: string
          goal_hierarchy?: Json
          id?: string
          is_active?: boolean
          knowledge_state?: Json
          learning_parameters?: Json
          personality_profile?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      application_logs: {
        Row: {
          action: string | null
          component: string | null
          created_at: string
          id: string
          ip_address: string | null
          level: string
          message: string
          metadata: Json | null
          request_id: string | null
          session_id: string | null
          stack_trace: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          component?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          level: string
          message: string
          metadata?: Json | null
          request_id?: string | null
          session_id?: string | null
          stack_trace?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          component?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          level?: string
          message?: string
          metadata?: Json | null
          request_id?: string | null
          session_id?: string | null
          stack_trace?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      application_metrics: {
        Row: {
          created_at: string
          id: string
          name: string
          tags: Json | null
          timestamp: string
          unit: string
          user_id: string | null
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          tags?: Json | null
          timestamp?: string
          unit: string
          user_id?: string | null
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          tags?: Json | null
          timestamp?: string
          unit?: string
          user_id?: string | null
          value?: number
        }
        Relationships: []
      }
      arcade_challenges: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string
          id: string
          instructions: string
          points: number
          time_limit: number
          title: string
          type: string
          updated_at: string
          validation_rules: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level: string
          id?: string
          instructions: string
          points?: number
          time_limit: number
          title: string
          type: string
          updated_at?: string
          validation_rules?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string
          id?: string
          instructions?: string
          points?: number
          time_limit?: number
          title?: string
          type?: string
          updated_at?: string
          validation_rules?: Json
        }
        Relationships: []
      }
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
            referencedRelation: "green_skill_index"
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
            referencedRelation: "green_skill_index"
            referencedColumns: ["id"]
          },
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
      carbon_footprint_data: {
        Row: {
          activities: Json
          category_breakdown: Json
          created_at: string
          id: string
          total_impact: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activities: Json
          category_breakdown: Json
          created_at?: string
          id?: string
          total_impact: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activities?: Json
          category_breakdown?: Json
          created_at?: string
          id?: string
          total_impact?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      career_recommendations: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          recommendation: string
          relevance_score: number | null
          resources: Json | null
          skills: string[] | null
          status: string | null
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          recommendation: string
          relevance_score?: number | null
          resources?: Json | null
          skills?: string[] | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          recommendation?: string
          relevance_score?: number | null
          resources?: Json | null
          skills?: string[] | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      challenge_attempts: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          id: string
          points_earned: number | null
          started_at: string
          status: string
          submission_data: Json | null
          time_taken: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          points_earned?: number | null
          started_at?: string
          status: string
          submission_data?: Json | null
          time_taken?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          points_earned?: number | null
          started_at?: string
          status?: string
          submission_data?: Json | null
          time_taken?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_attempts_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "arcade_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          connection_id: string
          content: string
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          message_type: string | null
          reactions: Json | null
          reply_to_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          connection_id: string
          content: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          reactions?: Json | null
          reply_to_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          connection_id?: string
          content?: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          reactions?: Json | null
          reply_to_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      chat_participants: {
        Row: {
          chat_id: string
          id: string | null
          is_muted: boolean | null
          joined_at: string
          last_read_at: string | null
          role: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          id?: string | null
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          id?: string | null
          is_muted?: boolean | null
          joined_at?: string
          last_read_at?: string | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_private: boolean | null
          max_members: number | null
          name: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          max_members?: number | null
          name?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          max_members?: number | null
          name?: string | null
          type?: string | null
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
      companies: {
        Row: {
          co2_score: number | null
          created_at: string
          description: string | null
          id: string
          industry: string
          name: string
          sustainability_initiatives: Json | null
          updated_at: string
          website: string | null
        }
        Insert: {
          co2_score?: number | null
          created_at?: string
          description?: string | null
          id?: string
          industry: string
          name: string
          sustainability_initiatives?: Json | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          co2_score?: number | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string
          name?: string
          sustainability_initiatives?: Json | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
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
      environmental_achievements: {
        Row: {
          badge_image_url: string | null
          created_at: string
          description: string
          icon_name: string
          id: string
          name: string
          requirement_type: string
          requirement_value: Json
        }
        Insert: {
          badge_image_url?: string | null
          created_at?: string
          description: string
          icon_name: string
          id?: string
          name: string
          requirement_type: string
          requirement_value: Json
        }
        Update: {
          badge_image_url?: string | null
          created_at?: string
          description?: string
          icon_name?: string
          id?: string
          name?: string
          requirement_type?: string
          requirement_value?: Json
        }
        Relationships: []
      }
      green_skills: {
        Row: {
          category: string
          co2_reduction_potential: number | null
          created_at: string
          description: string | null
          id: string
          market_growth_rate: number | null
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          co2_reduction_potential?: number | null
          created_at?: string
          description?: string | null
          id?: string
          market_growth_rate?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          co2_reduction_potential?: number | null
          created_at?: string
          description?: string | null
          id?: string
          market_growth_rate?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
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
      mentorship_progress: {
        Row: {
          completed: boolean | null
          date: string
          id: string
          mentorship_id: string
          milestone: string
          notes: string | null
        }
        Insert: {
          completed?: boolean | null
          date?: string
          id?: string
          mentorship_id: string
          milestone: string
          notes?: string | null
        }
        Update: {
          completed?: boolean | null
          date?: string
          id?: string
          mentorship_id?: string
          milestone?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_progress_mentorship_id_fkey"
            columns: ["mentorship_id"]
            isOneToOne: false
            referencedRelation: "mentorship_requests"
            referencedColumns: ["id"]
          },
        ]
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
      mentorship_requests: {
        Row: {
          created_at: string
          expected_duration: string | null
          focus_areas: string[] | null
          goals: string[] | null
          id: string
          industry: string
          mentor_id: string
          message: string
          requester_id: string
          status: string
        }
        Insert: {
          created_at?: string
          expected_duration?: string | null
          focus_areas?: string[] | null
          goals?: string[] | null
          id?: string
          industry: string
          mentor_id: string
          message: string
          requester_id: string
          status: string
        }
        Update: {
          created_at?: string
          expected_duration?: string | null
          focus_areas?: string[] | null
          goals?: string[] | null
          id?: string
          industry?: string
          mentor_id?: string
          message?: string
          requester_id?: string
          status?: string
        }
        Relationships: []
      }
      mentorship_resources: {
        Row: {
          added_at: string
          added_by: string
          completed: boolean | null
          description: string | null
          id: string
          mentorship_id: string
          title: string
          type: string
          url: string | null
        }
        Insert: {
          added_at?: string
          added_by: string
          completed?: boolean | null
          description?: string | null
          id?: string
          mentorship_id: string
          title: string
          type: string
          url?: string | null
        }
        Update: {
          added_at?: string
          added_by?: string
          completed?: boolean | null
          description?: string | null
          id?: string
          mentorship_id?: string
          title?: string
          type?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_resources_mentorship_id_fkey"
            columns: ["mentorship_id"]
            isOneToOne: false
            referencedRelation: "mentorship_requests"
            referencedColumns: ["id"]
          },
        ]
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
      message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reaction: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reaction: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          content: string | null
          created_at: string
          edited_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string | null
          id: string
          message_type: string | null
          reply_to_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          chat_id: string
          content?: string | null
          created_at?: string
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          reply_to_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          chat_id?: string
          content?: string | null
          created_at?: string
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
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
      network_messages: {
        Row: {
          attachment_data: Json | null
          content: string
          created_at: string
          id: string
          reactions: Json | null
          read: boolean
          receiver_id: string
          sender_id: string
          timestamp: string
        }
        Insert: {
          attachment_data?: Json | null
          content: string
          created_at?: string
          id?: string
          reactions?: Json | null
          read?: boolean
          receiver_id: string
          sender_id: string
          timestamp?: string
        }
        Update: {
          attachment_data?: Json | null
          content?: string
          created_at?: string
          id?: string
          reactions?: Json | null
          read?: boolean
          receiver_id?: string
          sender_id?: string
          timestamp?: string
        }
        Relationships: []
      }
      onboarding_progress: {
        Row: {
          completed_at: string | null
          completed_steps: Json
          created_at: string
          current_step: string
          id: string
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: Json
          created_at?: string
          current_step: string
          id?: string
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: Json
          created_at?: string
          current_step?: string
          id?: string
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_records: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          payment_date: string
          payment_method: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          payment_date?: string
          payment_method: string
          status: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          payment_date?: string
          payment_method?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
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
            referencedRelation: "green_skill_index"
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
      quantum_matches: {
        Row: {
          classical_score: number
          created_at: string
          entanglement_factors: Json
          id: string
          measurement_confidence: number
          probability_amplitude: number
          quantum_score: number
          superposition_state: Json
          target_id: string
          target_type: string
          user_id: string | null
        }
        Insert: {
          classical_score: number
          created_at?: string
          entanglement_factors: Json
          id?: string
          measurement_confidence: number
          probability_amplitude: number
          quantum_score: number
          superposition_state: Json
          target_id: string
          target_type: string
          user_id?: string | null
        }
        Update: {
          classical_score?: number
          created_at?: string
          entanglement_factors?: Json
          id?: string
          measurement_confidence?: number
          probability_amplitude?: number
          quantum_score?: number
          superposition_state?: Json
          target_id?: string
          target_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      quantum_skill_vectors: {
        Row: {
          coherence_score: number
          created_at: string
          entanglement_weights: Json
          id: string
          interference_patterns: Json
          quantum_state: Json
          skill_id: string | null
          updated_at: string
        }
        Insert: {
          coherence_score: number
          created_at?: string
          entanglement_weights: Json
          id?: string
          interference_patterns: Json
          quantum_state: Json
          skill_id?: string | null
          updated_at?: string
        }
        Update: {
          coherence_score?: number
          created_at?: string
          entanglement_weights?: Json
          id?: string
          interference_patterns?: Json
          quantum_state?: Json
          skill_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quantum_skill_vectors_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "green_skill_index"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quantum_skill_vectors_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
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
      read_receipts: {
        Row: {
          id: string
          message_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          message_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          message_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sdg_impact_data: {
        Row: {
          contribution_details: Json | null
          created_at: string
          id: string
          impact_score: number
          sdg_number: number
          updated_at: string
          user_id: string
        }
        Insert: {
          contribution_details?: Json | null
          created_at?: string
          id?: string
          impact_score: number
          sdg_number: number
          updated_at?: string
          user_id: string
        }
        Update: {
          contribution_details?: Json | null
          created_at?: string
          id?: string
          impact_score?: number
          sdg_number?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          risk_level: string
          session_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          risk_level: string
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          risk_level?: string
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      skill_badges: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          points: number
          requirements: Json
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          points?: number
          requirements?: Json
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          points?: number
          requirements?: Json
          updated_at?: string
        }
        Relationships: []
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
            referencedRelation: "green_skill_index"
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
      skill_entanglements: {
        Row: {
          correlation_matrix: Json
          created_at: string
          entanglement_strength: number
          entanglement_type: string
          id: string
          measurement_history: Json
          skill_a_id: string | null
          skill_b_id: string | null
          updated_at: string
        }
        Insert: {
          correlation_matrix: Json
          created_at?: string
          entanglement_strength: number
          entanglement_type: string
          id?: string
          measurement_history?: Json
          skill_a_id?: string | null
          skill_b_id?: string | null
          updated_at?: string
        }
        Update: {
          correlation_matrix?: Json
          created_at?: string
          entanglement_strength?: number
          entanglement_type?: string
          id?: string
          measurement_history?: Json
          skill_a_id?: string | null
          skill_b_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_entanglements_skill_a_id_fkey"
            columns: ["skill_a_id"]
            isOneToOne: false
            referencedRelation: "green_skill_index"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_entanglements_skill_a_id_fkey"
            columns: ["skill_a_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_entanglements_skill_b_id_fkey"
            columns: ["skill_b_id"]
            isOneToOne: false
            referencedRelation: "green_skill_index"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_entanglements_skill_b_id_fkey"
            columns: ["skill_b_id"]
            isOneToOne: false
            referencedRelation: "skills"
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
          polygon_contract_address: string | null
          polygon_tx_hash: string | null
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
          polygon_contract_address?: string | null
          polygon_tx_hash?: string | null
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
          polygon_contract_address?: string | null
          polygon_tx_hash?: string | null
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
            referencedRelation: "green_skill_index"
            referencedColumns: ["id"]
          },
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
          is_green_skill: boolean | null
          name: string
          sustainability_score: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_green_skill?: boolean | null
          name: string
          sustainability_score?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_green_skill?: boolean | null
          name?: string
          sustainability_score?: number | null
        }
        Relationships: []
      }
      staking_contracts: {
        Row: {
          active: boolean | null
          contract_address: string
          created_at: string
          id: string
          network: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          contract_address: string
          created_at?: string
          id?: string
          network: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          contract_address?: string
          created_at?: string
          id?: string
          network?: string
          updated_at?: string
        }
        Relationships: []
      }
      study_bee_auth_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      study_bee_integrations: {
        Row: {
          auth_token: string
          connected_at: string
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          auth_token: string
          connected_at?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          auth_token?: string
          connected_at?: string
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_bee_progress: {
        Row: {
          achievements: string[]
          created_at: string
          current_streak: number
          id: string
          longest_streak: number
          performance_metrics: Json
          sessions_this_week: number
          subjects_studied: string[]
          total_study_time: number
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: string[]
          created_at?: string
          current_streak?: number
          id?: string
          longest_streak?: number
          performance_metrics?: Json
          sessions_this_week?: number
          subjects_studied?: string[]
          total_study_time?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: string[]
          created_at?: string
          current_streak?: number
          id?: string
          longest_streak?: number
          performance_metrics?: Json
          sessions_this_week?: number
          subjects_studied?: string[]
          total_study_time?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_bee_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_minutes: number
          id: string
          metadata: Json
          notes_count: number
          progress_percentage: number
          quiz_score: number | null
          session_id: string
          session_type: string
          started_at: string
          subject: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_minutes: number
          id?: string
          metadata?: Json
          notes_count?: number
          progress_percentage?: number
          quiz_score?: number | null
          session_id: string
          session_type: string
          started_at: string
          subject: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          metadata?: Json
          notes_count?: number
          progress_percentage?: number
          quiz_score?: number | null
          session_id?: string
          session_type?: string
          started_at?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_value: number
          time_period: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_value: number
          time_period: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: number
          time_period?: string
          updated_at?: string
        }
        Relationships: []
      }
      typing_indicators: {
        Row: {
          chat_id: string
          is_typing: boolean | null
          last_activity: string
          user_id: string
        }
        Insert: {
          chat_id: string
          is_typing?: boolean | null
          last_activity?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          is_typing?: boolean | null
          last_activity?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "environmental_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
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
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          evidence: Json | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          earned_at?: string
          evidence?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          earned_at?: string
          evidence?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "skill_badges"
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
      user_green_skills: {
        Row: {
          created_at: string
          green_skill_id: string
          id: string
          proficiency_level: number
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          green_skill_id: string
          id?: string
          proficiency_level: number
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          green_skill_id?: string
          id?: string
          proficiency_level?: number
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_green_skills_green_skill_id_fkey"
            columns: ["green_skill_id"]
            isOneToOne: false
            referencedRelation: "green_skills"
            referencedColumns: ["id"]
          },
        ]
      }
      user_implementation_plans: {
        Row: {
          created_at: string
          description: string | null
          id: string
          recommendation_id: string | null
          status: string
          steps: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          recommendation_id?: string | null
          status: string
          steps?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          recommendation_id?: string | null
          status?: string
          steps?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_implementation_plans_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "career_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_presence: {
        Row: {
          created_at: string
          id: string
          last_active: string
          status: string
          typing_to: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_active?: string
          status?: string
          typing_to?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_active?: string
          status?: string
          typing_to?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser: string
          created_at: string
          device_id: string
          device_name: string
          device_type: string
          expires_at: string
          id: string
          ip_address: string
          is_current: boolean
          last_activity: string
          location: string | null
          user_id: string
        }
        Insert: {
          browser: string
          created_at?: string
          device_id: string
          device_name: string
          device_type: string
          expires_at: string
          id?: string
          ip_address: string
          is_current?: boolean
          last_activity?: string
          location?: string | null
          user_id: string
        }
        Update: {
          browser?: string
          created_at?: string
          device_id?: string
          device_name?: string
          device_type?: string
          expires_at?: string
          id?: string
          ip_address?: string
          is_current?: boolean
          last_activity?: string
          location?: string | null
          user_id?: string
        }
        Relationships: []
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
            referencedRelation: "green_skill_index"
            referencedColumns: ["id"]
          },
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
          polygon_contract_address: string | null
          polygon_tx_hash: string | null
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
            referencedRelation: "green_skill_index"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "skill_stakes_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      green_skill_index: {
        Row: {
          avg_proficiency: number | null
          category: string | null
          id: string | null
          is_green_skill: boolean | null
          name: string | null
          sustainability_score: number | null
          user_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      clean_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      clean_old_application_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_active_staking_contracts: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          contract_address: string
          network: string
        }[]
      }
      get_user_role: {
        Args: { check_user_id: string }
        Returns: string
      }
      has_admin_role: {
        Args: { user_id: string; required_role: string }
        Returns: boolean
      }
      has_user_role: {
        Args: { check_user_id: string; check_role: string }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      connection_status: "pending" | "accepted" | "declined"
      stake_status: "active" | "completed" | "withdrawn"
      user_role: "admin" | "mentor" | "learner" | "employer"
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
      user_role: ["admin", "mentor", "learner", "employer"],
    },
  },
} as const
