import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text } from '@chakra-ui/react';
import { useSolanaWallet } from '@/contexts/SolanaWalletContext';
import { transferToken } from '@/utils/token';

const TokenTransfer: React.FC = () => {
  const [tokenMint, setTokenMint] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const { connection, publicKey } = useSolanaWallet();

  const handleTransferToken = async () => {
    if (!publicKey) return;
    try {
      const signature = await transferToken(connection, publicKey, tokenMint, recipient, parseFloat(amount));
      setTxSignature(signature);
    } catch (error) {
      console.error('Error transferring token:', error);
    }
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Input placeholder="Token Mint Address" value={tokenMint} onChange={(e) => setTokenMint(e.target.value)} />
        <Input placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Input placeholder="Recipient Address" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        <Button onClick={handleTransferToken} isDisabled={!publicKey}>Transfer Token</Button>
        {txSignature && <Text>Transaction Signature: {txSignature}</Text>}
      </VStack>
    </Box>
  );
};

export default TokenTransfer;
