module.exports = context => {
  const config = context.config.load('marketing-campaign-creative-mornings');
  return {
    config,
    basename: context.env.MOUNT_POINT
  };
};
