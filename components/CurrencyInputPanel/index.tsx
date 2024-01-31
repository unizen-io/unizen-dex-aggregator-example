
import React from 'react';
import clsx from 'clsx';
import * as Ariakit from '@ariakit/react';
import { Currency } from '@uniswap/sdk-core';

import { CHAIN_INFOS } from 'utils/config/chain';
import { SupportedChainID } from 'utils/config/token';
import useCurrencyList from 'utils/hooks/web3/use-currency-list';

interface Props {
    currency: Currency | undefined;
    amount: string | undefined;
    onCurrencySelect: (currency: Currency) => void;
    onCurrencyInput: (currencyAmount: string | undefined) => void;
    customCurrencyList?: Currency[];
}

function CurrencySelect({
  currency,
  customCurrencyList,
  onCurrencySelect
}: Partial<Props>) {
  const currencyList = useCurrencyList();
  const select = Ariakit.useSelectStore({ defaultValue: '', value: currency ? `${currency?.symbol} ${currency?.chainId}` : '' });

  const finalCurrencyList = customCurrencyList ?? currencyList;
  return (
    <div className='wrapper'>
      <Ariakit.Select
        store={select}
        className='select' />
      <Ariakit.SelectPopover
        store={select}
        gutter={4}
        sameWidth
        className='popover'>
        {finalCurrencyList.map(currency => (
          <Ariakit.SelectItem
            onClick={() => onCurrencySelect ? onCurrencySelect(currency) : {}}
            className='select-item'
            key={`${currency.symbol}-${currency.chainId}`}>
            <div
              className={clsx(
                'flex',
                'justify-between',
                'items-center',
                'w-full'
              )}>
              <p>{currency.symbol}</p>
              <p> {CHAIN_INFOS[currency.chainId as SupportedChainID]?.shortName}</p>
            </div>
          </Ariakit.SelectItem>
        ))}
      </Ariakit.SelectPopover>
    </div>
  );
}

const CurrencyInputPanel = ({
  currency,
  amount,
  customCurrencyList,
  onCurrencySelect,
  onCurrencyInput
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    onCurrencyInput(value);
  };
  return (
    <div
      className={clsx(
        'flex',
        'flex-row',
        'items-center',
        'space-x-4'
      )}>
      <input
        type='number'
        value={amount || 0}
        onChange={handleChange} />
      <CurrencySelect
        currency={currency}
        customCurrencyList={customCurrencyList}
        onCurrencySelect={onCurrencySelect} />
    </div>
  );
};

export default CurrencyInputPanel;
