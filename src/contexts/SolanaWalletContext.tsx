import React, { createContext, useContext, useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface SolanaWalletContextProps {
  connection: Connection;
  publicKey: PublicKey | null;
}

const SolanaWalletContext = createContext<SolanaWalletContextProps | undefined>(undefined);

export const SolanaWalletProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [connection, setConnection] = useState<Connection>(new Connection(clusterApiUrl('devnet')));
  const { publicKey } = useWallet();

  useEffect(() => {
    const conn = new Connection(clusterApiUrl('devnet'));
    setConnection(conn);
  }, []);

  return (
    <SolanaWalletContext.Provider value={{ connection, publicKey }}>
      {children}
    </SolanaWalletContext.Provider>
  );
};

export const useSolanaWallet = () => {
  const context = useContext(SolanaWalletContext);
  if (context === undefined) {
    throw new Error('useSolanaWallet must be used within a SolanaWalletProvider');
  }
  return context;
};
