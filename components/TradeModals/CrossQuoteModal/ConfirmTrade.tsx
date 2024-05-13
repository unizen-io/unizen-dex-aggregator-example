import * as React from 'react';
import clsx from 'clsx';
import { Button } from '@ariakit/react';
import { formatUnits } from '@ethersproject/units';
import { Currency } from '@uniswap/sdk-core';
import { useWeb3React } from '@web3-react/core';

import { UNIZEN_CONTRACT_ADDRESS } from 'utils/config/address';
import { SupportedChainID } from 'utils/config/token';
import {
  CrossChainQuoteCallData,
  SingleQuoteAPIData
} from 'utils/config/type';
import { getCrossSwapURL } from 'utils/config/urls';

interface Props {
    quote: CrossChainQuoteCallData | undefined;
    isExactOut: boolean;
    currencyIn: Currency | undefined;
    currencyOut: Currency | undefined;
}

const ConfirmTrade = ({
  quote,
  isExactOut,
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
    swapData,
    setSwapData
  ] = React.useState<any>();

  React.useEffect(() => {
    if (quote) {
      setSelectedSrcQuote(quote?.srcTrade);
      setSelectedDstQuote(quote?.dstTrade);
    }
  }, [quote]);

  const handleConfirmTrade = async () => {
    if (chainId) {
      const url = getCrossSwapURL(chainId);

      const params = {
        transactionData: quote?.transactionData,
        nativeValue: quote?.nativeValue,
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
    const contractAddress = UNIZEN_CONTRACT_ADDRESS[swapData.contractVersion as 'v1' | 'v2' | 'v3'][chainId as SupportedChainID];

    provider?.getSigner().sendTransaction({
      from: account,
      to: contractAddress,
      data: swapData.data,
      value: swapData.nativeValue
    });
  };

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

export default ConfirmTrade;
