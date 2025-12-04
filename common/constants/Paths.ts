
export default {
  Base: '/api', 
  Vehicules: {
    Base: '/vehicules',
    Get: '/',
    GetOne: '/:id',
    Add: '/',
    Update: '/:id',
    Delete: '/:id',
  },
  Auth: {
    Base: '/auth',
    GenerateToken: '/generatetoken',
  },
} as const;
