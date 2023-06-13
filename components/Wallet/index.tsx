
import React from 'react';
import { useWeb3React } from '@web3-react/core';

import { useConnectWallet } from 'utils/hooks/web3/use-connect-wallet';

const Wallet = () => {
  const { handleActivate } = useConnectWallet();
  const { account } = useWeb3React();

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
      <span className='ml-2 text-white'>{account}</span>
    </div>
  );
};

export default Wallet;
