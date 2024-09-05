import StackingPage from "@pages/stacking";
import Footer from "@widgets/Footer";
import Header from "@widgets/Header";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config'

const queryClient = new QueryClient()

export default function App() {
  return (
    <div className="overlay">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Header />
            <StackingPage />
          <Footer />
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
