module.exports = {
  servers: {
    one: {
      // TODO: set host address, username, and authentication method
      host: '157.245.249.73',
      username: 'root',
      // pem: './path/to/pem'
      password: 'o2tdmuT37aY#a'
      // or neither for authenticate from ssh-agent
    }
  },

  app: {
    // TODO: change app name and path
    name: 'bulls-data',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      // TODO: Change to your app's url
      // If you are using ssl, it needs to start with https://
      ROOT_URL: 'https://bulls.visheshk.net',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      image: 'zodern/meteor:root',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  mongo: {
    version: '4.4.12',
    servers: {
      one: {}
    }
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps

  proxy: {
    domains: 'bulls.visheshk.net',

    ssl: {
      // Enable Let's Encrypt
      letsEncryptEmail: 'visheshkay@gmail.com'
    }
  }
};
