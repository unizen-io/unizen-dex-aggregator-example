import * as React from 'react';
import { Button } from '@ariakit/react';
import { BigNumber } from '@ethersproject/bignumber';
import { MaxUint256 } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { Currency } from '@uniswap/sdk-core';
import { useWeb3React } from '@web3-react/core';

import ERC20_ABI from 'utils/abis/erc20.json';

interface Props {
    currency: Currency | undefined;
    amount: string | undefined;
    contractAddress: string | undefined;
}

const ApproveButton = ({ currency, amount, contractAddress }: Props) => {
  const [
    isApproved,
    setIsApproved
  ] = React.useState<boolean>(false);
  const [
    isApproving,
    setIsApproving
  ] = React.useState<boolean>(false);

  const { provider, account } = useWeb3React();
  React.useEffect(() => {
    const fetchApprovalAmount = async () => {
      if (currency?.isNative) {
        return MaxUint256;
      }
      if (!provider || !currency || !contractAddress) {
        return;
      }

      const contract = new Contract(currency.address, ERC20_ABI, provider);
      const allowance = await contract.allowance(account, contractAddress);
      if (allowance.gte(BigNumber.from(amount))) {
        setIsApproved(true);
      }
    };

    fetchApprovalAmount();
  }, [
    currency,
    provider,
    account,
    contractAddress,
    amount
  ]);

  const handleApprove = async () => {
    if (!provider || !currency || !account || currency.isNative) {
      return;
    }

    const contract = new Contract(currency.address, ERC20_ABI, provider.getSigner());
    setIsApproving(true);
    const tx = await contract.approve(contractAddress, MaxUint256);
    await tx.wait();
    setIsApproving(false);
  };

  if (isApproved || currency?.isNative || !contractAddress) {
    return null;
  }
  return (
    <Button
      onClick={handleApprove}
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-80'>
      {isApproving ? 'Approving' : 'Approve'}
    </Button>
  );
};

export default ApproveButton;
