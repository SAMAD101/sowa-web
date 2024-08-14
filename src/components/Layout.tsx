import React from 'react';
import { Box, Container, VStack, Heading } from '@chakra-ui/react';

const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <Box minHeight="100vh" bg="gray.100">
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading as="h1" size="xl" textAlign="center">Solana Token Manager</Heading>
          {children}
        </VStack>
      </Container>
    </Box>
  );
};

export default Layout;
