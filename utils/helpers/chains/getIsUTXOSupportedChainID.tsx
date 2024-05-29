import {
  AllSupportedChainIds,
  UTXOSupportedChainID
} from 'utils/config/token';

export const getIsUTXOSupportedChainID = (
  item: AllSupportedChainIds
): item is UTXOSupportedChainID => {
  return Object.values(UTXOSupportedChainID).includes(item as UTXOSupportedChainID);
};
