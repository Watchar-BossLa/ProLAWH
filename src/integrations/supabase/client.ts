
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
          metadata: { path: '/dashboard' }
        }
      ]
    };

    const defaultMockData = [
      { id: 'mock-id', name: 'Mock Item' }
    ];

    const mockTableData = mockDataMap[table] || defaultMockData;

    const response = {
      data: [...mockTableData],
      error: null,
      // Chain methods
      select: (columns?: string) => {
        return {
          ...response,
          order: (column: string, options?: { ascending?: boolean }) => ({
            ...response,
            limit: (count: number) => ({
              ...response
            }),
            filter: (column: string, operator: string, value: any) => ({
              ...response
            }),
            eq: (column: string, value: any) => ({
              ...response
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
              ...response
            }),
            gte: (column: string, value: any) => ({
              ...response
            }),
            count: () => ({
              data: mockTableData.length,
              error: null
            })
          }),
          filter: (column: string, operator: string, value: any) => ({
            ...response,
            eq: (column: string, value: any) => ({
              ...response,
              limit: (count: number) => ({
                ...response
              })
            }),
            order: (column: string, options?: { ascending?: boolean }) => ({
              ...response,
              limit: (count: number) => ({
                ...response
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
            ...response
          }),
          eq: (column: string, value: any) => ({
            ...response,
            order: (column: string, options?: { ascending?: boolean }) => ({
              ...response,
              limit: (count: number) => ({
                ...response
              })
            }),
            filter: (column: string, operator: string, value: any) => ({
              ...response
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
              ...response
            }),
            gte: (column: string, value: any) => ({
              ...response
            }),
            count: () => ({
              data: mockTableData.length,
              error: null
            }),
            limit: (count: number) => ({
              ...response
            })
          }),
          or: (query: string) => ({
            ...response
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
        error: null 
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({
            data: mockTableData[0] || {},
            error: null
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
          error: null
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
        order: (column: string, options?: { ascending?: boolean }) => ({
          ...response,
          limit: (count: number) => ({
            ...response
          })
        }),
        filter: (column: string, operator: string, value: any) => ({
          ...response
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
          ...response
        }),
        gte: (column: string, value: any) => ({
          ...response
        }),
        count: () => ({
          data: mockTableData.length,
          error: null
        }),
        limit: (count: number) => ({
          ...response
        })
      }),
      or: (query: string) => ({
        ...response
      }),
      limit: (count: number) => ({
        ...response
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
