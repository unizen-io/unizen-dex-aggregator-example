import React, { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ChainProvider } from '@cosmos-kit/react';
import { wallets as xdefiWallets } from '@cosmos-kit/xdefi';
import {
  Web3ReactHooks,
  Web3ReactProvider
} from '@web3-react/core';
import { Connector } from '@web3-react/types';

import {
  Connection,
  CONNECTIONS
} from 'utils/helpers/web3/connectors';
import 'styles/global.css';

const XDefiWalletProvider = dynamic(
  () => import('../utils/context/XDefiWalletContext'),
  { ssr: false }
);

function Web3Provider({ children }: { children: ReactNode; }) {
  const connections = CONNECTIONS;

  const connectors: [Connector, Web3ReactHooks][] = connections.map(({ hooks, connector }) => [
    connector,
    hooks
  ]);

  const key = React.useMemo(() => connections.map(({ type }: Connection) => type).join('-'), [connections]);

  return (
    <Web3ReactProvider
      connectors={connectors}
      key={key}>
      {children}
    </Web3ReactProvider>
  );
}

const MyApp = ({
  Component,
  pageProps
}: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <title>Unizen DEX Aggregator Example Project</title>
      </Head>
      <Web3Provider>
        <ChainProvider
          walletModal={() => <></>}
          endpointOptions={{
            isLazy: true,
            endpoints: {
              cosmoshub: {
                rpc: [{
                  url: 'https://cosmos-rpc.publicnode.com:443',
                  headers: {}
                }]
              }
            }
          }}
          assetLists={[]}
          chains={['cosmoshub']}
          wallets={[...xdefiWallets]}>
          <XDefiWalletProvider>
            <Component {...pageProps} />
          </XDefiWalletProvider>
        </ChainProvider>
      </Web3Provider>
    </>
  );
};

export default MyApp;
