import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text } from '@chakra-ui/react';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { delegateToken } from '@/utils/token';

const TokenDelegator: React.FC = () => {
  const [tokenMint, setTokenMint] = useState('');
  const [amount, setAmount] = useState('');
  const [delegate, setDelegate] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const { connection, publicKey } = useSolanaWallet();

  const handleDelegateToken = async () => {
    if (!publicKey) return;
    try {
      const signature = await delegateToken(connection, publicKey, tokenMint, delegate, parseFloat(amount));
      setTxSignature(signature);
    } catch (error) {
      console.error('Error delegating token:', error);
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Token Mint Address" value={tokenMint} onChange={(e) => setTokenMint(e.target.value)} />
        <Input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input placeholder="Delegate Address" value={delegate} onChange={(e) => setDelegate(e.target.value)} />
        <Button onClick={handleDelegateToken} isDisabled={!publicKey}>Delegate Token</Button>
        {txSignature && <Text>Transaction Signature: {txSignature}</Text>}
      </VStack>
    </Box>
  );
};

export default TokenDelegator;
