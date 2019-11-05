const env = process.env.NODE_ENV;
// qa-ui - staging
// customer-analytics - development

const config = {
  local: {
    api: {
      // url: 'http://localhost:4041/api/0.1.0', // local development bridge
      // url: 'http://localhost:80/api/0.1.0', // local development bridge
      url: 'https://staging-primary-bridge.msurvey.co/api/0.1.0', // staging primary bridge
      // url: 'https://staging-secondary-bridge.msurvey.co/api/0.1.0', // staging secondary bridge (CA)
      // url: 'https://bridge.msurvey.co/api/0.1.0', // production bridge
    },
    socket: {
      // url: 'http://localhost:4041/api/0.1.0', // local development bridge
      // url: 'http://localhost:80', // local development bridge
      url: 'https://staging-primary-bridge.msurvey.co', // staging primary bridge
      // url: 'https://staging-secondary-bridge.msurvey.co', // staging secondary bridge (CA)
      // url: 'https://bridge.msurvey.co', // production bridge
    },
    metrics: {
      url: 'http://54.203.117.52:8090',
    },
    onPremise: true,
  },
  development: {
    api: {
      // url: 'http://localhost:4041/api/0.1.0', // local development bridge
      // url: 'http://localhost:80/api/0.1.0', // local development bridge
      // url: 'https://staging-primary-bridge.msurvey.co/api/0.1.0', // staging primary bridge
      // url: 'https://staging-secondary-bridge.msurvey.co/api/0.1.0', // staging secondary bridge (CA)
      url: 'https://bridge.msurvey.co/api/0.1.0', // production bridge
      // url: 'http://172.16.21.37:4041/api/0.1.0', // KCB  API URL
    },
    socket: {
      // url: 'http://localhost:4041/api/0.1.0', // local development bridge
      // url: 'http://localhost:80', // local development bridge
      // url: 'https://staging-primary-bridge.msurvey.co', // staging primary bridge
      // url: 'https://staging-secondary-bridge.msurvey.co', // staging secondary bridge (CA)
      url: 'https://bridge.msurvey.co', // production bridge
      // url: 'http://172.16.21.37:4041', // KCB SOCKET URL
    },
    metrics: {
      url: 'http://54.203.117.52:8090',
    },
    onPremise: true,
  },
  staging: {
    api: {
      // url: 'http://localhost:4041/api/0.1.0', // local development bridge
      // url: 'http://localhost:80/api/0.1.0', // local development bridge
      // url: 'https://staging-primary-bridge.msurvey.co/api/0.1.0', // staging primary bridge
      // url: 'https://staging-secondary-bridge.msurvey.co/api/0.1.0', // staging secondary bridge (CA)
      // url: 'https://bridge.msurvey.co/api/0.1.0', // production bridge
      url: 'http://172.16.21.37:4041/api/0.1.0', // KCB QA API URL
      // url: 'http://172.16.21.92:4041/api/0.1.0', // production bridge
    },
    socket: {
      // url: 'http://localhost:4041/api/0.1.0', // local development bridge
      // url: 'http://localhost:80', // local development bridge
      // url: 'https://staging-primary-bridge.msurvey.co', // staging primary bridge
      // url: 'https://staging-secondary-bridge.msurvey.co', // staging secondary bridge (CA)
      // url: 'https://bridge.msurvey.co', // production bridge
      url: 'http://172.16.21.37:4041', // KCB QA SOCKET URL
      // url: 'http://172.16.21.92:4041', // production bridge
    },
    metrics: {
      url: 'http://54.203.117.52:8090',
    },
    onPremise: true,
  },
  production: {
    api: {
      // url: 'http://localhost:4041/api/0.1.0', // local development bridge
      // url: 'http://localhost:80/api/0.1.0', // local development bridge
      // url: 'https://staging-primary-bridge.msurvey.co/api/0.1.0', // staging primary bridge
      // url: 'https://staging-secondary-bridge.msurvey.co/api/0.1.0', // staging secondary bridge (CA)
      url: 'https://bridge.msurvey.co/api/0.1.0', // production bridge
    },
    socket: {
      // url: 'http://localhost:4041/api/0.1.0', // local development bridge
      // url: 'http://localhost:80', // local development bridge
      // url: 'https://staging-bridge.msurvey.co', // staging bridge
      // url: 'https://staging-secondary-bridge.msurvey.co', // staging secondary bridge (CA)
      url: 'https://bridge.msurvey.co', // production bridge
    },
    metrics: {
      url: 'https://bridge.msurvey.co:8090',
    },
    onPremise: false,
  },
};

export default config[env];
// export default config.staging;
