
import React from 'react';
import clsx from 'clsx';
import { useWeb3React } from '@web3-react/core';

import { CHAIN_INFOS } from 'utils/config/chain';
import { SupportedChainID } from 'utils/config/token';
import { useConnectWallet } from 'utils/hooks/web3/use-connect-wallet';

const Wallet = () => {
  const { handleActivate, handleDeactivate } = useConnectWallet();
  const { account, chainId } = useWeb3React();

  const handleConnectWallet = () => {
    handleActivate();
  };

  const handleDisconnectWallet = () => {
    handleDeactivate();
  };
  return (
    <div
      className={clsx(
        'flex',
        'flex-col',
        'items-center',
        'space-y-1'
      )}>
      <button
        style={{ width: 200 }}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={account ? handleDisconnectWallet : handleConnectWallet}>
        {account ? 'Disconnect' : 'Connect Metamask'}
      </button>
      <span>{account} {CHAIN_INFOS[chainId as SupportedChainID]?.name}</span>
    </div>
  );
};

export default Wallet;
