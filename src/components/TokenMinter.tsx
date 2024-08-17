import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
import { mintToken } from '../utils/token';

const TokenMinter: React.FC = () => {
  const [tokenMint, setTokenMint] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const { connection, publicKey } = useSolanaWallet();
  const toast = useToast();

  const handleMintToken = async () => {
    if (!publicKey) return;
    try {
      const signature = await mintToken(connection, publicKey, tokenMint, recipient, parseFloat(amount));
      toast({
        title: 'Tokens Minted',
        description: `Minted ${amount} tokens. Tx: ${signature}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error minting token:', error);
      toast({
        title: 'Error',
        description: 'Failed to mint tokens',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Mint Tokens</Text>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Token Mint Address" value={tokenMint} onChange={(e) => setTokenMint(e.target.value)} />
        <Input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <Button onClick={handleMintToken} isDisabled={!publicKey || !tokenMint || !amount || !recipient}>Mint Token</Button>
      </VStack>
    </Box>
  );
};

export default TokenMinter;