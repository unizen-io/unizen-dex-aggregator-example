
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

export {
  CONNECTIONS,
  getConnection,
  WalletType,
  injectedConnection
};

export type { Connection };
