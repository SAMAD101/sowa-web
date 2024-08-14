import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  burn,
  createApproveInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const createToken = async (
  connection: Connection,
  payer: PublicKey,
  name: string,
  symbol: string
): Promise<PublicKey> => {
  const mint = Keypair.generate();
  const tx = new Transaction().add(
    await createMint(
      connection,
      payer,
      payer,
      payer,
      9,
      mint.publicKey
    )
  );
  await connection.sendTransaction(tx, [mint]);
  return mint.publicKey;
};

export const mintToken = async (
  connection: Connection,
  payer: PublicKey,
  mintAddress: string,
  recipient: string,
  amount: number
): Promise<string> => {
  const mint = new PublicKey(mintAddress);
  const to = new PublicKey(recipient);
  const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, to);
  const tx = await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer,
    amount * (10 ** 9)
  );
  return tx;
};

export const transferToken = async (
  connection: Connection,
  payer: PublicKey,
  mintAddress: string,
  recipient: string,
  amount: number
): Promise<string> => {
  const mint = new PublicKey(mintAddress);
  const to = new PublicKey(recipient);
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer);
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, to);
  const tx = await transfer(
    connection,
    payer,
    fromTokenAccount.address,
    toTokenAccount.address,
    payer,
    amount * (10 ** 9)
  );
  return tx;
};

export const burnToken = async (
  connection: Connection,
  payer: PublicKey,
  mintAddress: string,
  amount: number
): Promise<string> => {
  const mint = new PublicKey(mintAddress);
  const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer);
  const tx = await burn(
    connection,
    payer,
    tokenAccount.address,
    mint,
    payer,
    amount * (10 ** 9)
  );
  return tx;
};

export const delegateToken = async (
  connection: Connection,
  payer: PublicKey,
  mintAddress: string,
  delegate: string,
  amount: number
): Promise<string> => {
  const mint = new PublicKey(mintAddress);
  const delegatePublicKey = new PublicKey(delegate);
  const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, payer);
  const tx = new Transaction().add(
    createApproveInstruction(
      tokenAccount.address,
      delegatePublicKey,
      payer,
      amount * (10 ** 9),
      [],
      TOKEN_PROGRAM_ID
    )
  );
  return await connection.sendTransaction(tx, []);
};
