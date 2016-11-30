import metasiteRpcClient from './rpc/metasite';

module.exports = context => {
  const config = context.config.load('promote-seo-bo');
  const metasiteRpcClientFactory = context.rpc.clientFactory(config.services.metasite, 'ReadOnlyMetaSiteManager');
  return {
    rpc: {
      metasite: aspects => metasiteRpcClient(metasiteRpcClientFactory)(aspects)
    },
    hostname: `http://${context.env.HOSTNAME}:${context.env.PORT}`,
    basename: context.env.MOUNT_POINT,
    config
  };
};
