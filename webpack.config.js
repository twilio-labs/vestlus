import config from "@stanlemon/webdev/webpack.config.js";

// Temporary as @twilio-paste/core throws a warning
config.devServer.client = { overlay: false };

export default config;
