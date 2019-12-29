const env = process.env.NODE_ENV;

const config = {
  local: {
    api: {
      url: 'http://localhost:4041/api/0.1.0',
    },
    socket: {
      url: 'http://localhost:4041/api/0.1.0',
    },
  },
  development: {
    api: {
      url: 'http://localhost:4041/api/0.1.0'
    },
    socket: {
      url: 'http://localhost:4041/api/0.1.0',
    },
  },
  staging: {
    api: {
      url: 'http://localhost:4041/api/0.1.0',
    },
    socket: {
      url: 'http://localhost:4041/api/0.1.0',
    },
  },
  production: {
    api: {
      url: 'http://localhost:4041/api/0.1.0',
    },
    socket: {
      url: 'http://localhost:4041/api/0.1.0',
    },
  },
};

export default config[env];
