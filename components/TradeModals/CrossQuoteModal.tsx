import * as React from 'react';
import clsx from 'clsx';
import * as Ariakit from '@ariakit/react';
import { Button } from '@ariakit/react';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';

import { UNIZEN_CONTRACT_ADDRESS } from 'utils/config/address';
import {
  CrossChainTradeProtocol,
  SupportedChainID
} from 'utils/config/token';
import {
  CrossChainQuoteCallData,
  SingleQuoteAPIData
} from 'utils/config/type';
import {
  getCrossQuoteSelectURL,
  getCrossSwapURL
} from 'utils/config/urls';
import DEXInfoPanel from './DexInfoPanel';
interface Props {
    quote: CrossChainQuoteCallData | undefined;
    isExactOut: boolean;
    crossChainParams: any;
}

const SourceDEXList = ({
  dexList,
  isExactOut,
  handleSelect
}: {
    dexList: SingleQuoteAPIData[] | undefined;
    isExactOut: boolean;
    handleSelect: (quote: SingleQuoteAPIData) => void;
}) => {
  if (!dexList) return null;
  return (
    <div
      className={clsx(
        'flex',
        'flex-col',
        'space-y-1'
      )}>
      {dexList.map((quote, index) => {
        const deltaToken = isExactOut ? quote?.tokenFrom : quote?.tokenTo;
        return (
          <DEXInfoPanel
            key={index}
            isExactOut={isExactOut}
            quote={quote}
            fromAmount={formatUnits(quote?.fromTokenAmount, quote?.tokenFrom?.decimals)}
            toAmount={formatUnits(quote?.toTokenAmount, quote?.tokenTo?.decimals)}
            deltaAmount={formatUnits(quote?.deltaAmount, deltaToken?.decimals)}
            handleClick={() => handleSelect(quote)} />
        );
      })}
    </div>
  );
};

const CrossQuoteModal = ({ quote, isExactOut, crossChainParams }: Props) => {
  const dialog = Ariakit.useDialogStore();
  const { chainId, account, provider } = useWeb3React();
  const [
    selectedSrcQuote,
    setSelectedSrcQuote
  ] = React.useState<SingleQuoteAPIData | undefined>();
  const [
    selectedDstQuote,
    setSelectedDstQuote
  ] = React.useState<SingleQuoteAPIData | undefined>();
  const [
    userSelectedQuoteData,
    setUserSelectedQuoteData
  ] = React.useState<any>();
  const [
    showDexList,
    setShowDexList
  ] = React.useState<'src' | 'dst' | undefined>();
  const [
    swapData,
    setSwapData
  ] = React.useState<any>();

  const handleSelectSrcQuote = async (quote: SingleQuoteAPIData) => {
    setSelectedSrcQuote(quote);
    if (!isExactOut) {
      const url = getCrossQuoteSelectURL({
        ...crossChainParams,
        stableAmount: quote.toTokenAmount,
        tradeProtocol: CrossChainTradeProtocol.CROSS_CHAIN_STARGATE,
        uuid: ''
      });
      await fetch(url, {
        method: 'GET',
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY } as any
      })
        .then(async r => {
          const data = await r.json();

          if (data.statusCode) {
            throw new Error(data.message);
          }
          setUserSelectedQuoteData(data);
          return data;
        });
    }
  };
  const handleSelectDstQuote = async (quote: SingleQuoteAPIData) => {
    setSelectedDstQuote(quote);
    if (isExactOut) {
      const url = getCrossQuoteSelectURL({
        ...crossChainParams,
        stableAmount: quote.fromTokenAmount,
        tradeProtocol: CrossChainTradeProtocol.CROSS_CHAIN_STARGATE,
        uuid: ''
      });
      await fetch(url, {
        method: 'GET',
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY } as any
      })
        .then(async r => {
          const data = await r.json();

          if (data.statusCode) {
            throw new Error(data.message);
          }
          setUserSelectedQuoteData(data);
          return data;
        });
    }
  };

  const userSelectedInfo = React.useMemo(() => {
    if (!isExactOut) {
      return userSelectedQuoteData?.transactionData?.amountInfo;
    }
    if (isExactOut) {
      return userSelectedQuoteData?.transactionData?.amountInfo;
    }
  }, [
    isExactOut,
    userSelectedQuoteData?.transactionData?.amountInfo
  ]);

  const txData = React.useMemo(() => ({
    ...quote?.transactionData,
    srcCalls:
    selectedSrcQuote?.transactionData?.call ??
    (userSelectedQuoteData?.transactionData?.call ?? quote?.transactionData?.srcCalls),
    dstCalls:
    selectedDstQuote?.transactionData?.call ??
    (userSelectedQuoteData?.transactionData?.call ?? quote?.transactionData?.dstCalls),
    params: {
      ...quote?.transactionData?.params,
      ...userSelectedQuoteData?.transactionData?.params,
      ...userSelectedInfo
    }
  }), [
    quote?.transactionData,
    selectedSrcQuote?.transactionData?.call,
    userSelectedQuoteData?.transactionData?.call,
    userSelectedQuoteData?.transactionData?.params,
    selectedDstQuote?.transactionData?.call,
    userSelectedInfo
  ]);

  let nativeValue: string | undefined = undefined;
  if (userSelectedInfo && quote) {
    nativeValue = BigNumber.from(userSelectedInfo?.amount).add(quote.nativeFee).toString();
  } else if (userSelectedQuoteData && quote) {
    nativeValue = BigNumber.from(userSelectedQuoteData.nativeValue).add(quote.nativeFee).toString();
  } else if (quote) {
    nativeValue = quote.nativeValue;
  }

  const crossChainQuoteData: CrossChainQuoteCallData | undefined = React.useMemo(() =>
    (quote ? {
      ...quote,
      ...userSelectedQuoteData,
      transactionData: txData,
      nativeValue
    } as CrossChainQuoteCallData : undefined)
  , [
    quote,
    userSelectedQuoteData,
    txData,
    nativeValue
  ]);

  const handleConfirmTrade = async () => {
    if (chainId) {
      const url = getCrossSwapURL(chainId);

      const params = {
        transactionData: txData,
        nativeValue: nativeValue,
        account
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
    const contractAddress = UNIZEN_CONTRACT_ADDRESS[swapData.contractVersion as 'v1' | 'v2'][chainId as SupportedChainID];

    provider?.getSigner().sendTransaction({
      from: account,
      to: contractAddress,
      data: swapData.data,
      value: swapData.nativeValue
    });
  };

  const isShowingSrc = showDexList === 'src';
  const isShowingDst = showDexList === 'dst';

  return (
    <>
      <Ariakit.Button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-80'
        onClick={dialog.show}>
            2. Show Cross Quote modal
      </Ariakit.Button>
      <Ariakit.Dialog
        store={dialog}
        className='dialog'>
        <div
          className={clsx(
            'flex',
            'flex-col'
          )}>
          <div
            className={clsx(
              'flex',
              'justify-between'
            )}>
            <span>
            Selected Source DEX: {selectedSrcQuote?.protocol?.map((protocol, index) => (
                <span key={index}>
                  {protocol.name}
                </span>
              ))}
            </span>
            <Button
              onClick={() => setShowDexList(isShowingSrc ? undefined : 'src')}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80'>
              {isShowingSrc ? 'Hide' : 'Show'} Source DEX List
            </Button>
          </div>
          <div
            className={clsx(
              'flex',
              'justify-between'
            )}>
            <span>
            Selected Destination DEX: {selectedDstQuote?.protocol?.map((protocol, index) => (
                <span key={index}>
                  {protocol.name}
                </span>
              ))}
            </span>
            <Button
              onClick={() => setShowDexList(isShowingDst ? undefined : 'dst')}
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80'>
              {isShowingDst ? 'Hide' : 'Show'}  Destination DEX List
            </Button>
          </div>
        </div>
        <div>
          <span>
                Expected Amount: {isExactOut ?
              formatUnits(selectedSrcQuote?.fromTokenAmount || 0, selectedSrcQuote?.tokenFrom?.decimals) :
              formatUnits(selectedDstQuote?.toTokenAmount || 0, selectedDstQuote?.tokenTo?.decimals)
            }
          </span>
        </div>
        {isShowingSrc && <SourceDEXList
          handleSelect={handleSelectSrcQuote}
          dexList={crossChainQuoteData?.srcTradeList}
          isExactOut={isExactOut} />}
        {isShowingDst && <SourceDEXList
          handleSelect={handleSelectDstQuote}
          dexList={crossChainQuoteData?.dstTradeList}
          isExactOut={isExactOut} />}
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
        <div>
          <Ariakit.DialogDismiss className='button'>OK</Ariakit.DialogDismiss>
        </div>
      </Ariakit.Dialog>
    </>
  );
};

export default CrossQuoteModal;
