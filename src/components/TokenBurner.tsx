import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text } from '@chakra-ui/react';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { burnToken } from '@/utils/token';

const TokenBurner: React.FC = () => {
  const [tokenMint, setTokenMint] = useState('');
  const [amount, setAmount] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const { connection, publicKey } = useSolanaWallet();

  const handleBurnToken = async () => {
    if (!publicKey) return;
    try {
      const signature = await burnToken(connection, publicKey, tokenMint, parseFloat(amount));
      setTxSignature(signature);
    } catch (error) {
      console.error('Error burning token:', error);
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Token Mint Address" value={tokenMint} onChange={(e) => setTokenMint(e.target.value)} />
        <Input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Button onClick={handleBurnToken} isDisabled={!publicKey}>Burn Token</Button>
        {txSignature && <Text>Transaction Signature: {txSignature}</Text>}
      </VStack>
    </Box>
  );
};

export default TokenBurner;
