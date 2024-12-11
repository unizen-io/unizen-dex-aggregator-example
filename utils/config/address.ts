
import PROD_CONTRACT_ADDRESS from '@unizen-io/unizen-contract-addresses/production.json';

import { SupportedChainID } from './token';

const UNIZEN_ROUTER_ADDRESS: {
  [key in SupportedChainID]: string;
} = {
  [SupportedChainID.EthereumMainnet]: PROD_CONTRACT_ADDRESS.unizenRouter.ethereum,
  [SupportedChainID.BSCMainnet]: PROD_CONTRACT_ADDRESS.unizenRouter.bsc,
  [SupportedChainID.PolygonMainnet]: PROD_CONTRACT_ADDRESS.unizenRouter.polygon,
  [SupportedChainID.Fantom]: PROD_CONTRACT_ADDRESS.unizenRouter.fantom,
  [SupportedChainID.Avalanche]: PROD_CONTRACT_ADDRESS.unizenRouter.avax,
  [SupportedChainID.Arbitrum]: PROD_CONTRACT_ADDRESS.unizenRouter.arbitrum,
  [SupportedChainID.Optimism]: PROD_CONTRACT_ADDRESS.unizenRouter.optimism,
  [SupportedChainID.Base]: PROD_CONTRACT_ADDRESS.unizenRouter.base
};

export { UNIZEN_ROUTER_ADDRESS };
