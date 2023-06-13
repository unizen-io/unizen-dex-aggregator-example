import React from 'react';
import { Currency } from '@uniswap/sdk-core';

import CurrencyInputPanel from 'components/CurrencyInputPanel';
import Wallet from 'components/Wallet';

const Trade = () => {
  const [
    currencyIn,
    setCurrencyIn
  ] = React.useState<Currency>();
  const [
    currencyOut,
    setCurrencyOut
  ] = React.useState<Currency>();
  const [
    currencyAmountIn,
    setCurrencyAmountIn
  ] = React.useState<string>();
  const [
    currencyAmountOut,
    setCurrencyAmountOut
  ] = React.useState<string>();

  return (
    <>
      <Wallet />
      <span>From</span>
      <CurrencyInputPanel
        currency={currencyIn}
        amount={currencyAmountIn}
        onCurrencySelect={setCurrencyIn}
        onCurrencyInput={setCurrencyAmountIn} />
      <span>To</span>
      <CurrencyInputPanel
        currency={currencyOut}
        amount={currencyAmountOut}
        onCurrencySelect={setCurrencyOut}
        onCurrencyInput={setCurrencyAmountOut} />
    </>
  );
};
export default Trade;
