import {
  CrossChainTradeProtocol,
  SupportedChainID
} from './token';

interface CrossQuoteAPIProps {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string;
    deadline?: number;
    sourceChainId: SupportedChainID;
    destinationChainId: SupportedChainID;
    sender: string;
    isExactOut?: boolean;
    isVIP?: boolean;
    slippage?: number;
    uuid?: string | undefined;
}
interface SingleQuoteAPIProps {
    fromTokenAddress: string;
    toTokenAddress: string;
    amount: string;
    deadline?: number;
    chainId: SupportedChainID;
    isExactOut?: boolean;
    isSplit?: boolean;
    isVIP?: boolean;
    slippage?: number;
    uuid?: string | undefined;
}

const API_UNIZEN_IO_LINK = 'https://api-dev.zcx.com';
function getSingleQuoteURL({
  fromTokenAddress,
  toTokenAddress,
  amount,
  deadline,
  chainId,
  isExactOut,
  isSplit,
  slippage,
  uuid
}: SingleQuoteAPIProps) {
  // eslint-disable-next-line max-len
  return `${API_UNIZEN_IO_LINK}/trade/v1/${chainId}/quote/single?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&deadline=${deadline}&isExactOut=${isExactOut}&isSplit=${isSplit}&slippage=${slippage}&uuid=${uuid}`;
}
function getSingleSwapURL(chainId: SupportedChainID) {
  return `${API_UNIZEN_IO_LINK}/trade/v1/${chainId}/swap/single`;
}
function getCrossQuoteURL({
  fromTokenAddress,
  toTokenAddress,
  amount,
  deadline,
  sourceChainId,
  destinationChainId,
  sender,
  isExactOut,
  slippage,
  uuid
}: CrossQuoteAPIProps) {
  // eslint-disable-next-line max-len
  return `${API_UNIZEN_IO_LINK}/trade/v1/${sourceChainId}/quote/cross?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&deadline=${deadline}&destinationChainId=${destinationChainId}&sender=${sender}&isExactOut=${isExactOut}&slippage=${slippage}&uuid=${uuid}`;
}
function getCrossQuoteSelectURL({
  fromTokenAddress,
  toTokenAddress,
  amount,
  deadline,
  sourceChainId,
  destinationChainId,
  sender,
  isExactOut,
  slippage,
  uuid,
  stableAmount,
  tradeProtocol
}: CrossQuoteAPIProps & {
      stableAmount: string;
      tradeProtocol: CrossChainTradeProtocol;
    }) {
  // eslint-disable-next-line max-len
  return `${API_UNIZEN_IO_LINK}/trade/v1/${sourceChainId}/quote/cross-select?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amount}&deadline=${deadline}&destinationChainId=${destinationChainId}&sender=${sender}&isExactOut=${isExactOut}&slippage=${slippage}&uuid=${uuid}&stableAmount=${stableAmount}&tradeProtocol=${tradeProtocol}`;
}
function getCrossSwapURL(chainId: SupportedChainID) {
  return `${API_UNIZEN_IO_LINK}/trade/v1/${chainId}/swap/cross`;
}

export {
  getSingleQuoteURL,
  getSingleSwapURL,
  getCrossQuoteURL,
  getCrossQuoteSelectURL,
  getCrossSwapURL

};

export type { CrossQuoteAPIProps };
