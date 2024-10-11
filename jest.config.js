import config from "@stanlemon/webdev/jest.config.js";

export default {
  ...config,
  // Something weird is going on that causes the default jest.setup.js to not be imported as a module.
  // So, for now we skip using that.
  setupFilesAfterEnv: [],
};
