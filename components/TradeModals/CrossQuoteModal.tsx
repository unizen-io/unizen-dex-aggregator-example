import * as React from 'react';
import clsx from 'clsx';
import * as Ariakit from '@ariakit/react';
import { Button } from '@ariakit/react';
import { formatUnits } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';

import { UNIZEN_CONTRACT_ADDRESS } from 'utils/config/address';
import { SupportedChainID } from 'utils/config/token';
import {
  CrossChainQuoteCallData,
  SingleQuoteAPIData
} from 'utils/config/type';
import { getCrossSwapURL } from 'utils/config/urls';
import DEXInfoPanel from './DexInfoPanel';
interface Props {
    quote: CrossChainQuoteCallData | undefined;
    isExactOut: boolean;
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

const CrossQuoteModal = ({ quote, isExactOut }: Props) => {
  const dialog = Ariakit.useDialogStore();
  const { chainId, account, provider } = useWeb3React();
  const [
    selectedSrcQuote,
    setSelectedSrcQuote
  ] = React.useState<SingleQuoteAPIData | undefined>(quote?.srcTrade);
  const [
    selectedDstQuote,
    setSelectedDstQuote
  ] = React.useState<SingleQuoteAPIData | undefined>(quote?.dstTrade);
  const [
    showDexList,
    setShowDexList
  ] = React.useState<'src' | 'dst' | undefined>();
  const [
    swapData,
    setSwapData
  ] = React.useState<any>();

  const handleSelectSrcQuote = (quote: SingleQuoteAPIData) => {
    setSelectedSrcQuote(quote);
  };
  const handleSelectDstQuote = (quote: SingleQuoteAPIData) => {
    setSelectedDstQuote(quote);
  };

  React.useEffect(() => {
    setSelectedSrcQuote(quote?.srcTrade);
    setSelectedDstQuote(quote?.dstTrade);
  }, [quote]);

  const handleConfirmTrade = async () => {
    if (chainId) {
      const url = getCrossSwapURL(chainId);
      const transactionData = {
        ...quote?.transactionData,
        srcCalls: selectedSrcQuote?.call,
        dstCalls: selectedDstQuote?.call
      };

      const params = {
        transactionData: transactionData,
        nativeValue: quote?.nativeValue,
        account
      };
      const data = await fetch(url, {
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
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
      //   gasLimit: swapData.estimateGas, // optional
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
          dexList={quote?.srcTradeList}
          isExactOut={isExactOut} />}
        {isShowingDst && <SourceDEXList
          handleSelect={handleSelectDstQuote}
          dexList={quote?.dstTradeList}
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
