import { Token } from '@uniswap/sdk-core';

enum SupportedChainID {
    EthereumMainnet = 1,
    PolygonMainnet = 137,
    BSCMainnet = 56,
    Avalanche = 43114,
    Fantom = 250,
    Optimism = 10,
    Arbitrum = 42161
  }
const NATIVE_CURRENCY: { [key in SupportedChainID]:
    {name: string; symbol: string; };
} = {
  [SupportedChainID.PolygonMainnet]: {
    symbol: 'MATIC',
    name: 'Polygon Matic'
  },
  [SupportedChainID.EthereumMainnet]: {
    symbol: 'ETH',
    name: 'Ether'
  },
  [SupportedChainID.BSCMainnet]: {
    symbol: 'BNB',
    name: 'Binance'
  },
  [SupportedChainID.Avalanche]: {
    symbol: 'AVAX',
    name: 'Avax'
  },
  [SupportedChainID.Fantom]: {
    symbol: 'FTM',
    name: 'Fantom'
  },
  [SupportedChainID.Arbitrum]: {
    symbol: 'ETH',
    name: 'Ethereum'
  },
  [SupportedChainID.Optimism]: {
    symbol: 'ETH',
    name: 'Ethereum'
  }
};

const WRAPPED_NATIVE_CURRENCY: { [key in SupportedChainID]: Token; } = {
  [SupportedChainID.PolygonMainnet]: new Token(
    SupportedChainID.PolygonMainnet,
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    18,
    'WMATIC',
    'Wrapped MATIC'
  ),
  [SupportedChainID.EthereumMainnet]: new Token(
    SupportedChainID.EthereumMainnet,
    '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainID.BSCMainnet]: new Token(
    SupportedChainID.BSCMainnet,
    '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB'
  ),
  [SupportedChainID.Avalanche]: new Token(
    SupportedChainID.Avalanche,
    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    18,
    'WAVAX',
    'Wrapped AVAX'
  ),
  [SupportedChainID.Fantom]: new Token(
    SupportedChainID.Fantom,
    '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
    18,
    'WFTM',
    'Wrapped Fantom'
  ),
  [SupportedChainID.Arbitrum]: new Token(
    SupportedChainID.Arbitrum,
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    18,
    'WETH',
    'Wrapped Ether'
  ),
  [SupportedChainID.Optimism]: new Token(
    SupportedChainID.Fantom,
    '0x4200000000000000000000000000000000000006',
    18,
    'WETH',
    'Wrapped Ether'
  )
};

// generate object of array for stable token USDT and USDC on each chain
const STABLE_TOKENS: { [key in SupportedChainID]: Token[]; } = {
  [SupportedChainID.PolygonMainnet]: [
    new Token(
      SupportedChainID.PolygonMainnet,
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      6,
      'USDT',
      'Tether USD'
    ),
    new Token(
      SupportedChainID.PolygonMainnet,
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      6,
      'USDC',
      'USD Coin'
    )
  ],
  [SupportedChainID.EthereumMainnet]: [
    new Token(
      SupportedChainID.EthereumMainnet,
      '0xdac17f958d2ee523a2206206994597c13d831ec7',
      6,
      'USDT',
      'Tether USD'
    ),
    new Token(
      SupportedChainID.EthereumMainnet,
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      6,
      'USDC',
      'USD Coin'
    )
  ],
  [SupportedChainID.Optimism]: [
    new Token(
      SupportedChainID.Optimism,
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      6,
      'USDT',
      'Tether USD'
    ),
    new Token(
      SupportedChainID.Optimism,
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      6,
      'USDC',
      'USD Coin'
    )
  ],
  [SupportedChainID.BSCMainnet]: [
    new Token(
      SupportedChainID.BSCMainnet,
      '0x55d398326f99059ff775485246999027b3197955',
      18,
      'USDT',
      'Tether USD'
    ),
    new Token(
      SupportedChainID.BSCMainnet,
      '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      18,
      'USDC',
      'USD Coin'
    )
  ],
  [SupportedChainID.Avalanche]: [
    new Token(
      SupportedChainID.Avalanche,
      '0xde3a24028580884448a5397872046a019649b084',
      6,
      'USDT',
      'Tether USD'
    ),
    new Token(
      SupportedChainID.Avalanche,
      '0xf38d6e55b3ef3690330b92f1554a9e309c5af1f2',
      6,
      'USDC',
      'USD Coin'
    )
  ],
  [SupportedChainID.Fantom]: [
    new Token(
      SupportedChainID.Fantom,
      '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      6,
      'USDT',
      'Tether USD'
    ),
    new Token(
      SupportedChainID.Fantom,
      '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      6,
      'USDC',
      'USD Coin'
    )
  ],
  [SupportedChainID.Arbitrum]: [
    new Token(
      SupportedChainID.Arbitrum,
      '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
      6,
      'USDT',
      'Tether USD'
    ),
    new Token(
      SupportedChainID.Arbitrum,
      '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      6,
      'USDC',
      'USD Coin'
    )
  ]
};
enum CrossChainTradeProtocol {
    CROSS_CHAIN_STARGATE = 'CROSS_CHAIN_STARGATE',
    CROSS_CHAIN_CELER = 'CROSS_CHAIN_CELER',
}
export {
  WRAPPED_NATIVE_CURRENCY,
  STABLE_TOKENS,
  NATIVE_CURRENCY,
  SupportedChainID,
  CrossChainTradeProtocol
};
