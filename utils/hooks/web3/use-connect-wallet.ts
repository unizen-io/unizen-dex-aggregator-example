import * as React from 'react';

import { injectedConnection } from 'utils/helpers/web3/connectors';

interface Props {
  handleActivate: () => void;
  handleDeactivate: () => void;
}
const useConnectWallet = (): Props => {
  const handleActivate = React.useCallback(
    async () => {
      const connector = injectedConnection.connector;

      try {
        await connector.activate();
      // eslint-disable-next-line no-empty
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('err connect wallet', err);
      }
    },
    []
  );

  const handleDeactivate = React.useCallback(
    async () => {
      const connector = injectedConnection.connector;

      try {
        connector.deactivate ? connector.deactivate() : connector?.resetState();
      // eslint-disable-next-line no-empty
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('err disconnect wallet', err);
      }
    },
    []
  );
  return { handleActivate, handleDeactivate };
};

export { useConnectWallet };
