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
import CrossQuoteModal from 'components/TradeModals/CrossQuoteModal';
import Wallet from 'components/Wallet';
import {
  CrossChainQuoteCallData,
  SingleQuoteAPIData
} from 'utils/config/type';
import {
  getCrossQuoteURL,
  getSingleQuoteURL
} from 'utils/config/urls';
import SingleQuoteModal from '../../components/TradeModals/SingleQuoteModal';

const TradeEVM = () => {
  const { chainId, account } = useWeb3React();

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
    crossQuote,
    setCrossQuote
  ] = React.useState<CrossChainQuoteCallData[]>();
  const [
    isExactOut,
    setIsExactOut
  ] = React.useState<boolean>(false);
  const [
    isFetchingQuote,
    setIsFetchingQuote
  ] = React.useState<boolean>(false);
  const fromChainId = currencyIn?.chainId;
  const toChainId = currencyOut?.chainId;
  const isCrossChain = fromChainId !== toChainId;

  const fromTokenAddress = currencyIn?.isNative ? AddressZero : currencyIn?.address;
  const toTokenAddress = currencyOut?.isNative ? AddressZero : currencyOut?.address;
  const amount = isExactOut ?
    parseUnits(currencyAmountOut || '0', currencyOut?.decimals).toString() :
    parseUnits(currencyAmountIn || '0', currencyIn?.decimals).toString();

  let crossChainParams: any;
  if (fromTokenAddress && toTokenAddress && chainId && amount && currencyOut && account) {
    crossChainParams = {
      fromTokenAddress: fromTokenAddress,
      toTokenAddress: toTokenAddress,
      sourceChainId: chainId,
      destinationChainId: currencyOut?.chainId,
      sender: account,
      amount: amount,
      isExactOut
    };
  }
  const handleFetchQuote = async () => {
    setIsFetchingQuote(true);
    if (!isCrossChain) {
      if (fromTokenAddress && toTokenAddress && chainId && amount) {
        const url = getSingleQuoteURL({
          fromTokenAddress: fromTokenAddress,
          toTokenAddress: toTokenAddress,
          chainId,
          amount: amount,
          isExactOut,
          isSplit: true,
          slippage: 0.05,
          uuid: '',
          deadline: new Date().getTime() + 1000 * 60 * 10
        });

        const singleQuote = await fetch(
          url, {
            method: 'GET',
            headers: { 'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY } as any
          }
        );
        setIsFetchingQuote(false);
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

    if (isCrossChain) {
      const fromTokenAddress = currencyIn?.isNative ? AddressZero : currencyIn?.address;
      const toTokenAddress = currencyOut?.isNative ? AddressZero : currencyOut?.address;
      const amount = isExactOut ?
        parseUnits(currencyAmountOut || '0', currencyOut?.decimals).toString() :
        parseUnits(currencyAmountIn || '0', currencyIn?.decimals).toString();

      if (fromTokenAddress && toTokenAddress && chainId && amount && currencyOut && account) {
        const url = getCrossQuoteURL(crossChainParams);

        const crossQuote = await fetch(
          url, {
            method: 'GET',
            headers: { 'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY } as any
          });

        const crossQuoteJSON = await crossQuote.json() as CrossChainQuoteCallData[] | undefined;
        setIsFetchingQuote(false);
        if (!crossQuoteJSON) {
          return;
        }
        if (!isExactOut && crossQuoteJSON[0]?.dstTrade.toTokenAmount) {
          setCurrencyAmountOut(formatUnits(crossQuoteJSON[0]?.dstTrade.toTokenAmount, currencyOut?.decimals));
        }
        if (isExactOut && crossQuoteJSON[0]?.srcTrade.fromTokenAmount) {
          setCurrencyAmountIn(formatUnits(crossQuoteJSON[0]?.srcTrade.fromTokenAmount, currencyIn?.decimals));
        }
        setCrossQuote(crossQuoteJSON);
      }
    }
  };
  const onCurrencyInInput = (amount: string | undefined) => {
    setCurrencyAmountIn(amount);
    setIsExactOut(false);
    setCurrencyAmountOut(undefined);
    setSingleQuote(undefined);
    setCrossQuote(undefined);
  };
  const onCurrencyOutInput = (amount: string | undefined) => {
    setCurrencyAmountOut(amount);
    setIsExactOut(true);
    setCurrencyAmountIn(undefined);
    setSingleQuote(undefined);
    setCrossQuote(undefined);
  };
  const onCurrencyInSelect = (currency: Currency) => {
    setCurrencyIn(currency);
    setCurrencyAmountIn(undefined);
    setCurrencyAmountOut(undefined);
    setSingleQuote(undefined);
    setCrossQuote(undefined);
  };
  const onCurrencyOutSelect = (currency: Currency) => {
    setCurrencyOut(currency);
    setCurrencyAmountIn(undefined);
    setCurrencyAmountOut(undefined);
    setSingleQuote(undefined);
    setCrossQuote(undefined);
  };
  return (
    <>
      <div
        className={clsx(
          'flex',
          'flex-col',
          'space-y-4',
          'items-between',
          'justify-center',
          'w-full',
          'h-screen'
        )}>
        <Wallet />
        <div
          className={clsx(
            'flex',
            'flex-col',
            'items-center',
            'space-y-1'
          )}>
          <span>Select token from in connected network</span>
          <CurrencyInputPanel
            currency={currencyIn}
            amount={currencyAmountIn}
            onCurrencySelect={onCurrencyInSelect}
            onCurrencyInput={onCurrencyInInput} />
          <span>Select token to</span>
          <CurrencyInputPanel
            currency={currencyOut}
            amount={currencyAmountOut}
            onCurrencySelect={onCurrencyOutSelect}
            onCurrencyInput={onCurrencyOutInput} />
        </div>
        <div
          className={clsx(
            'flex',
            'flex-col',
            'items-center',
            'space-y-4'
          )}>
          <Button
            onClick={handleFetchQuote}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80'>
            {isFetchingQuote ? 'Loading' : '1. Fetch Quote'}
          </Button>
          {isCrossChain ?
            <CrossQuoteModal
              currencyIn={currencyIn}
              currencyOut={currencyOut}
              crossChainParams={crossChainParams}
              quote={crossQuote?.[0]}
              isExactOut={isExactOut} /> :
            <SingleQuoteModal
              currencyIn={currencyIn}
              quote={singleQuote}
              isExactOut={isExactOut} />
          }
        </div>
      </div>
    </>
  );
};
export default TradeEVM;
