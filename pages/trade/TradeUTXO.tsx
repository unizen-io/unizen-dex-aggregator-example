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
  THORCHAIN_SUPPORTED_CURRENCIES,
  UTXO_TOKENS,
  UTXOSupportedChainID
} from 'utils/config/token';
import { CrossChainQuoteCallData } from 'utils/config/type';
import {
  getBTCInboundAddresses,
  getCrossQuoteURL,
  getCrossSwapURL
} from 'utils/config/urls';
import {
  mapChainIdToConnector,
  useXDefiWallet
} from 'utils/context/XDefiWalletContext';

const UTXO_TRADE_CURRENCIES = [
  ...(Object.values(UTXO_TOKENS) as Currency[]),
  ...THORCHAIN_SUPPORTED_CURRENCIES
];
const TradeUTXO = () => {
  const { account, provider } = useWeb3React();
  const { allAccountsByChainId, handleConnectAll, activeXDefiWallet } = useXDefiWallet();

  const [
    currencyIn,
    setCurrencyIn
  ] = React.useState(THORCHAIN_SUPPORTED_CURRENCIES[0]);
  const [
    currencyOut,
    setCurrencyOut
  ] = React.useState(UTXO_TRADE_CURRENCIES[0]);
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

  const isUTXOSourceChain = currencyIn?.chainId ? Object.values(UTXOSupportedChainID).includes(currencyIn.chainId) : false;
  const isUTXODestinationChain = currencyOut?.chainId ?
    Object.values(UTXOSupportedChainID).includes(currencyOut?.chainId) :
    false;

  const handleFetchQuote = async () => {
    setIsFetchingQuote(true);

    const amount = parseUnits(currencyAmountIn || '0', currencyIn?.decimals).toString();

    let crossChainParams: any;
    if (amount && currencyOut && currencyIn) {
      crossChainParams = {
        fromTokenAddress: AddressZero,
        toTokenAddress: AddressZero,
        sourceChainId: currencyIn.chainId,
        destinationChainId: currencyOut?.chainId,
        sender: isUTXOSourceChain ? allAccountsByChainId[currencyIn.chainId as UTXOSupportedChainID] : account,
        receiver: isUTXODestinationChain ? allAccountsByChainId[currencyOut.chainId as UTXOSupportedChainID] : account,
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
  const handleFetchInboundAddress = async () => {
    const url = getBTCInboundAddresses();

    const response = await fetch(
      url, {
        method: 'GET',
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY } as any
      });
    const data = await response.json();
    return data;
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
        account: isUTXOSourceChain ? allAccountsByChainId[currencyIn.chainId as UTXOSupportedChainID] : account
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
  const handleSendTransaction = async () => {
    const inboundAddress = await handleFetchInboundAddress();
    const sourceChainId = quote.srcTrade?.tokenFrom?.chainId;
    const currentChainInboundAddress = inboundAddress?.find(
      (address: { chain: any; }) => address.chain === sourceChainId as any
    )?.address;

    const expiry = quote.transactionData.expiry;
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);

    if (currentTimestamp > expiry) {
      throw new Error('Expired transaction');
    }
    const isUTXOSourceChain = Object.values(UTXOSupportedChainID).includes(sourceChainId as any);

    if (isUTXOSourceChain) {
      if (swapData.data.params[0].recipient.toLowerCase() !== currentChainInboundAddress.toLowerCase()) {
        throw new Error('Invalid inbound address, please fetch latest quote');
      }
      const connector = mapChainIdToConnector[sourceChainId as UTXOSupportedChainID];

      connector?.request({ ...swapData.data },
        (error: any) => {
          if (error) {
            console.error(error);
          }
        }
      );
    }
    if (!isUTXOSourceChain) {
      if (swapData.to.toLowerCase() !== currentChainInboundAddress.toLowerCase()) {
        throw new Error('Invalid inbound address, please fetch latest quote');
      }
      provider?.getSigner(account)?.sendTransaction({
        to: swapData.to,
        data: swapData.data,
        value: swapData.nativeValue
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
            onClick={handleConnectAll}>
            {activeXDefiWallet.active ? 'Disconnect' : 'Connect XDeFi Bitcoin'}
          </button>
          {Object.keys(allAccountsByChainId).map((chain, index) => (
            <div key={index}>
              {chain} : {allAccountsByChainId[chain as unknown as UTXOSupportedChainID]}
            </div>
          ))}
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
            customCurrencyList={UTXO_TRADE_CURRENCIES}
            onCurrencySelect={onCurrencyInSelect}
            onCurrencyInput={onCurrencyInInput} />
          <CurrencyInputPanel
            currency={currencyOut}
            amount={currencyAmountOut}
            customCurrencyList={UTXO_TRADE_CURRENCIES}
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

export default TradeUTXO;
