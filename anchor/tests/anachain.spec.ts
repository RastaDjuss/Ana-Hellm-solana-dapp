import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Anachain} from '../target/types/anachain'

describe('anachain', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Anachain as Program<Anachain>

  const anachainKeypair = Keypair.generate()

  it('Initialize Anachain', async () => {
    await program.methods
      .initialize()
      .accounts({
        anachain: anachainKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([anachainKeypair])
      .rpc()

    const currentCount = await program.account.anachain.fetch(anachainKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Anachain', async () => {
    await program.methods.increment().accounts({ anachain: anachainKeypair.publicKey }).rpc()

    const currentCount = await program.account.anachain.fetch(anachainKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Anachain Again', async () => {
    await program.methods.increment().accounts({ anachain: anachainKeypair.publicKey }).rpc()

    const currentCount = await program.account.anachain.fetch(anachainKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Anachain', async () => {
    await program.methods.decrement().accounts({ anachain: anachainKeypair.publicKey }).rpc()

    const currentCount = await program.account.anachain.fetch(anachainKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set anachain value', async () => {
    await program.methods.set(42).accounts({ anachain: anachainKeypair.publicKey }).rpc()

    const currentCount = await program.account.anachain.fetch(anachainKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the anachain account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        anachain: anachainKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.anachain.fetchNullable(anachainKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
