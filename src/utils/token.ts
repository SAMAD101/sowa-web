import { Connection, Keypair, PublicKey, SystemProgram, Transaction, TransactionConfirmationStrategy } from '@solana/web3.js';
import {
  getMinimumBalanceForRentExemptMint,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMintInstruction,
  createMintToInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createTransferInstruction,
  MintLayout,
  createBurnInstruction,
  createApproveInstruction,
} from '@solana/spl-token';
import { SendTransactionOptions } from '@solana/wallet-adapter-base';

export async function createMint(
  connection: Connection,
  payer: PublicKey,
  mintAuthority: PublicKey,
  freezeAuthority: PublicKey | null,
  decimals: number,
  signTransaction: (
    transaction: Transaction, 
    connection: Connection, 
    options?: SendTransactionOptions
  ) => Promise<TransactionConfirmationStrategy>
): Promise<PublicKey> {
  const mintKeypair = Keypair.generate();
  const lamports = await getMinimumBalanceForRentExemptMint(connection);

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      decimals,
      mintAuthority,
      freezeAuthority,
      TOKEN_PROGRAM_ID
    )
  );
  
  const signature = await signTransaction(transaction, connection, {
    signers: [mintKeypair]
  });
  await connection.confirmTransaction(signature, 'confirmed');

  return mintKeypair.publicKey;
}


export async function getTokenDecimals(
  connection: Connection,
  mintAddress: PublicKey
): Promise<number> {
  const mintInfo = await connection.getAccountInfo(mintAddress);
  if (mintInfo === null) {
    throw new Error('Failed to find mint account');
  }
  const mintData = MintLayout.decode(mintInfo.data);
  return mintData.decimals;
}

export async function mintToken(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  destination: PublicKey,
  authority: PublicKey,
  amount: number,
  signTransaction: (
    transaction: Transaction,
    connection: Connection
  ) => Promise<TransactionConfirmationStrategy>
): Promise<TransactionConfirmationStrategy> {
  const decimals = await getTokenDecimals(connection, mint);
  const associatedToken = await getAssociatedTokenAddress(
    mint,
    destination,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction();

  const account = await connection.getAccountInfo(associatedToken);

  if (!account) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer,
        associatedToken,
        destination,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }

  transaction.add(
    createMintToInstruction(
      mint,
      associatedToken,
      authority,
      amount * Math.pow(10, decimals)
    )
  );

  const signature = await signTransaction(transaction, connection);
  await connection.confirmTransaction(signature, 'confirmed');

  return signature;
}

export async function transferToken(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  source: PublicKey,
  destination: PublicKey,
  amount: number,
  signTransaction: (
    transaction: Transaction,
    connection: Connection,
  ) => Promise<TransactionConfirmationStrategy>
): Promise<TransactionConfirmationStrategy> {
  const decimals = await getTokenDecimals(connection, mint);
  const sourceATA = await getAssociatedTokenAddress(
    mint,
    source,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const destinationATA = await getAssociatedTokenAddress(
    mint,
    destination,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const transaction = new Transaction();

  const destinationAccount = await connection.getAccountInfo(destinationATA);

  if (!destinationAccount) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer,
        destinationATA,
        destination,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }

  transaction.add(
    createTransferInstruction(
      sourceATA,
      destinationATA,
      source,
      amount * Math.pow(10, decimals),
      [],
      TOKEN_PROGRAM_ID
    )
  );

  const signature = await signTransaction(transaction, connection);
  await connection.confirmTransaction(signature, 'confirmed');

  return signature;
}

export async function burnToken(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  amount: number,
  signTransaction: (
    transaction: Transaction,
    connection: Connection,
  ) => Promise<TransactionConfirmationStrategy>
): Promise<TransactionConfirmationStrategy> {
  const decimals = await getTokenDecimals(connection, mint);

  const associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    payer,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const burnInstruction = createBurnInstruction(
    associatedTokenAddress,
    mint,
    payer,
    amount * Math.pow(10, decimals)
  );

  const transaction = new Transaction().add(burnInstruction);

  const signature = await signTransaction(transaction, connection);
  await connection.confirmTransaction(signature, 'confirmed');

  return signature;
}

export async function delegateToken(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  delegate: PublicKey,
  amount: number,
  signTransaction: (
    transaction: Transaction, 
    connection: Connection, 
  ) => Promise<TransactionConfirmationStrategy>
): Promise<TransactionConfirmationStrategy> {
  const decimals = await getTokenDecimals(connection, mint);

  const associatedTokenAddress = await getAssociatedTokenAddress(
    mint,
    payer,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const approveInstruction = createApproveInstruction(
    associatedTokenAddress,
    delegate,
    payer,
    amount * Math.pow(10, decimals)
  );

  const transaction = new Transaction().add(approveInstruction);

  const signature = await signTransaction(transaction, connection);
  await connection.confirmTransaction(signature, 'confirmed');

  return signature;
}