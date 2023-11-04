import * as React from 'react';
import clsx from 'clsx';
import * as Ariakit from '@ariakit/react';
import { Currency } from '@uniswap/sdk-core';

import { CrossChainQuoteCallData } from 'utils/config/type';
import AdvancedVersion from './AdvancedVersion';
import BasicVersion from './BasicVersion';

enum Version {
    Basic = 'basic',
    Advanced = 'advanced'
}

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
  crossChainParams,
  currencyIn,
  currencyOut
}: Props) => {
  const dialog = Ariakit.useDialogStore();

  const [
    mode,
    setMode
  ] = React.useState<Version>(Version.Basic);

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
        <Ariakit.TabProvider defaultSelectedId={mode}>
          <Ariakit.TabList
            className='tab-list'
            aria-label='Version'>
            {Object.values(Version).map(version => (
              <Ariakit.Tab
                key={version}
                className={clsx(
                  'tab',
                  'rounded-t',
                  'rounded-l',
                  'text-sm',
                  'font-medium',
                  'px-4',
                  'py-2',
                  'leading-5',
                  'outline-none',
                  'ring-2',
                  'ring-blue-500',
                  'ring-opacity-50',
                  mode === version && 'bg-blue-500'
                )}
                as='button'
                onClick={() => setMode(version)}
                id={version}>
                {version}
              </Ariakit.Tab>
            ))}
          </Ariakit.TabList>
          <Ariakit.TabPanel tabId={Version.Basic}>
            <BasicVersion
              quote={quote}
              isExactOut={isExactOut}
              currencyIn={currencyIn}
              currencyOut={currencyOut} />
          </Ariakit.TabPanel>
          <Ariakit.TabPanel tabId={Version.Advanced}>
            <AdvancedVersion
              quote={quote}
              isExactOut={isExactOut}
              crossChainParams={crossChainParams}
              currencyIn={currencyIn}
              currencyOut={currencyOut} />
          </Ariakit.TabPanel>
        </Ariakit.TabProvider>
        <div>
          <Ariakit.DialogDismiss className='button'>OK</Ariakit.DialogDismiss>
        </div>
      </Ariakit.Dialog>
    </>
  );
};

export default CrossQuoteModal;
