
// Mock Supabase client for integration

interface MockData {
  [key: string]: any;
}

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({}),
    signUp: async () => ({ data: { user: null, session: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: null })
  },
  from: (table: string) => {
    // Mock data based on table name - to be used in response
    const mockDataMap: Record<string, MockData[]> = {
      'course_progress': [
        { 
          id: 'mock-id',
          completed_content_ids: ['content-1', 'content-2'],
          overall_progress: 50,
          completed_at: new Date().toISOString(),
        }
      ],
      'profiles': [
        {
          id: 'mock-id',
          full_name: 'Mock User',
          bio: 'Mock bio',
          avatar_url: 'https://example.com/avatar.png'
        }
      ],
      'user_enrollments': [
        {
          id: 'mock-id',
          progress_percentage: 50
        }
      ],
      'mentorship_requests': [
        {
          id: 'mock-id',
          mentor_id: 'mentor-id',
          requester_id: 'requester-id',
          focus_areas: ['area1', 'area2'],
          goals: ['goal1', 'goal2']
        }
      ],
      'challenge_attempts': [
        {
          id: 'mock-id'
        }
      ],
      'user_activity_logs': [
        {
          id: 'activity-1',
          activity_type: 'page_view',
          created_at: new Date().toISOString(),
          user_id: 'user-1',
          metadata: { path: '/dashboard' }
        },
        {
          id: 'activity-2',
          activity_type: 'skill_learned',
          created_at: new Date().toISOString(),
          user_id: 'user-1',
          metadata: { skill_name: 'Carbon Analysis' }
        }
      ],
      'blockchain_credentials': [
        {
          id: 'cred-1',
          user_id: 'user-1',
          skill_id: 'skill-1',
          issued_at: new Date().toISOString(),
          expires_at: null,
          is_verified: true,
          credential_type: 'solana',
          credential_hash: 'hash123',
          transaction_id: 'tx123',
          metadata: { verification_method: 'challenge' },
          skills: { name: 'Carbon Footprint Analysis' }
        }
      ],
      'arcade_challenges': [
        {
          id: 'challenge-1',
          title: 'Challenge Title',
          description: 'Challenge Description',
          type: 'quiz',
          difficulty_level: 'beginner',
          points: 100,
          time_limit: 300,
          instructions: 'Challenge Instructions',
          validation_rules: {}
        }
      ],
      'mentors': [
        {
          id: 'mentor-1',
          expertise: ['Green Energy', 'Sustainability'],
          profiles: { full_name: 'Expert Mentor', avatar_url: '/avatar.png' }
        }
      ],
      'career_recommendations': [
        {
          id: 'rec-1',
          user_id: 'user-1',
          type: 'skill_gap',
          recommendation: 'Learn sustainable energy practices',
          relevance_score: 0.85,
          status: 'pending',
          created_at: new Date().toISOString(),
          skills: ['Solar Energy', 'Sustainability']
        }
      ]
    };

    const defaultMockData = [
      { id: 'mock-id', name: 'Mock Item' }
    ];

    const mockTableData = mockDataMap[table] || defaultMockData;
    
    // Helper function to ensure data is always returned as an array
    const ensureArray = (data: any) => Array.isArray(data) ? data : [data];
    
    // Helper function to create mock query response
    const createMockResponse = (data: any) => ({
      data,
      error: null,
      // Add common methods to the response object
      single: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
      maybeSingle: () => ({ data: Array.isArray(data) ? data[0] : data, error: null }),
    });

    const response = {
      data: [...mockTableData],
      error: null,
      // Chain methods
      select: (columns?: string) => {
        return {
          ...response,
          data: [...mockTableData],
          error: null,
          order: (column: string, options?: { ascending?: boolean }) => ({
            ...response,
            data: [...mockTableData],
            error: null,
            limit: (count: number) => ({
              ...response,
              data: [...mockTableData].slice(0, count),
              error: null
            }),
            filter: (column: string, operator: string, value: any) => ({
              ...response,
              data: [...mockTableData],
              error: null
            }),
            eq: (column: string, value: any) => ({
              ...response,
              data: [...mockTableData],
              error: null
            }),
            single: () => ({
              data: mockTableData[0] || {},
              error: null
            }),
            maybeSingle: () => ({
              data: mockTableData[0] || {},
              error: null
            }),
            match: (query: any) => ({
              ...response,
              data: [...mockTableData],
              error: null
            }),
            gte: (column: string, value: any) => ({
              ...response,
              data: [...mockTableData],
              error: null
            }),
            count: () => ({
              data: mockTableData.length,
              error: null
            })
          }),
          filter: (column: string, operator: string, value: any) => ({
            ...response,
            data: [...mockTableData],
            error: null,
            eq: (column: string, value: any) => ({
              ...response,
              data: [...mockTableData],
              error: null,
              limit: (count: number) => ({
                ...response,
                data: [...mockTableData].slice(0, count),
                error: null
              })
            }),
            order: (column: string, options?: { ascending?: boolean }) => ({
              ...response,
              data: [...mockTableData],
              error: null,
              limit: (count: number) => ({
                ...response,
                data: [...mockTableData].slice(0, count),
                error: null
              })
            }),
            single: () => ({
              data: mockTableData[0] || {},
              error: null
            }),
            maybeSingle: () => ({
              data: mockTableData[0] || {},
              error: null
            })
          }),
          match: (query: any) => ({
            ...response,
            data: [...mockTableData],
            error: null,
            single: () => ({
              data: mockTableData[0] || {},
              error: null
            }),
            maybeSingle: () => ({
              data: mockTableData[0] || {},
              error: null
            })
          }),
          gte: (column: string, value: any) => ({
            ...response,
            data: [...mockTableData],
            error: null,
            single: () => ({
              data: mockTableData[0] || {},
              error: null
            }),
            maybeSingle: () => ({
              data: mockTableData[0] || {},
              error: null
            })
          }),
          single: () => ({
            data: mockTableData[0] || {},
            error: null
          }),
          maybeSingle: () => ({
            data: mockTableData[0] || {},
            error: null
          }),
          count: () => ({
            data: mockTableData.length,
            error: null
          }),
          limit: (count: number) => ({
            ...response,
            data: [...mockTableData].slice(0, count),
            error: null
          }),
          eq: (column: string, value: any) => ({
            ...response,
            data: [...mockTableData],
            error: null,
            order: (column: string, options?: { ascending?: boolean }) => ({
              ...response,
              data: [...mockTableData],
              error: null,
              limit: (count: number) => ({
                ...response,
                data: [...mockTableData].slice(0, count),
                error: null
              })
            }),
            filter: (column: string, operator: string, value: any) => ({
              ...response,
              data: [...mockTableData],
              error: null
            }),
            single: () => ({
              data: mockTableData[0] || {},
              error: null
            }),
            maybeSingle: () => ({
              data: mockTableData[0] || {},
              error: null
            }),
            match: (query: any) => ({
              ...response,
              data: [...mockTableData],
              error: null
            }),
            gte: (column: string, value: any) => ({
              ...response,
              data: [...mockTableData],
              error: null
            }),
            count: () => ({
              data: mockTableData.length,
              error: null
            }),
            limit: (count: number) => ({
              ...response,
              data: [...mockTableData].slice(0, count),
              error: null
            })
          }),
          or: (query: string) => ({
            ...response,
            data: [...mockTableData],
            error: null
          })
        };
      },
      insert: (data: any) => ({ 
        select: () => ({
          data: mockTableData[0] || {},
          error: null,
          single: () => ({
            data: mockTableData[0] || {},
            error: null
          })
        }),
        single: () => ({
          data: mockTableData[0] || {},
          error: null
        }),
        error: null,
        data: mockTableData[0] || {}
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            data: mockTableData[0] || {},
            error: null,
            single: () => ({
              data: mockTableData[0] || {},
              error: null
            })
          }),
          data: mockTableData[0] || {},
          error: null,
          single: () => ({
            data: mockTableData[0] || {},
            error: null
          })
        }),
        match: (query: any) => ({
          data: mockTableData[0] || {},
          error: null,
          single: () => ({
            data: mockTableData[0] || {},
            error: null
          })
        }),
        select: () => ({
          data: mockTableData[0] || {},
          error: null,
          single: () => ({
            data: mockTableData[0] || {},
            error: null
          })
        }),
        error: null,
        data: mockTableData[0] || {},
        single: () => ({
          data: mockTableData[0] || {},
          error: null
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          data: [],
          error: null
        }),
        match: (query: any) => ({
          data: [],
          error: null
        })
      }),
      eq: (column: string, value: any) => ({
        ...response,
        data: [...mockTableData],
        error: null,
        order: (column: string, options?: { ascending?: boolean }) => ({
          ...response,
          data: [...mockTableData],
          error: null,
          limit: (count: number) => ({
            ...response,
            data: [...mockTableData].slice(0, count),
            error: null
          }),
          filter: (column: string, operator: string, value: any) => ({
            ...response,
            data: [...mockTableData],
            error: null
          }),
          single: () => ({
            data: mockTableData[0] || {},
            error: null
          })
        }),
        filter: (column: string, operator: string, value: any) => ({
          ...response,
          data: [...mockTableData],
          error: null
        }),
        single: () => ({
          data: mockTableData[0] || {},
          error: null
        }),
        maybeSingle: () => ({
          data: mockTableData[0] || {},
          error: null
        }),
        match: (query: any) => ({
          ...response,
          data: [...mockTableData],
          error: null
        }),
        gte: (column: string, value: any) => ({
          ...response,
          data: [...mockTableData],
          error: null
        }),
        count: () => ({
          data: mockTableData.length,
          error: null
        }),
        limit: (count: number) => ({
          ...response,
          data: [...mockTableData].slice(0, count),
          error: null
        }),
        select: () => ({
          data: [...mockTableData],
          error: null,
          single: () => ({
            data: mockTableData[0] || {},
            error: null
          }),
          maybeSingle: () => ({
            data: mockTableData[0] || {},
            error: null
          })
        })
      }),
      or: (query: string) => ({
        ...response,
        data: [...mockTableData],
        error: null
      }),
      limit: (count: number) => ({
        ...response,
        data: [...mockTableData].slice(0, count),
        error: null
      })
    };
    
    return response;
  },
  functions: {
    invoke: async (name: string, options?: any) => ({ 
      data: { 
        generated_text: "This is mock text generated by the API.",
        audio: "base64encodedaudio", // Added audio property
        // Include common API response fields
        id: "mock-id",
        title: "Mock Title",
        description: "Mock Description", 
        type: "mock-type",
        difficulty_level: "beginner",
        validation_rules: {},
        instructions: "Mock Instructions",
        points: 100,
        time_limit: 30,
        full_name: "Mock User",
        bio: "Mock bio",
        avatar_url: "https://example.com/avatar.png",
        last_content_id: "mock-content-id"
      },
      error: null 
    })
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: any) => ({ data: { path }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: `https://example.com/${path}` } })
    })
  },
  removeChannel: (channel: any) => {},
  channel: (name: string) => ({
    on: () => ({ subscribe: () => ({ subscription: { unsubscribe: () => {} } }) })
  })
};
