import { STABLE_TOKENS } from 'utils/config/token';
import { getAllNativeForCrossChainTradeChains } from './use-native-currency';

const useCurrencyList = () => {
  const nativeCurrencies = getAllNativeForCrossChainTradeChains();
  const stableTokens = Object.values(STABLE_TOKENS).flat();

  return [
    ...nativeCurrencies,
    ...stableTokens
  ];
};

export default useCurrencyList;
