import React from 'react';
import clsx from 'clsx';
import { Button } from '@ariakit/react';
import { AddressZero } from '@ethersproject/constants';
import {
  formatUnits,
  parseUnits
} from '@ethersproject/units';
import { Currency } from '@uniswap/sdk-core';
import { useWeb3React } from '@web3-react/core';

import CurrencyInputPanel from 'components/CurrencyInputPanel';
import Wallet from 'components/Wallet';
import { SingleQuoteAPIData } from 'utils/config/type';
import { getSingleQuoteURL } from 'utils/config/urls';
import SingleQuoteModal from './SingleQuoteModal';

const Trade = () => {
  const { chainId } = useWeb3React();
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
  const [
    singleQuote,
    setSingleQuote
  ] = React.useState<any>();
  const [
    isExactOut,
    setIsExactOut
  ] = React.useState<boolean>(false);

  const handleFetchQuote = async () => {
    const fromChainId = currencyIn?.chainId;
    const toChainId = currencyOut?.chainId;
    const isCrossChain = fromChainId !== toChainId;

    if (!isCrossChain) {
      const fromTokenAddress = currencyIn?.isNative ? AddressZero : currencyIn?.address;
      const toTokenAddress = currencyOut?.isNative ? AddressZero : currencyOut?.address;
      const amount = isExactOut ?
        parseUnits(currencyAmountOut || '0', currencyOut?.decimals).toString() :
        parseUnits(currencyAmountIn || '0', currencyIn?.decimals).toString();

      if (fromTokenAddress && toTokenAddress && chainId && amount) {
        const url = getSingleQuoteURL({
          fromTokenAddress: fromTokenAddress,
          toTokenAddress: toTokenAddress,
          chainId,
          amount: amount,
          isExactOut
        });

        const singleQuote = await fetch(
          url, {
            method: 'GET',
            headers: { 'x-api-key': process.env.X_API_KEY } as any
          }
        );

        const singleQuoteJSON = await singleQuote.json() as SingleQuoteAPIData[] | undefined;

        if (!isExactOut && singleQuoteJSON?.[0].toTokenAmount) {
          setCurrencyAmountOut(formatUnits(singleQuoteJSON?.[0].toTokenAmount, currencyOut?.decimals));
        }
        if (isExactOut && singleQuoteJSON?.[0].fromTokenAmount) {
          setCurrencyAmountIn(formatUnits(singleQuoteJSON?.[0].fromTokenAmount, currencyIn?.decimals));
        }
        setSingleQuote(singleQuoteJSON);
      }
    }
  };
  const onCurrencyInInput = (amount: string | undefined) => {
    setCurrencyAmountIn(amount);
    setIsExactOut(false);
  };
  const onCurrencyOutInput = (amount: string | undefined) => {
    setCurrencyAmountOut(amount);
    setIsExactOut(true);
  };
  return (
    <>
      <Wallet />
      <span>From</span>
      <CurrencyInputPanel
        currency={currencyIn}
        amount={currencyAmountIn}
        onCurrencySelect={setCurrencyIn}
        onCurrencyInput={onCurrencyInInput} />
      <span>To</span>
      <CurrencyInputPanel
        currency={currencyOut}
        amount={currencyAmountOut}
        onCurrencySelect={setCurrencyOut}
        onCurrencyInput={onCurrencyOutInput} />
      <div
        className={clsx(
          'flex',
          'flex-col',
          'space-y-4'
        )}>
        <Button
          onClick={handleFetchQuote}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80'>
            1. Fetch Quote
        </Button>
        <SingleQuoteModal
          quote={singleQuote}
          isExactOut={isExactOut} />
      </div>
    </>
  );
};
export default Trade;
