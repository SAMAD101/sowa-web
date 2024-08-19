import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PublicKey } from '@solana/web3.js';

interface TokenContextType {
  tokenMint: PublicKey | null;
  setTokenMint: (mint: PublicKey | null) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tokenMint, setTokenMint] = useState<PublicKey | null>(null);

  return (
    <TokenContext.Provider value={{ tokenMint, setTokenMint }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
};