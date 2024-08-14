import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { SolanaWalletProvider } from './contexts/SolanaWalletContext'
import App from './App'

require('@solana/wallet-adapter-react-ui/styles.css')

const wallets = [new PhantomWalletAdapter()]

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaWalletProvider>
            <App />
          </SolanaWalletProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
