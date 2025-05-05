
// Mock Supabase client for integration

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({})
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        order: () => ({
          data: [],
          error: null
        })
      })
    }),
    insert: () => ({ error: null })
  }),
  functions: {
    invoke: async (name: string, options?: any) => ({ data: {}, error: null })
  },
  removeChannel: (channel: any) => {},
  channel: (name: string) => ({
    on: () => ({ subscribe: () => ({ subscription: { unsubscribe: () => {} } }) })
  })
};
