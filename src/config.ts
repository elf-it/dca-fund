import { http, createConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: '93da95e9bf6977fd85fcba9ece680403',
    }),
    //metaMask(),
  ],
  transports: {
    //[bsc.id]: http(),
    [bscTestnet.id]: http(),
  },
})