import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import Layout from './components/Layout';
import TokenCreator from './components/TokenCreator';
import TokenMinter from './components/TokenMinter';
import TokenTransfer from './components/TokenTransfer';
import TokenBurner from './components/TokenBurner';
import TokenDelegator from './components/TokenDelegator';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Layout>
        <TokenCreator />
        <TokenMinter />
        <TokenTransfer />
        <TokenBurner />
        <TokenDelegator />
      </Layout>
    </ChakraProvider>
  );
};

export default App;