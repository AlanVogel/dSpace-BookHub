// webpack.config.js
const Dotenv = require('dotenv-webpack');

module.exports = (env) => {
  return {
    plugins: [
      new Dotenv({
        path: `../.env.${env.REACT_APP_BACKEND_URL}`,
      })
    ]
  };
};