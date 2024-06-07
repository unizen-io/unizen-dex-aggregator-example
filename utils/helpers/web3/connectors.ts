
import {
  initializeConnector,
  Web3ReactHooks
} from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Connector } from '@web3-react/types';

enum WalletType {
    METAMASK = 'MetaMask',
}

interface Connection {
    connector: Connector;
    hooks: Web3ReactHooks;
    type: WalletType;
}

const [
  web3Injected,
  web3InjectedHooks
] = initializeConnector<MetaMask>(actions => new MetaMask({ actions }));
const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: WalletType.METAMASK
};

const CONNECTIONS = [injectedConnection];

function getConnection(c: Connector | WalletType): Connection {
  if (c instanceof Connector) {
    const connection = CONNECTIONS.find(connection => connection.connector === c);
    if (!connection) {
      throw Error('unsupported connector');
    }
    return connection;
  } else {
    switch (c) {
    case WalletType.METAMASK:
      return injectedConnection;
    default:
      return injectedConnection;
    }
  }
}

function getIsXDeFi(): boolean {
  return (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // Ignore to avoid errors in mobile app precommit
    typeof window !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // Ignore to avoid errors in mobile app precommit
    (window as any).xfi
  ) ?? false;
}
function getIsXDeFiBitcoin(): boolean {
  return (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // Ignore to avoid errors in mobile app precommit
    typeof window !== 'undefined' &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // Ignore to avoid errors in mobile app precommit
      (window as any).xfi &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // Ignore to avoid errors in mobile app precommit
      (window as any).xfi.bitcoin
  ) ?? false;
}

function getIsNeedToTriggerXDeFiBitcoin(): boolean {
  return getIsXDeFi() && !getIsXDeFiBitcoin();
}

export {
  CONNECTIONS,
  getConnection,
  WalletType,
  injectedConnection,
  getIsNeedToTriggerXDeFiBitcoin,
  getIsXDeFi,
  getIsXDeFiBitcoin
};

export type { Connection };
