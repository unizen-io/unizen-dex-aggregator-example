
import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useEffectOnce } from 'react-use';

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
    allAccountsByChainId: {[key in UTXOSupportedChainID]: string | undefined};
}
const XDefiWalletContext = React.createContext<
    XDefiWalletInterface | undefined
>(undefined);

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

  const mapChainIdToConnector = {
    [UTXOSupportedChainID.BTC]: (window as any).xfi?.bitcoin,
    [UTXOSupportedChainID.DOGE]: (window as any).xfi?.dogecoin,
    [UTXOSupportedChainID.LTC]: (window as any).xfi?.litecoin,
    [UTXOSupportedChainID.BCH]: (window as any).xfi?.bitcoincash
  };
  const isXDeFi = getIsXDeFi();
  const handleActive = async (chainId: UTXOSupportedChainID) => {
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

  const handleConnectAll = async () => {
    // for (const chainId of allChainIds) {
    //   const connector = mapChainIdToConnector[chainId];
    //   if (connector) {
    //     handleActive(chainId);
    //   }
    // }
    handleActive(UTXOSupportedChainID.BTC);
    if (active) {
      handleActive(UTXOSupportedChainID.DOGE);
      handleActive(UTXOSupportedChainID.LTC);
    }
  };
  React.useEffect(() => {
    if (active) {
      handleActive(UTXOSupportedChainID.DOGE);
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
      handleXDefiActive
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

export { useXDefiWallet };
export default ErrorBoundaryWrappedXDefiWalletProvider;
