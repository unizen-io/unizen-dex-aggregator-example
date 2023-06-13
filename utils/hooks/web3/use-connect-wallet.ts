import * as React from 'react';

import { injectedConnection } from 'utils/helpers/web3/connectors';

interface Props {
  handleActivate: () => void;
}
const useConnectWallet = (): Props => {
  const handleActivate = React.useCallback(
    async () => {
      try {
        injectedConnection &&
        await injectedConnection.connector.activate();
      // eslint-disable-next-line no-empty
      } catch (err) {}
    },
    []
  );
  return { handleActivate };
};

export { useConnectWallet };
