import config from "@stanlemon/webdev/webpack.config.js";

config.output.filename = "[name].[hash].js";
//config.optimization.moduleIds = "hashed";
config.module.rules = config.module.rules.filter(
  (rule) => !rule.type || rule.type !== "asset/resource"
);

export default config;
