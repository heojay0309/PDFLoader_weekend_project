module.exports = {
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;

    return config;
  },
};
