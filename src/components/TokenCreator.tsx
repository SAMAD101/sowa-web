import React, { useState } from 'react';
import { Box, Button, VStack, Text, useToast, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { useSolanaWallet } from '../contexts/SolanaWalletContext';
import { createMint } from '../utils/token';
import { useToken } from '../contexts/TokenContext';

const TokenCreator: React.FC = () => {
  const [decimals, setDecimals] = useState(9);
  const { setTokenMint } = useToken();
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
      setTokenMint(mint);
      toast({
        title: 'Token Created',
        description: `New token created with mint: ${mint ? mint.toBase58() : ''}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating token:', error);
      toast({
        title: 'Error',
        description: (error as Error).message,
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
        <Text color="black" align="center">{decimals}</Text>
        <Slider
          defaultValue={decimals}
          min={0}
          max={9}
          step={1}
          onChange={(value) => setDecimals(value)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Button onClick={handleCreateToken} isDisabled={!publicKey || !decimals}>Create Token</Button>
      </VStack>
    </Box>
  );
};

export default TokenCreator;