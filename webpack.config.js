import config from "@stanlemon/webdev/webpack.config.js";

export default {
  ...config,
  devServer: {
    ...config.devServer,
    client: {
      overlay: false,
    },
  },
};
