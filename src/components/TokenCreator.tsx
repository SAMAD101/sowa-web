import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
import { createMint } from '../utils/token';

const TokenCreator: React.FC = () => {
  const [decimals, setDecimals] = useState(9);
  const [tokenMint, setTokenMint] = useState('');
  const { connection, publicKey, sendTransaction } = useSolanaWallet();
  const toast = useToast();

  const handleCreateToken = async () => {
    if (!publicKey) return;
    try {
      const mint = await createMint(
        connection,
        publicKey,
        publicKey,
        publicKey,
        decimals,
        sendTransaction
      );
      setTokenMint(mint.toBase58);
      toast({
        title: 'Token Created',
        description: `New token created with mint: ${mint.toBase58()}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating token:', error);
      toast({
        title: 'Error',
        description: 'Failed to create token',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Create New Token Mint</Text>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Decimal" value={decimals} onChange={(e) => setDecimals(+e.target.value)} />
        <Button onClick={handleCreateToken} isDisabled={!publicKey || !decimals}>Create Token</Button>
        {tokenMint && <Text>Token Mint: {tokenMint}</Text>}
      </VStack>
    </Box>
  );
};

export default TokenCreator;