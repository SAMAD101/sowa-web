import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Layout from './components/Layout';
import TokenCreator from './components/TokenCreator';
import TokenMinter from './components/TokenMinter';
import TokenTransfer from './components/TokenTransfer';
import TokenBurner from './components/TokenBurner';
import TokenDelegator from './components/TokenDelegator';

const App: React.FC = () => {
  return (
    <Layout>
      <VStack spacing={4} align="stretch">
        <Box>
          <WalletMultiButton />
        </Box>
        <TokenCreator />
        <TokenMinter />
        <TokenTransfer />
        <TokenBurner />
        <TokenDelegator />
      </VStack>
    </Layout>
  );
};

export default App;
