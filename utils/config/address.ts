import PROD_CONTRACT_ADDRESS from '@unizen-io/unizen-contract-addresses/production.json';

import { SupportedChainID } from './token';

const UNIZEN_CONTRACT_ADDRESS: {
    [key in 'v1' | 'v2' | 'v3']: {
        [key in SupportedChainID]: string;
    }
} = {
  v1: {
    [SupportedChainID.EthereumMainnet]: PROD_CONTRACT_ADDRESS.v1.ethereum,
    [SupportedChainID.BSCMainnet]: PROD_CONTRACT_ADDRESS.v1.bsc,
    [SupportedChainID.PolygonMainnet]: PROD_CONTRACT_ADDRESS.v1.polygon,
    [SupportedChainID.Fantom]: PROD_CONTRACT_ADDRESS.v1.fantom,
    [SupportedChainID.Avalanche]: PROD_CONTRACT_ADDRESS.v1.avax,
    [SupportedChainID.Arbitrum]: PROD_CONTRACT_ADDRESS.v1.arbitrum,
    [SupportedChainID.Optimism]: PROD_CONTRACT_ADDRESS.v1.optimism,
    [SupportedChainID.Base]: PROD_CONTRACT_ADDRESS.v1.base
  },
  v2: {
    [SupportedChainID.EthereumMainnet]: PROD_CONTRACT_ADDRESS.v2.ethereum,
    [SupportedChainID.BSCMainnet]: PROD_CONTRACT_ADDRESS.v2.bsc,
    [SupportedChainID.PolygonMainnet]: PROD_CONTRACT_ADDRESS.v2.polygon,
    [SupportedChainID.Fantom]: PROD_CONTRACT_ADDRESS.v2.fantom,
    [SupportedChainID.Avalanche]: PROD_CONTRACT_ADDRESS.v2.avax,
    [SupportedChainID.Arbitrum]: PROD_CONTRACT_ADDRESS.v2.arbitrum,
    [SupportedChainID.Optimism]: PROD_CONTRACT_ADDRESS.v2.optimism,
    [SupportedChainID.Base]: ''
  },
  v3: {
    [SupportedChainID.EthereumMainnet]: PROD_CONTRACT_ADDRESS.v3.ethereum,
    [SupportedChainID.BSCMainnet]: PROD_CONTRACT_ADDRESS.v3.bsc,
    [SupportedChainID.PolygonMainnet]: PROD_CONTRACT_ADDRESS.v3.polygon,
    [SupportedChainID.Fantom]: '',
    [SupportedChainID.Avalanche]: PROD_CONTRACT_ADDRESS.v3.avax,
    [SupportedChainID.Arbitrum]: PROD_CONTRACT_ADDRESS.v3.arbitrum,
    [SupportedChainID.Optimism]: PROD_CONTRACT_ADDRESS.v3.optimism,
    [SupportedChainID.Base]: PROD_CONTRACT_ADDRESS.v3.base
  }
};

export { UNIZEN_CONTRACT_ADDRESS };
