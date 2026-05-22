import { dtmoneyApi } from '@/shared/api/dtmoney';
import {
  ICategory,
  ICreateTransactionPayload,
  IListTransactionsParams,
  IPaginatedTransactions,
  ITransaction,
  IUpdateTransactionPayload,
} from '@/interfaces/http/transaction.interface';

export async function listCategories(): Promise<ICategory[]> {
  const { data } = await dtmoneyApi.get<ICategory[]>('/transaction/categories');
  return data;
}

export async function listTransactions(
  params: IListTransactionsParams
): Promise<IPaginatedTransactions> {
  const { data } = await dtmoneyApi.get<IPaginatedTransactions>('/transaction', {
    params,
    paramsSerializer: {
      indexes: null,
    },
  });
  return data;
}

export async function createTransaction(
  payload: ICreateTransactionPayload
): Promise<ITransaction> {
  const { data } = await dtmoneyApi.post<ITransaction>('/transaction', payload);
  return data;
}

export async function updateTransaction(
  payload: IUpdateTransactionPayload
): Promise<void> {
  await dtmoneyApi.put('/transaction', payload);
}

export async function deleteTransaction(id: number): Promise<void> {
  await dtmoneyApi.delete(`/transaction/${id}`);
}
