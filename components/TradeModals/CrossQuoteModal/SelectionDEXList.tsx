import clsx from 'clsx';
import { formatUnits } from '@ethersproject/units';

import { SingleQuoteAPIData } from 'utils/config/type';
import DEXInfoPanel from '../DexInfoPanel';

const SelectionDEXList = ({
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

export default SelectionDEXList;
