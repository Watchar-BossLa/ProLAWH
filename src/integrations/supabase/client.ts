
// Mock Supabase client for integration

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({})
  },
  from: (table: string) => ({
    select: (columns?: string) => {
      const response = {
        data: [],
        error: null,
        // Chain methods
        eq: (column: string, value: any) => ({
          ...response,
          data: [], 
          error: null,
          // Additional methods for chaining
          order: (column: string, options?: { ascending?: boolean }) => ({
            data: [],
            error: null,
            limit: (count: number) => ({
              data: [],
              error: null
            }),
            filter: (column: string, operator: string, value: any) => ({
              data: [],
              error: null
            }),
            single: () => ({
              data: {},
              error: null
            }),
            maybeSingle: () => ({
              data: {},
              error: null
            }),
            match: (query: any) => ({
              data: [],
              error: null
            }),
            gte: (column: string, value: any) => ({
              data: [],
              error: null
            }),
            count: () => ({
              data: 0,
              error: null
            })
          }),
          filter: (column: string, operator: string, value: any) => ({
            data: [],
            error: null,
            order: (column: string, options?: { ascending?: boolean }) => ({
              data: [],
              error: null,
              limit: (count: number) => ({
                data: [],
                error: null
              })
            }),
            single: () => ({
              data: {},
              error: null
            }),
            maybeSingle: () => ({
              data: {},
              error: null
            })
          }),
          single: () => ({
            data: {},
            error: null
          }),
          maybeSingle: () => ({
            data: {},
            error: null
          }),
          gte: (column: string, value: any) => ({
            data: [],
            error: null,
            order: (column: string, options?: { ascending?: boolean }) => ({
              data: [],
              error: null,
              limit: (count: number) => ({
                data: [],
                error: null
              })
            })
          }),
          limit: (count: number) => ({
            data: [],
            error: null
          })
        }),
        order: (column: string, options?: { ascending?: boolean }) => ({
          data: [],
          error: null,
          limit: (count: number) => ({
            data: [],
            error: null
          }),
          filter: (column: string, operator: string, value: any) => ({
            data: [],
            error: null
          }),
          eq: (column: string, value: any) => ({
            data: [],
            error: null
          }),
          single: () => ({
            data: {},
            error: null
          }),
          maybeSingle: () => ({
            data: {},
            error: null
          }),
          match: (query: any) => ({
            data: [],
            error: null
          }),
          gte: (column: string, value: any) => ({
            data: [],
            error: null
          }),
          count: () => ({
            data: 0,
            error: null
          })
        }),
        filter: (column: string, operator: string, value: any) => ({
          data: [],
          error: null,
          eq: (column: string, value: any) => ({
            data: [],
            error: null,
            limit: (count: number) => ({
              data: [],
              error: null
            })
          }),
          order: (column: string, options?: { ascending?: boolean }) => ({
            data: [],
            error: null,
            limit: (count: number) => ({
              data: [],
              error: null
            })
          }),
          single: () => ({
            data: {},
            error: null
          }),
          maybeSingle: () => ({
            data: {},
            error: null
          })
        }),
        match: (query: any) => ({
          data: [],
          error: null,
          single: () => ({
            data: {},
            error: null
          }),
          maybeSingle: () => ({
            data: {},
            error: null
          })
        }),
        gte: (column: string, value: any) => ({
          data: [],
          error: null,
          single: () => ({
            data: {},
            error: null
          }),
          maybeSingle: () => ({
            data: {},
            error: null
          })
        }),
        single: () => ({
          data: {},
          error: null
        }),
        maybeSingle: () => ({
          data: {},
          error: null
        }),
        count: () => ({
          data: 0,
          error: null
        }),
        limit: (count: number) => ({
          data: [],
          error: null
        })
      };
      return response;
    },
    insert: (data: any) => ({ 
      select: () => ({
        data: {},
        error: null,
        single: () => ({
          data: {},
          error: null
        })
      }),
      single: () => ({
        data: {},
        error: null
      }),
      error: null 
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          data: {},
          error: null
        }),
        data: {},
        error: null,
        single: () => ({
          data: {},
          error: null
        })
      }),
      match: (query: any) => ({
        data: {},
        error: null
      }),
      select: () => ({
        data: {},
        error: null,
        single: () => ({
          data: {},
          error: null
        })
      }),
      error: null,
      single: () => ({
        data: {},
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
    })
  }),
  functions: {
    invoke: async (name: string, options?: any) => ({ 
      data: { 
        generated_text: "This is mock text generated by the API.",
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
  removeChannel: (channel: any) => {},
  channel: (name: string) => ({
    on: () => ({ subscribe: () => ({ subscription: { unsubscribe: () => {} } }) })
  })
};
