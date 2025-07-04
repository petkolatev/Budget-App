import { Transaction } from "@/types/types";

export const selectSpend = (state: Transaction[]) => state.reduce((prev: number, curr: { type: string; amount: number; }) =>
  prev + (curr.type === 'debit' ? curr.amount : 0), 0)

export const selectReceived = (state: Transaction[]) => state.reduce((prev: number, curr: { type: string; amount: number; }) =>
  prev + (curr.type === 'credit' ? curr.amount : 0), 0)
