
import React from 'react';
import { useWeb3React } from '@web3-react/core';

import { CHAIN_INFOS } from 'utils/config/chain';
import { SupportedChainID } from 'utils/config/token';
import { useConnectWallet } from 'utils/hooks/web3/use-connect-wallet';

const Wallet = () => {
  const { handleActivate } = useConnectWallet();
  const { account, chainId } = useWeb3React();

  const handleConnectWallet = () => {
    handleActivate();
  };
  return (
    <div className='flex flex-row items-center'>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={handleConnectWallet}>
        Connect Wallet
      </button>
      <span>{account} {CHAIN_INFOS[chainId as SupportedChainID]?.name}</span>
    </div>
  );
};

export default Wallet;
