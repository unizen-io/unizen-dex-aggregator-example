
import React from 'react';
import clsx from 'clsx';
import * as Ariakit from '@ariakit/react';
import { Currency } from '@uniswap/sdk-core';

import useCurrencyList from 'utils/hooks/web3/use-currency-list';

interface Props {
    currency: Currency | undefined;
    amount: string | undefined;
    onCurrencySelect: (currency: Currency) => void;
    onCurrencyInput: (currencyAmount: string | undefined) => void;
}

function CurrencySelect({
  currency,
  onCurrencySelect
}: Partial<Props>) {
  const currencyList = useCurrencyList();
  const select = Ariakit.useSelectStore({ defaultValue: '', value: currency ? `${currency?.symbol} ${currency?.chainId}` : '' });

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
        {currencyList.map(currency => (
          <Ariakit.SelectItem
            onClick={() => onCurrencySelect ? onCurrencySelect(currency) : {}}
            className='select-item'
            key={`${currency.symbol}-${currency.chainId}`}>
            <button>{currency.symbol} {currency.chainId}</button>
          </Ariakit.SelectItem>
        ))}
      </Ariakit.SelectPopover>
    </div>
  );
}

const CurrencyInputPanel = ({
  currency,
  amount,
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
        onCurrencySelect={onCurrencySelect} />
    </div>
  );
};

export default CurrencyInputPanel;
