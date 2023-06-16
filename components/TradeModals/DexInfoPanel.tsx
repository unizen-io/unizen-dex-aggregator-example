import clsx from 'clsx';

import { SingleQuoteAPIData } from 'utils/config/type';

interface Props {
    isExactOut: boolean;
    handleClick: () => void;
    fromAmount: string;
    toAmount: string;
    deltaAmount: string;
    quote: SingleQuoteAPIData;
}

const DEXInfoPanel = ({
  isExactOut,
  handleClick,
  fromAmount,
  toAmount,
  deltaAmount,
  quote
}: Props) => {
  const deltaAmountLabel = isExactOut ? 'Max Input' : 'Min Receive';
  return (
    <div
      onClick={() => handleClick()}
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
      <span>From Amount: {fromAmount}</span>
      <span>To Amount: {toAmount}</span>
      <span>
        {deltaAmountLabel}: {deltaAmount}
      </span>
      <span>
        DEX:{' '}
        {quote.protocol?.map((protocol, index) => (
          <span key={index}>{protocol.name}</span>
        ))}
      </span>
    </div>
  );
};

export default DEXInfoPanel;
