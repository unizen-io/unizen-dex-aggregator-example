import * as React from 'react';
import clsx from 'clsx';
import * as Ariakit from '@ariakit/react';
import { Button } from '@ariakit/react';
import { formatUnits } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';

import { UNIZEN_CONTRACT_ADDRESS } from 'utils/config/address';
import { SupportedChainID } from 'utils/config/token';
import { SingleQuoteAPIData } from 'utils/config/type';
import { getSingleSwapURL } from 'utils/config/urls';
interface Props {
    quote: SingleQuoteAPIData[] | undefined;
    isExactOut: boolean;
}

const SingleQuoteModal = ({ quote, isExactOut }: Props) => {
  const dialog = Ariakit.useDialogStore();
  const { chainId, account, provider } = useWeb3React();
  const [
    selectedQuote,
    setSelectedQuote
  ] = React.useState<SingleQuoteAPIData | undefined>(quote?.[0]);
  const [
    swapData,
    setSwapData
  ] = React.useState<any>();

  const handleSelectQuote = (quote: SingleQuoteAPIData) => {
    setSelectedQuote(quote);
  };

  const deltaAmountLabel = isExactOut ? 'Max Input' : 'Min Receive';

  const handleConfirmTrade = async () => {
    if (selectedQuote && chainId) {
      const url = getSingleSwapURL(chainId);
      const transactionData = selectedQuote?.transactionData;
      const nativeValue = selectedQuote?.nativeValue;

      // eslint-disable-next-line max-len
      const params = {
        transactionData,
        nativeValue,
        account,
        tradeType: selectedQuote.tradeType
      };

      const data = await fetch(url, {
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
      })
        .then(async r => {
          const data = await r.json();

          if (data.error || data.message) {
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
  return (
    <>
      <Ariakit.Button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded  w-80'
        onClick={dialog.show}>
            2. Show Single Quote modal
      </Ariakit.Button>
      <Ariakit.Dialog
        store={dialog}
        className='dialog'>
        <div>
          {quote?.map((item, index) => {
            const deltaToken = isExactOut ? quote?.[0].tokenFrom : quote?.[0].tokenTo;
            return (
              <div
                key={index}
                onClick={() => handleSelectQuote(item)}
                className={clsx(
                  'flex',
                  'flex-col',
                  'space-y-1',
                  'border',
                  'border-gray-300',
                  'p-2',
                  'cursor-pointer',
                  'hover:bg-gray-100'
                )}>
                <span>
                From Amount: {formatUnits(item.fromTokenAmount, item.tokenFrom?.decimals)}
                </span>
                <span>
                To Amount: {formatUnits(item.toTokenAmount, item.tokenTo?.decimals)}
                </span>
                <span>
                  {deltaAmountLabel}: {formatUnits(item.deltaAmount, deltaToken?.decimals)}
                </span>
                <span>
                DEX: {item.protocol?.map((protocol, index) => (
                    <span key={index}>
                      {protocol.name}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
        <div>
          <span>Selected DEX: {selectedQuote?.protocol?.map((protocol, index) => (
            <span key={index}>
              {protocol.name}
            </span>
          ))}
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
        <div>
          <Ariakit.DialogDismiss className='button'>OK</Ariakit.DialogDismiss>
        </div>
      </Ariakit.Dialog>
    </>
  );
};

export default SingleQuoteModal;
