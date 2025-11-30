import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, chain } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

// Localhost chain configuration
const localhostChain = {
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'http://127.0.0.1:8545',
  },
  testnet: true,
}

const { chains, provider, webSocketProvider } = configureChains(
  [localhostChain],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'AgentPay',
  chains,
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'demo-project',
})

export const config = {
  chains,
  provider,
  webSocketProvider,
  connectors,
  autoConnect: true,
}