import { getThorChainPools } from 'utils/config/urls';

const useThorChainPools = async () => {
  try {
    const response = await fetch(getThorChainPools());
    if (!response.ok) {
      throw new Error('Failed to fetch ThorChain pools');
    }
    const thorchainAssets = await response.json();
    return { thorchainAssets };
  } catch (error) {
    throw new Error(`Error: ${(error as any).message}`);
  }
};

export { useThorChainPools };
