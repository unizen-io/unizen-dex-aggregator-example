
import { SupportedChainID } from './token';

const UNIZEN_ROUTER_ADDRESS: {
  [key in SupportedChainID]: string;
} = {
  [SupportedChainID.EthereumMainnet]: '0x0',
  [SupportedChainID.BSCMainnet]: '0x8d463636D26cDde64f8142E5b741e1a20Fcd97Bc',
  [SupportedChainID.PolygonMainnet]: '0x12265487B3b4034656Dd980B92886e892db3c17B',
  [SupportedChainID.Fantom]: '0x0',
  [SupportedChainID.Avalanche]: '0x0C1dd4253C4a157D015de34BBA5E489b6F420E34',
  [SupportedChainID.Arbitrum]: '0xb2a18894e693DaA604460333543A2963311D9d40',
  [SupportedChainID.Optimism]: '0xFC380cbF5f4ACE571313d55beF5Cf4F14F05Aa22',
  [SupportedChainID.Base]: '0xed442cCfde7596b46Deb923620A2FEf9999976Af'
};

export { UNIZEN_ROUTER_ADDRESS };
