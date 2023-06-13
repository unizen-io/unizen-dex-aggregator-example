import * as React from 'react';

import { injectedConnection } from 'utils/helpers/web3/connectors';

interface Props {
  handleActivate: () => void;
}
const useConnectWallet = (): Props => {
  const handleActivate = React.useCallback(
    async () => {
      const connector = injectedConnection.connector;
      try {
        if (connector.connectEagerly) {
          await connector.connectEagerly();
        } else {
          await connector.activate();
        }
      // eslint-disable-next-line no-empty
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('err connect wallet', err);
      }
    },
    []
  );
  return { handleActivate };
};

export { useConnectWallet };
