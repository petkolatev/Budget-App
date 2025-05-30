import { useReducer } from "react";
import { parse } from './BudgetParser'

export interface Transaction {
  date: string,
  amount: number,
  type: 'debit' | 'credit',
  document: string,
  contragent: string,
  reason: string,
  info: string,
  category: string
}

export interface BudgetState {
  value: number;
  transactions?: Transaction[];
  status: 'idle' | 'loading' | 'failed';
}
const initialState = {
  transactions: [],
};

export const selectSpend = (state: Transaction[]) => state.reduce((prev: number, curr: { type: string; amount: number; }) =>
  prev + (curr.type === 'debit' ? curr.amount : 0), 0)

export const selectReceived = (state: Transaction[]) => state.reduce((prev: number, curr: { type: string; amount: number; }) =>
  prev + (curr.type === 'credit' ? curr.amount : 0), 0)
