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

export interface TransactionTableProps {
    transactions: Transaction[]
    spend: number
    received: number
    percentage: number
    title: string
}

export interface OverallSpendingType {
    transactions: Transaction[] | undefined
    spend: number | undefined
    received: number | undefined
}

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