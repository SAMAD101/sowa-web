import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
import { delegateToken } from '../utils/token';
import { PublicKey } from '@solana/web3.js';

const TokenDelegator: React.FC = () => {
  const [tokenMint, setTokenMint] = useState('');
  const [amount, setAmount] = useState('');
  const [delegate, setDelegate] = useState('');
  const { connection, publicKey, sendTransaction } = useSolanaWallet();
  const toast = useToast();

  const handleDelegateToken = async () => {
    if (!publicKey) return;
    try {
      const mintPublicKey = new PublicKey(tokenMint);
      const delegatePublicKey = new PublicKey(delegate);
      const signature = await delegateToken(
        connection,
        publicKey,
        mintPublicKey,
        delegatePublicKey,
        parseFloat(amount),
        sendTransaction
      );
      toast({
        title: 'Tokens Delegated',
        description: `Delegated ${amount} tokens. Tx: ${signature}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error delegating token:', error);
      toast({
        title: 'Error',
        description: 'Failed to delegate tokens',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Delegate Tokens</Text>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Token Mint Address" value={tokenMint} onChange={(e) => setTokenMint(e.target.value)} />
        <Input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input placeholder="Delegate Address" value={delegate} onChange={(e) => setDelegate(e.target.value)} />
        <Button onClick={handleDelegateToken} isDisabled={!publicKey || !tokenMint || !amount || !delegate}>Delegate Token</Button>
      </VStack>
    </Box>
  );
};

export default TokenDelegator;