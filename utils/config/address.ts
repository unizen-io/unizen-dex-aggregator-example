import DEV_CONTRACT_ADDRESS from '@unizen-io/unizen-contract-addresses/dev.json';
import PROD_CONTRACT_ADDRESS from '@unizen-io/unizen-contract-addresses/production.json';

import { SupportedChainID } from './token';

const isProduction = process.env.NODE_ENV === 'production';

const UNIZEN_CONTRACT_ADDRESS: {
    [key in 'v1' | 'v2']: {
        [key in SupportedChainID]: string;
    }
} = {
  v1: {
    [SupportedChainID.EthereumMainnet]: isProduction ? PROD_CONTRACT_ADDRESS.v1.ethereum : DEV_CONTRACT_ADDRESS.v1.ethereum,
    [SupportedChainID.BSCMainnet]: isProduction ? PROD_CONTRACT_ADDRESS.v1.bsc : DEV_CONTRACT_ADDRESS.v1.bsc,
    [SupportedChainID.PolygonMainnet]: isProduction ? PROD_CONTRACT_ADDRESS.v1.polygon : DEV_CONTRACT_ADDRESS.v1.polygon,
    [SupportedChainID.Fantom]: isProduction ? PROD_CONTRACT_ADDRESS.v1.fantom : DEV_CONTRACT_ADDRESS.v1.fantom,
    [SupportedChainID.Avalanche]: isProduction ? PROD_CONTRACT_ADDRESS.v1.avax : DEV_CONTRACT_ADDRESS.v1.avax,
    [SupportedChainID.Arbitrum]: isProduction ? PROD_CONTRACT_ADDRESS.v1.arbitrum : DEV_CONTRACT_ADDRESS.v1.arbitrum,
    [SupportedChainID.Optimism]: isProduction ? PROD_CONTRACT_ADDRESS.v1.optimism : DEV_CONTRACT_ADDRESS.v1.optimism
  },
  v2: {
    [SupportedChainID.EthereumMainnet]: isProduction ? PROD_CONTRACT_ADDRESS.v2.ethereum : DEV_CONTRACT_ADDRESS.v2.ethereum,
    [SupportedChainID.BSCMainnet]: isProduction ? PROD_CONTRACT_ADDRESS.v2.bsc : DEV_CONTRACT_ADDRESS.v2.bsc,
    [SupportedChainID.PolygonMainnet]: isProduction ? PROD_CONTRACT_ADDRESS.v2.polygon : DEV_CONTRACT_ADDRESS.v2.polygon,
    [SupportedChainID.Fantom]: isProduction ? PROD_CONTRACT_ADDRESS.v2.fantom : DEV_CONTRACT_ADDRESS.v2.fantom,
    [SupportedChainID.Avalanche]: isProduction ? PROD_CONTRACT_ADDRESS.v2.avax : DEV_CONTRACT_ADDRESS.v2.avax,
    [SupportedChainID.Arbitrum]: isProduction ? PROD_CONTRACT_ADDRESS.v2.arbitrum : DEV_CONTRACT_ADDRESS.v2.arbitrum,
    [SupportedChainID.Optimism]: isProduction ? PROD_CONTRACT_ADDRESS.v2.optimism : DEV_CONTRACT_ADDRESS.v2.optimism
  }
};

export { UNIZEN_CONTRACT_ADDRESS };
