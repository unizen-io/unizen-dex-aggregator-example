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
import {
  BTCTradeType,
  NonEVMSupportedChainID,
  THORCHAIN_SUPPORTED_CURRENCIES
} from 'utils/config/token';
import { CrossChainQuoteCallData } from 'utils/config/type';
import {
  getCrossQuoteURL,
  getCrossSwapURL
} from 'utils/config/urls';

function getIsXDeFiBitcoin(): boolean {
  return (
    typeof window !== 'undefined' &&
        (window as any).xfi &&
        (window as any).xfi.bitcoin
  ) ?? false;
}

const BTC_CURRENCY = {
  chainId: NonEVMSupportedChainID.BTC,
  decimals: 8,
  symbol: 'BTC',
  name: 'Bitcoin',
  address: AddressZero
} as Currency;

const TradeBTC = () => {
  const { account } = useWeb3React();

  const [
    btcAddress,
    setBtcAddress
  ] = React.useState<string>();
  const [
    currencyIn,
    setCurrencyIn
  ] = React.useState(BTC_CURRENCY);
  const [
    currencyOut,
    setCurrencyOut
  ] = React.useState(THORCHAIN_SUPPORTED_CURRENCIES[0]);
  const [
    currencyAmountIn,
    setCurrencyAmountIn
  ] = React.useState<string>();
  const [
    currencyAmountOut,
    setCurrencyAmountOut
  ] = React.useState<string>();
  const [
    quote,
    setQuote
  ] = React.useState<any>();

  const [
    isFetchingQuote,
    setIsFetchingQuote
  ] = React.useState<boolean>(false);
  const [
    swapData,
    setSwapData
  ] = React.useState<any>();

  const handleActive = () => {
    if (getIsXDeFiBitcoin()) {
      (window as any).xfi.bitcoin?.request(
        { method: 'request_accounts', params: [] },
        (error: Error | undefined, accounts: string[]) => {
        //   setBtcConnector((window as any).xfi.bitcoin);
          if (error) {
            return;
          }
          if (accounts) {
            setBtcAddress(accounts[0]);
          }
        });
    }
  };

  const handleFetchQuote = async () => {
    setIsFetchingQuote(true);

    const amount = parseUnits(currencyAmountIn || '0', currencyIn?.decimals).toString();

    let crossChainParams: any;
    if (amount && currencyOut) {
      crossChainParams = {
        fromTokenAddress: AddressZero,
        toTokenAddress: AddressZero,
        sourceChainId: currencyIn.chainId,
        destinationChainId: currencyOut?.chainId,
        sender: account,
        receiver: account,
        amount: amount,
        isExactOut: false
      };
    }

    if (crossChainParams) {
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
      setQuote(crossQuoteJSON[0]);
      if (crossQuoteJSON[0]?.dstTrade.toTokenAmount) {
        setCurrencyAmountOut(formatUnits(crossQuoteJSON?.[0]?.dstTrade.toTokenAmount, currencyOut.decimals));
      }
    }
  };
  const onCurrencyInInput = (amount: string | undefined) => {
    setCurrencyAmountIn(amount);
    setCurrencyAmountOut(undefined);
  };
  const onCurrencyOutInput = (amount: string | undefined) => {
    setCurrencyAmountOut(amount);
    setCurrencyAmountIn(undefined);
  };
  const onCurrencyInSelect = (currency: Currency) => {
    setCurrencyIn(currency);
    setCurrencyAmountIn(undefined);
    setCurrencyAmountOut(undefined);
  };
  const onCurrencyOutSelect = (currency: Currency) => {
    setCurrencyOut(currency);
    setCurrencyAmountIn(undefined);
    setCurrencyAmountOut(undefined);
  };
  const handleConfirmTrade = async () => {
    if (currencyIn.chainId) {
      const url = getCrossSwapURL(currencyIn.chainId);

      const params = {
        transactionData: quote?.transactionData,
        nativeValue: quote?.nativeValue,
        account: btcAddress
      };

      const data = await fetch(url, {
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY
        } as any,
        method: 'POST'
      })
        .then(async r => {
          const data = await r.json();
          if (data.error) {
            throw new Error(data.message);
          }
          setSwapData(data);
          return data;
        });

      return data;
    }
  };
  const handleSendTransaction = () => {
    if (quote?.transactionData.tradeType === BTCTradeType.BTC_TO_NATIVE) {
      (window as any).xfi.bitcoin?.request({ ...swapData.data },
        (error: any) => {
          if (error) {
            console.error(error);
          }
        });
    }
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
          <button
            style={{ width: 200 }}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick={handleActive}>
            {btcAddress ? 'Disconnect' : 'Connect XDeFi Bitcoin'}
          </button>
          <span>{btcAddress}</span>
        </div>
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
          <CurrencyInputPanel
            currency={currencyOut}
            amount={currencyAmountOut}
            onCurrencySelect={onCurrencyOutSelect}
            onCurrencyInput={onCurrencyOutInput} />
          <Button
            disabled={isFetchingQuote}
            onClick={handleFetchQuote}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80'>
            2. Fetch Cross Quote
          </Button>
          <Button
            onClick={handleConfirmTrade}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80'>
            3. Generate tx data
          </Button>
          <Button
            onClick={handleSendTransaction}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80'>
            4. Confirm trade
          </Button>
        </div>
      </div>
    </>
  );
};

export default TradeBTC;
