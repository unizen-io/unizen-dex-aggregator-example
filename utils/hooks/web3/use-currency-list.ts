import {
  STABLE_TOKENS,
  UTXO_TOKENS
} from 'utils/config/token';
import { getAllNativeForCrossChainTradeChains } from './use-native-currency';

const useCurrencyList = () => {
  const nativeCurrencies = getAllNativeForCrossChainTradeChains();
  const stableTokens = Object.values(STABLE_TOKENS).flat();
  const utxoTokens = Object.values(UTXO_TOKENS).flat();

  return [
    ...nativeCurrencies,
    ...stableTokens,
    ...utxoTokens
  ];
};

export default useCurrencyList;
