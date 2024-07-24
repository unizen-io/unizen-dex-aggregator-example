import { UTXOSupportedChainID } from 'utils/config/token';

const getIsUTXONetwork = (chainId: number): chainId is UTXOSupportedChainID => {
  return Object.values(UTXOSupportedChainID).includes(chainId);
};

export { getIsUTXONetwork };
