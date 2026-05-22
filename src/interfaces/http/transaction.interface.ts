export interface ICategory {
  id: number;
  name: string;
}

export interface ITransactionTypeRef {
  id: number;
  name: string;
}

export interface ITransaction {
  id: number;
  value: number;
  description: string;
  categoryId: number;
  typeId: number;
  type?: ITransactionTypeRef;
  category?: ICategory;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface ITotalTransactions {
  revenue: number;
  expense: number;
  total: number;
}

export interface IPaginatedTransactions {
  data: ITransaction[];
  totalRows: number;
  totalPages: number;
  page: number;
  perPage: number;
  totalTransactions: ITotalTransactions;
}

export interface ICreateTransactionPayload {
  typeId: number;
  categoryId: number;
  value: number;
  description?: string;
}

export interface IUpdateTransactionPayload {
  id: number;
  typeId?: number;
  categoryId?: number;
  value?: number;
  description?: string;
}

export interface IListTransactionsParams {
  page?: number;
  perPage?: number;
  searchText?: string;
  typeId?: number;
  categoryIds?: number[];
  from?: string;
  to?: string;
  orderId?: 'ASC' | 'DESC' | 'asc' | 'desc';
}
