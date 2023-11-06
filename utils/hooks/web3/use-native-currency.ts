import * as React from 'react';
import {
  Currency,
  NativeCurrency,
  Token
} from '@uniswap/sdk-core';

import {
  NATIVE_CURRENCY,
  SupportedChainID,
  WRAPPED_NATIVE_CURRENCY
} from 'utils/config/token';

class ExtendedEther extends NativeCurrency {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId as SupportedChainID];
    if (wrapped) return wrapped;
    throw new Error('Unsupported wrapped native currency ' + this.chainId);
  }
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency; } = {};

  public static onChain(chainId: SupportedChainID): ExtendedEther {
    return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId));
  }
  public constructor(chainId: SupportedChainID) {
    super(chainId, 18, NATIVE_CURRENCY[chainId].symbol, NATIVE_CURRENCY[chainId].name);
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency; } = {};
function nativeOnChain(chainId: number): NativeCurrency {
  return (
    cachedNativeCurrency[chainId] ??
      (cachedNativeCurrency[chainId] = ExtendedEther.onChain(chainId))
  );
}

function useNativeCurrency(customChainId: SupportedChainID | undefined): NativeCurrency | undefined {
  return React.useMemo(
    () =>
      customChainId ? nativeOnChain(customChainId) :
        undefined,
    [customChainId]
  );
}

function getAllNativeForCrossChainTradeChains(): NativeCurrency[] {
  return Object.values(SupportedChainID)
    .filter(v => typeof v === 'number')
    .map(item => nativeOnChain(item as number));
}

export default useNativeCurrency;

export {
  getAllNativeForCrossChainTradeChains,
  nativeOnChain
};
