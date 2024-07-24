
import * as React from 'react';
import { assets } from 'chain-registry';
import { withErrorBoundary } from 'react-error-boundary';
import { useEffectOnce } from 'react-use';
import {
  Logger,
  WalletManager
} from '@cosmos-kit/core';
import { wallets as xdefiWallets } from '@cosmos-kit/xdefi';

import { UTXOSupportedChainID } from 'utils/config/token';
import {
  getIsNeedToTriggerXDeFiBitcoin,
  getIsXDeFi,
  getIsXDeFiBitcoin
} from 'utils/helpers/web3/connectors';
import { useXDefiWalletStore } from 'utils/hooks/useXDefiWalletStore';
interface ActiveXDefiWallet {
    account: string | undefined;
    active: boolean;
    activating: boolean;
    connector: any;
    error: Error | undefined;
    chainId: UTXOSupportedChainID | undefined;

}
interface XDefiWalletInterface {
    activeXDefiWallet: ActiveXDefiWallet;
    isXDeFi: boolean;
    handleXDefiActive: (chainId: UTXOSupportedChainID) => void;
    handleConnectAll: () => void;
    allAccountsByChainId: {[key in UTXOSupportedChainID]: string | undefined};
}
const XDefiWalletContext = React.createContext<
    XDefiWalletInterface | undefined
>(undefined);

const mapChainIdToConnector = {
  [UTXOSupportedChainID.BTC]: typeof window !== 'undefined' && (window as any).xfi?.bitcoin,
  [UTXOSupportedChainID.DOGE]: typeof window !== 'undefined' && (window as any).xfi?.dogecoin,
  [UTXOSupportedChainID.LTC]: typeof window !== 'undefined' && (window as any).xfi?.litecoin,
  [UTXOSupportedChainID.BCH]: typeof window !== 'undefined' && (window as any).xfi?.bitcoincash,
  [UTXOSupportedChainID.GAIA]: typeof window !== 'undefined' && (window as any).xfi?.keplr
};

function XDefiWalletProvider({ children }: { children: React.ReactNode; }) {
  const {
    account,
    active,
    activating,
    connector,
    error,
    chainId,
    allAccountsByChainId,
    setAccount,
    setActive,
    setActivating,
    setConnector,
    setError,
    setInstructionModalOpen,
    setChainId,
    setAllAccountsByChainId
  } = useXDefiWalletStore();

  const isXDeFi = getIsXDeFi();
  const handleActive = async (chainId: UTXOSupportedChainID) => {
    if (chainId === UTXOSupportedChainID.GAIA) {
      const walletManager = new WalletManager(
        ['cosmoshub'],
        [xdefiWallets[0]],
        new Logger('NONE'),
        false,
        undefined,
        undefined,
        assets
      );

      const wallet = walletManager
        .getWalletRepo('cosmoshub')
        .getWallet('xdefi-extension');

      await wallet?.connect();

      await wallet?.initOfflineSigner();
      const accounts = await wallet?.offlineSigner?.getAccounts();
      if (!accounts) {
        return;
      }
      setAccount(accounts?.[0]?.address);
      setActive(true);
      setChainId(chainId);
      setAllAccountsByChainId(chainId, accounts[0]?.address);

      return;
    }
    const connector = mapChainIdToConnector[chainId];
    if (getIsXDeFiBitcoin()) {
      await connector?.request(
        { method: 'request_accounts', params: [] },
        (error: Error | undefined, accounts: string[]) => {
          setActivating(false);
          setConnector(connector);
          if (error) {
            setError(error);
            setActive(false);
            setChainId(undefined);
            return;
          }
          if (accounts) {
            setAccount(accounts[0]);
            setActive(true);
            setChainId(chainId);
            setAllAccountsByChainId(chainId, accounts[0]);
          }
        });
    }
  };

  const handleConnectAll = React.useCallback(async () => {
    handleActive(UTXOSupportedChainID.BTC);
    if (active) {
      handleActive(UTXOSupportedChainID.DOGE);
      handleActive(UTXOSupportedChainID.LTC);
      handleActive(UTXOSupportedChainID.BCH);
      handleActive(UTXOSupportedChainID.GAIA);
    }
  }, [active]);

  React.useEffect(() => {
    if (active) {
      handleActive(UTXOSupportedChainID.DOGE);
      handleActive(UTXOSupportedChainID.LTC);
      handleActive(UTXOSupportedChainID.BCH);
      handleActive(UTXOSupportedChainID.GAIA);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffectOnce(() => {
    handleConnectAll();
  });
  const handleXDefiActive = React.useCallback((chainId: UTXOSupportedChainID) => {
    if (getIsXDeFiBitcoin()) {
      handleActive(chainId);
      return;
    }
    if (getIsNeedToTriggerXDeFiBitcoin()) {
      setInstructionModalOpen(true);
      return;
    }
    if (!isXDeFi) {
      window.open('https://www.xdefi.io/', '_blank');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = React.useMemo(
    () => ({
      activeXDefiWallet: {
        account,
        active,
        activating,
        connector,
        error,
        chainId
      },
      isXDeFi,
      allAccountsByChainId,
      handleXDefiActive,
      handleConnectAll
    }),
    [
      account,
      activating,
      active,
      connector,
      error,
      chainId,
      handleXDefiActive,
      allAccountsByChainId,
      handleConnectAll,
      isXDeFi
    ]
  );

  return (
    <XDefiWalletContext.Provider value={value}>
      {children}
    </XDefiWalletContext.Provider>
  );
}

function useXDefiWallet(): XDefiWalletInterface {
  const context = React.useContext(XDefiWalletContext);
  if (context === undefined) {
    throw new Error('useXDefiWallet must be used within a XDefiWalletProvider!');
  }

  return context;
}
const ErrorBoundaryWrappedXDefiWalletProvider = withErrorBoundary(XDefiWalletProvider, {
  FallbackComponent: () => <></>,
  onReset: () => {
    window.location.reload();
  }
});

export {
  useXDefiWallet,
  mapChainIdToConnector
};
export default ErrorBoundaryWrappedXDefiWalletProvider;
