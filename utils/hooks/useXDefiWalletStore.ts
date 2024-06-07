
import { create } from 'zustand';

import { UTXOSupportedChainID } from 'utils/config/token';

interface XDefiWalletStore {
  account: string | undefined;
  active: boolean;
  activating: boolean;
  connector: any;
  error: Error | undefined;
  instructionModalOpen: boolean;
  chainId: UTXOSupportedChainID | undefined;
  allAccountsByChainId: Record<UTXOSupportedChainID, string | undefined>;
  setAccount: (account: string) => void;
  setActive: (active: boolean) => void;
  setActivating: (activating: boolean) => void;
  setConnector: (connector: any) => void;
  setError: (error: Error) => void;
  setInstructionModalOpen: (instructionModalOpen: boolean) => void;
  setChainId: (chainId: UTXOSupportedChainID | undefined) => void;
    setAllAccountsByChainId: (chainId: UTXOSupportedChainID, account: string) => void;
}

const useXDefiWalletStore = create<XDefiWalletStore>(set => ({
  account: undefined,
  active: false,
  activating: false,
  connector: undefined,
  error: undefined,
  instructionModalOpen: false,
  chainId: undefined,
  allAccountsByChainId: {
    [UTXOSupportedChainID.BTC]: undefined,
    [UTXOSupportedChainID.DOGE]: undefined,
    [UTXOSupportedChainID.LTC]: undefined,
    [UTXOSupportedChainID.BCH]: undefined
  },
  setAccount: account => set({ account }),
  setActive: active => set({ active }),
  setActivating: activating => set({ activating }),
  setConnector: connector => set({ connector }),
  setError: error => set({ error }),
  setInstructionModalOpen: instructionModalOpen => set({ instructionModalOpen }),
  setChainId: chainId => set({ chainId }),
  setAllAccountsByChainId: (chainId, account) => set(state => ({
    allAccountsByChainId: {
      ...state.allAccountsByChainId,
      [chainId]: account
    }
  }))
}));

export { useXDefiWalletStore };
export type { XDefiWalletStore };
