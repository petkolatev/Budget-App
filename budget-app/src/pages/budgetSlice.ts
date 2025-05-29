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


export const reducer = (state: any, action: { type: any; payload: string; }) => {
  switch (action.type) {
    case "PROCESS_FILE":
      return { ...state, transactions: parse(action.payload) };
    default:
      return state;
  }
};

export const selectSpend = (state: any) => state.transactions?.reduce((prev: any, curr: { type: string; amount: any; }) =>
  prev + (curr.type === 'debit' ? curr.amount : 0), 0)
