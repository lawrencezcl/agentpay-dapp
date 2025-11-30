import { connectorsForWallets, wallet } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { mainnet, polygon, arbitrum, base } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo-project';

const connectors = connectorsForWallets(
  [
    wallet.metaMask(),
    wallet.walletConnect({ projectId }),
    wallet.coinbase(),
    wallet.injected(),
  ],
  {
    appName: 'AgentPay',
    projectId,
  }
);

export const config = createConfig({
  connectors,
  chains: [
    {
      id: 31337,
      name: 'Localhost',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['http://127.0.0.1:8545'] },
      },
      testnet: true,
    }
  ],
  transports: {
    [31337]: http(),
  },
});