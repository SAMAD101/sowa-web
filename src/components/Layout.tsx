import React from 'react';
import { Box, Container, VStack, Heading, Text, Flex, Link } from '@chakra-ui/react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
 
import bg_image from '../assets/bg.jpg'

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { publicKey, balance } = useSolanaWallet();

  return (
    <Box
      minHeight="100vh" bg="gray.100" 
      backgroundImage={bg_image}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundColor="transparent"
    >
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Heading as="h1" size="xl" color="white">Sam Wallet</Heading>
            <WalletMultiButton />
          </Flex>
          
          {publicKey && (
            <Box bg="white" p={4} borderRadius="md" shadow="md">
              <Text>Wallet: {publicKey.toBase58()}</Text>
              <Text>Balance: {balance !== null ? `${balance} SOL` : 'Loading...'}</Text>
            </Box>
          )}
          
          <Box p={6} borderRadius="md" shadow="md" backgroundColor="rgba(255, 255, 255, 0.1)">
            {React.Children.map(children, (child, index) => (
              <Box key={index} p={4} margin={10} borderRadius="md" shadow="sm" backgroundColor="rgba(255, 255, 255, 1)">
                {child}
              </Box>
            ))}
          </Box>

          <Box as="footer" textAlign="center" pt={8}>
            <Text color="white">Sam Wallet made with ♥️ by <Link href="https://x.com/BlueCircle0" isExternal color="blue.500">Sam</Link></Text>
            <Link href="https://solana.com" isExternal color="blue.500">Learn more about Solana</Link>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Layout;