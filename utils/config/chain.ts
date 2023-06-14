import { SupportedChainID } from './token';

interface ChainInfo {
  id: SupportedChainID;
  name: string;
  shortName: string;
}

const CHAIN_INFOS: {
  [key in SupportedChainID]: ChainInfo;
} = Object.freeze({
  [SupportedChainID.EthereumMainnet]: {
    id: SupportedChainID.EthereumMainnet,
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum'
  },
  [SupportedChainID.PolygonMainnet]: {
    id: SupportedChainID.PolygonMainnet,
    name: 'Polygon Mainnet',
    shortName: 'Polygon'
  },
  [SupportedChainID.BSCMainnet]: {
    id: SupportedChainID.BSCMainnet,
    name: 'Binance Smart Chain',
    shortName: 'BSC'
  },
  [SupportedChainID.Avalanche]: {
    id: SupportedChainID.Avalanche,
    name: 'Avalanche Mainnet',
    shortName: 'Avalanche'
  },
  [SupportedChainID.Fantom]: {
    id: SupportedChainID.Fantom,
    name: 'Fantom Mainnet',
    shortName: 'Fantom'
  },
  [SupportedChainID.Arbitrum]: {
    id: SupportedChainID.Arbitrum,
    name: 'Arbitrum Mainnet',
    shortName: 'Arbitrum'
  },
  [SupportedChainID.Optimism]: {
    id: SupportedChainID.Optimism,
    name: 'Optimism Mainnet',
    shortName: 'Optimism'
  }
});

export { CHAIN_INFOS };
