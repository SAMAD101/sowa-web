import React, { createContext, useContext, useState, useMemo } from 'react';
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

interface SolanaWalletContextProps {
  connection: Connection;
  publicKey: PublicKey | null;
  balance: number | null;
  sendTransaction: any;
}

const SolanaWalletContext = createContext<SolanaWalletContextProps | undefined>(undefined);

export const SolanaWalletProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [connection] = useState<Connection>(() => new Connection(clusterApiUrl('devnet')));
  const { publicKey, sendTransaction } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useMemo(() => {
    if (publicKey) {
      const fetchBalance = async () => {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL); // Convert lamports to SOL
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
      };

      fetchBalance();
      const id = connection.onAccountChange(publicKey, () => fetchBalance());

      return () => {
        connection.removeAccountChangeListener(id);
      };
    } else {
      setBalance(null);
    }
  }, [connection, publicKey]);

  return (
    <SolanaWalletContext.Provider value={{ connection, publicKey, balance, sendTransaction }}>
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
