import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, useToast } from '@chakra-ui/react';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
import { mintToken } from '../utils/token';
import { PublicKey } from '@solana/web3.js';
import { useToken } from '../contexts/TokenContext'

const TokenMinter: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const { tokenMint } = useToken();
  const { connection, publicKey, sendTransaction } = useSolanaWallet();
  const toast = useToast();

  const handleMintToken = async () => {
    if (!publicKey) return;
    try {
      const mintPublicKey = tokenMint ? new PublicKey(tokenMint) : new PublicKey('');
      const destination = new PublicKey(recipient);
      const signature = await mintToken(
        connection,
        publicKey,
        mintPublicKey,
        destination,
        publicKey,
        parseFloat(amount),
        sendTransaction);
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
        <Input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <Button onClick={handleMintToken} isDisabled={!publicKey || !tokenMint || !amount || !recipient}>Mint Token</Button>
      </VStack>
    </Box>
  );
};

export default TokenMinter;