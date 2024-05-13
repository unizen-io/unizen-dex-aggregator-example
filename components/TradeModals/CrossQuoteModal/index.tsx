import * as Ariakit from '@ariakit/react';
import { Currency } from '@uniswap/sdk-core';

import { CrossChainQuoteCallData } from 'utils/config/type';
import ConfirmTrade from './ConfirmTrade';

interface Props {
    quote: CrossChainQuoteCallData | undefined;
    isExactOut: boolean;
    crossChainParams: any;
    currencyIn: Currency | undefined;
    currencyOut: Currency | undefined;
}

const CrossQuoteModal = ({
  quote,
  isExactOut,
  currencyIn,
  currencyOut
}: Props) => {
  const dialog = Ariakit.useDialogStore();

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
        <ConfirmTrade
          quote={quote}
          isExactOut={isExactOut}
          currencyIn={currencyIn}
          currencyOut={currencyOut} />
        <div>
          <Ariakit.DialogDismiss className='button'>OK</Ariakit.DialogDismiss>
        </div>
      </Ariakit.Dialog>
    </>
  );
};

export default CrossQuoteModal;
