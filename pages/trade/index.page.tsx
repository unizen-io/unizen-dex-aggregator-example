import * as React from 'react';
import clsx from 'clsx';
import * as Ariakit from '@ariakit/react';

import TradeEVM from './TradeEVM';
import TradeBTC from './TradeUTXO';

const Trade = () => {
  const [
    mode,
    setMode
  ] = React.useState<'evm' | 'utxo'>('evm');

  return (
    <div
      className={clsx(
        'flex',
        'flex-col',
        'items-center',
        'justify-center'
      )}>
      <Ariakit.TabProvider defaultSelectedId={mode}>
        <Ariakit.TabList
          className='tab-list'
          aria-label='Version'>
          <Ariakit.Tab
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
              mode === 'evm' && 'bg-blue-500'
            )}
            as='button'
            onClick={() => setMode('evm')}
            id='evm'>
            evm trade
          </Ariakit.Tab>
          <Ariakit.Tab
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
              mode === 'utxo' && 'bg-blue-500'
            )}
            as='button'
            onClick={() => setMode('utxo')}
            id='utxo'>
            utxo trade
          </Ariakit.Tab>
        </Ariakit.TabList>
        <Ariakit.TabPanel tabId='evm'>
          <TradeEVM />
        </Ariakit.TabPanel>
        <Ariakit.TabPanel tabId='utxo'>
          <TradeBTC />
        </Ariakit.TabPanel>
      </Ariakit.TabProvider>
    </div>
  );
};

export default Trade;
