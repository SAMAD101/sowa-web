import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text } from '@chakra-ui/react';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { createToken } from '@/utils/token';

const TokenCreator: React.FC = () => {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenMint, setTokenMint] = useState('');
  const { connection, publicKey } = useSolanaWallet();

  const handleCreateToken = async () => {
    if (!publicKey) return;
    try {
      const mint = await createToken(connection, publicKey, tokenName, tokenSymbol);
      setTokenMint(mint.toBase58());
    } catch (error) {
      console.error('Error creating token:', error);
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Token Name" value={tokenName} onChange={(e) => setTokenName(e.target.value)} />
        <Input placeholder="Token Symbol" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} />
        <Button onClick={handleCreateToken} isDisabled={!publicKey}>Create Token</Button>
        {tokenMint && <Text>Token Mint: {tokenMint}</Text>}
      </VStack>
    </Box>
  );
};

export default TokenCreator;
