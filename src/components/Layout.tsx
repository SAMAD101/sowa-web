import React from 'react';
import { Box, Container, VStack, Heading, Text, Flex, Link } from '@chakra-ui/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { publicKey, balance } = useSolanaWallet();

  return (
    <Box minHeight="100vh" bg="gray.100">
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="xl">Sam Wallet</Heading>
            <WalletMultiButton />
          </Flex>
          
          {publicKey && (
            <Box bg="white" p={4} borderRadius="md" shadow="md">
              <Text>Wallet: {publicKey.toBase58()}</Text>
              <Text>Balance: {balance !== null ? `${balance} SOL` : 'Loading...'}</Text>
            </Box>
          )}

          <Box bg="white" p={6} borderRadius="md" shadow="md">
            {children}
          </Box>

          <Box as="footer" textAlign="center" pt={8}>
            <Text>Sam made with love by <Link href="https://x.com/BlueCircle0" isExternal color="blue.500">Sam</Link></Text>
            <Link href="https://solana.com" isExternal color="blue.500">Learn more about Solana</Link>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Layout;