import { Connection, PublicKey, Keypair, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  burn,
  Account,
  createApproveInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export const createToken = async (
  connection: Connection,
  payer: PublicKey,
  name: string,
  symbol: string
): Promise<PublicKey> => {
  // For simplicity, we're using the payer as the mint authority and freeze authority
  // In a real-world scenario, you might want to use a different keypair
  const mintAuthority = payer;
  const freezeAuthority = payer;

  const tokenMint = await createMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    9 // 9 here refers to 9 decimal places
  );

  console.log(`Token created: ${tokenMint.toBase58()}`);
  return tokenMint;
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

  // Get the token account of the recipient. If it does not exist, create it
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    to
  );

  // Mint tokens to the recipient
  const signature = await mintTo(
    connection,
    payer,
    mint,
    toTokenAccount.address,
    payer, // Assuming the payer is also the mint authority
    amount * (10 ** 9) // Assuming 9 decimal places
  );

  console.log(`Minted ${amount} tokens to ${recipient}. Signature: ${signature}`);
  return signature;
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

  // Get the token account of the from wallet. If it does not exist, create it
  const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer
  );

  // Get the token account of the to wallet. If it does not exist, create it
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    to
  );

  // Transfer tokens to the recipient
  const signature = await transfer(
    connection,
    payer,
    fromTokenAccount.address,
    toTokenAccount.address,
    payer,
    amount * (10 ** 9) // Assuming 9 decimal places
  );

  console.log(`Transferred ${amount} tokens from ${payer.toBase58()} to ${recipient}. Signature: ${signature}`);
  return signature;
};

export const burnToken = async (
  connection: Connection,
  payer: PublicKey,
  mintAddress: string,
  amount: number
): Promise<string> => {
  const mint = new PublicKey(mintAddress);

  // Get the token account of the payer. If it does not exist, create it
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer
  );

  // Burn tokens
  const signature = await burn(
    connection,
    payer,
    tokenAccount.address,
    mint,
    payer,
    amount * (10 ** 9) // Assuming 9 decimal places
  );

  console.log(`Burned ${amount} tokens. Signature: ${signature}`);
  return signature;
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

  // Get the token account of the payer. If it does not exist, create it
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer
  );

  // Create the delegate instruction
  const delegateInstruction = createApproveInstruction(
    tokenAccount.address,
    delegatePublicKey,
    payer,
    amount * (10 ** 9) // Assuming 9 decimal places
  );

  // Create and send the transaction
  const transaction = new Transaction().add(delegateInstruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, []);

  console.log(`Delegated ${amount} tokens to ${delegate}. Signature: ${signature}`);
  return signature;
};