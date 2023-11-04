import * as React from 'react';
import clsx from 'clsx';
import { Button } from '@ariakit/react';
import { formatUnits } from '@ethersproject/units';
import { Currency } from '@uniswap/sdk-core';
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
  getCrossSwapURL,
  getTransactionDataCross
} from 'utils/config/urls';
import SelectionDEXList from './SelectionDEXList';

interface Props {
    quote: CrossChainQuoteCallData | undefined;
    isExactOut: boolean;
    crossChainParams: any;
    currencyIn: Currency | undefined;
    currencyOut: Currency | undefined;
}

const AdvancedVersion = ({
  quote,
  isExactOut,
  crossChainParams,
  currencyIn,
  currencyOut
}: Props) => {
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
  const [
    transactionData,
    setTransactionData
  ] = React.useState<any>();

  React.useEffect(() => {
    if (quote) {
      setSelectedSrcQuote(quote?.srcTrade);
      setSelectedDstQuote(quote?.dstTrade);
    }
  }, [quote]);

  const finalCrossChainQuoteData: CrossChainQuoteCallData | undefined = {
    ...quote,
    ...userSelectedQuoteData
  };

  const fetchTransactionData = async (params: any) => {
    if (chainId) {
      const txDataURL = getTransactionDataCross(chainId);

      await fetch(txDataURL, {
        method: 'POST',
        headers: {
          'x-api-key': process.env.NEXT_PUBLIC_X_API_KEY,
          'Content-Type': 'application/json'
        } as any,
        body: JSON.stringify(params)
      })
        .then(async r => {
          const data = await r.json();

          if (data.statusCode) {
            throw new Error(data.message);
          }
          setTransactionData(data);
        })
        .catch(e => {
          console.error(e);
        });
    }
  };

  const handleSelectSrcQuote = async (selectedDEXData: SingleQuoteAPIData) => {
    setSelectedSrcQuote(selectedDEXData);
    if (isExactOut) {
      const params = {
        transactionData: quote?.transactionData,
        nativeFee: quote?.nativeFee,
        userSelectedQuoteData: userSelectedQuoteData,
        srcQuoteTxData: selectedDEXData?.transactionData,
        dstQuoteTxData: selectedDstQuote?.transactionData,
        nativeValue: quote?.nativeValue,
        tradeParams: quote?.tradeParams
      };

      fetchTransactionData(params);
    }
    if (!isExactOut) {
      const url = getCrossQuoteSelectURL({
        ...crossChainParams,
        stableAmount: selectedDEXData.toTokenAmount,
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
          setSelectedDstQuote(data?.dstTrade);
          const params = {
            transactionData: quote?.transactionData,
            nativeFee: quote?.nativeFee,
            userSelectedQuoteData: data,
            srcQuoteTxData: selectedDEXData?.transactionData,
            dstQuoteTxData: selectedDstQuote?.transactionData,
            nativeValue: quote?.nativeValue,
            tradeParams: quote?.tradeParams
          };

          fetchTransactionData(params);
          return data;
        });
    }
  };
  const handleSelectDstQuote = async (selectedDEXData: SingleQuoteAPIData) => {
    setSelectedDstQuote(selectedDEXData);
    if (!isExactOut) {
      const params = {
        transactionData: quote?.transactionData,
        nativeFee: quote?.nativeFee,
        userSelectedQuoteData: userSelectedQuoteData,
        srcQuoteTxData: selectedSrcQuote?.transactionData,
        dstQuoteTxData: selectedDEXData?.transactionData,
        nativeValue: quote?.nativeValue,
        tradeParams: quote?.tradeParams
      };

      fetchTransactionData(params);
    }
    if (isExactOut) {
      const url = getCrossQuoteSelectURL({
        ...crossChainParams,
        stableAmount: selectedDEXData.fromTokenAmount,
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
          setSelectedSrcQuote(data?.srcTrade);

          const params = {
            transactionData: quote?.transactionData,
            nativeFee: quote?.nativeFee,
            userSelectedQuoteData: data,
            srcQuoteTxData: selectedSrcQuote?.transactionData,
            dstQuoteTxData: selectedDEXData?.transactionData,
            nativeValue: quote?.nativeValue,
            tradeParams: quote?.tradeParams
          };
          fetchTransactionData(params);
          return data;
        });
    }
  };

  const handleConfirmTrade = async () => {
    if (chainId) {
      const url = getCrossSwapURL(chainId);

      if (transactionData) {
        const params = {
          transactionData: transactionData,
          nativeValue: transactionData?.nativeValue,
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
      if (!transactionData) {
        const params = {
          transactionData: quote?.transactionData,
          nativeFee: quote?.nativeFee,
          userSelectedQuoteData: userSelectedQuoteData,
          srcQuoteTxData: selectedSrcQuote?.transactionData,
          dstQuoteTxData: selectedDstQuote?.transactionData,
          nativeValue: quote?.nativeValue,
          tradeParams: quote?.tradeParams
        };
        await fetchTransactionData(params);

        const txParams = {
          transactionData: transactionData,
          nativeValue: transactionData?.nativeValue,
          account
        };

        const data = await fetch(url, {
          body: JSON.stringify(txParams),
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
            formatUnits(selectedSrcQuote?.fromTokenAmount || 0, currencyIn?.decimals) :
            formatUnits(selectedDstQuote?.toTokenAmount || 0, currencyOut?.decimals)
          }
        </span>
      </div>
      {isShowingSrc && <SelectionDEXList
        handleSelect={handleSelectSrcQuote}
        dexList={finalCrossChainQuoteData?.srcTradeList}
        isExactOut={isExactOut} />}
      {isShowingDst && <SelectionDEXList
        handleSelect={handleSelectDstQuote}
        dexList={finalCrossChainQuoteData?.dstTradeList}
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
    </>
  );
};

export default AdvancedVersion;
