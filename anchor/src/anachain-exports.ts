// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import AnachainIDL from '../target/idl/anachain.json'
import type { Anachain } from '../target/types/anachain'

// Re-export the generated IDL and type
export { Anachain, AnachainIDL }

// The programId is imported from the program IDL.
export const ANACHAIN_PROGRAM_ID = new PublicKey(AnachainIDL.address)

// This is a helper function to get the Anachain Anchor program.
export function getAnachainProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...AnachainIDL, address: address ? address.toBase58() : AnachainIDL.address } as Anachain, provider)
}

// This is a helper function to get the program ID for the Anachain program depending on the cluster.
export function getAnachainProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Anachain program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return ANACHAIN_PROGRAM_ID
  }
}
