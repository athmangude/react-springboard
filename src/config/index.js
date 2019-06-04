const env = process.env.NODE_ENV;

const config = {
  local: {
    apiUrl: 'http://localhost/apiv2',
  },
  development: {
    apiUrl: 'http://localhost/apiv2',
  },
  staging: {
    apiUrl: 'http://localhost/apiv2',
  },
  production: {
    apiUrl: 'http://localhost/apiv2',
  }
}

export default config[env];
