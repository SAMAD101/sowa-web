import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from './components/Layout';
import TokenCreator from './components/TokenCreator';
import TokenMinter from './components/TokenMinter';
import TokenTransfer from './components/TokenTransfer';
import TokenBurner from './components/TokenBurner';
import TokenDelegator from './components/TokenDelegator';

import { TokenProvider, useToken } from './contexts/TokenContext'


const App: React.FC = () => {
  const { tokenMint } = useToken();

  return (
    <ChakraProvider>
      <Layout>
        {
          tokenMint ? (
            <>
              <TokenMinter />
              <TokenTransfer />
              <TokenBurner />
              <TokenDelegator />
            </>
          ) : (
            <TokenCreator />
          )
        }
        
      </Layout>
    </ChakraProvider>
  );
};

export default App;