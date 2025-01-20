'use client'

import { getAnachainProgram, getAnachainProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useAnachainProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getAnachainProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getAnachainProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['anachain', 'all', { cluster }],
    queryFn: () => program.account.anachain.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['anachain', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ anachain: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useAnachainProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useAnachainProgram()

  const accountQuery = useQuery({
    queryKey: ['anachain', 'fetch', { cluster, account }],
    queryFn: () => program.account.anachain.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['anachain', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ anachain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['anachain', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ anachain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['anachain', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ anachain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['anachain', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ anachain: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
