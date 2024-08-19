import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
import { burnToken } from '../utils/token';
import { PublicKey } from '@solana/web3.js';

const TokenBurner: React.FC = () => {
  const [tokenMint, setTokenMint] = useState('');
  const [amount, setAmount] = useState('');
  const { connection, publicKey, sendTransaction } = useSolanaWallet();
  const toast = useToast();

  const handleBurnToken = async () => {
    if (!publicKey) return;
    try {
      const mintPublicKey = new PublicKey(tokenMint);
      const signature = await burnToken(
        connection,
        publicKey,
        mintPublicKey,
        parseFloat(amount),
        sendTransaction
      );
      toast({
        title: 'Tokens Burned',
        description: `Burned ${amount} tokens. Tx: ${signature}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error burning token:', error);
      toast({
        title: 'Error',
        description: 'Failed to burn tokens',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Burn Tokens</Text>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Token Mint Address" value={tokenMint} onChange={(e) => setTokenMint(e.target.value)} />
        <Input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button onClick={handleBurnToken} isDisabled={!publicKey || !tokenMint || !amount}>Burn Token</Button>
      </VStack>
    </Box>
  );
};

export default TokenBurner;