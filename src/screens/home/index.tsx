import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ITransaction,
  ITotalTransactions,
} from '@/interfaces/http/transaction.interface';
import {
  deleteTransaction,
  listTransactions,
} from '@/services/dtmoney/transaction.service';
import { Header } from '@/components/Header';
import { Loading } from '@/components/Loading';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import { FiltersModal, FiltersState } from '@/screens/home/components/FiltersModal';
import { SummaryCards } from '@/screens/home/components/SummaryCards';
import { TransactionItem } from '@/screens/home/components/TransactionItem';
import { TransactionFormModal } from '@/screens/home/transactionForm';

const PER_PAGE = 15;

const emptyTotals: ITotalTransactions = {
  revenue: 0,
  expense: 0,
  total: 0,
};

export function HomeScreen() {
  const errorHandler = useErrorHandler();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [totals, setTotals] = useState<ITotalTransactions>(emptyTotals);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({});
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(
    null
  );

  const fetchTransactions = useCallback(
    async (pageToLoad: number, append: boolean) => {
      const response = await listTransactions({
        page: pageToLoad,
        perPage: PER_PAGE,
        ...filters,
      });

      setTransactions((prev) =>
        append ? [...prev, ...response.data] : response.data
      );
      setTotals(response.totalTransactions);
      setPage(response.page);
      setTotalPages(response.totalPages);
    },
    [filters]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      setLoading(true);
      try {
        const response = await listTransactions({
          page: 1,
          perPage: PER_PAGE,
          ...filters,
        });
        if (cancelled) {
          return;
        }
        setTransactions(response.data);
        setTotals(response.totalTransactions);
        setPage(response.page);
        setTotalPages(response.totalPages);
      } catch (error) {
        if (!cancelled) {
          errorHandler(error, 'Falha ao carregar transações');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      cancelled = true;
    };
  }, [filters, errorHandler]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTransactions(1, false);
    } catch (error) {
      errorHandler(error, 'Falha ao atualizar');
    } finally {
      setRefreshing(false);
    }
  }, [fetchTransactions, errorHandler]);

  const loadMore = useCallback(async () => {
    if (loadingMore || page >= totalPages) {
      return;
    }

    setLoadingMore(true);
    try {
      await fetchTransactions(page + 1, true);
    } catch (error) {
      errorHandler(error, 'Falha ao carregar mais');
    } finally {
      setLoadingMore(false);
    }
  }, [fetchTransactions, errorHandler, loadingMore, page, totalPages]);

  const handleApplyFilters = useCallback(
    async (nextFilters: FiltersState) => {
      setFilters(nextFilters);
      setFiltersVisible(false);
      setLoading(true);
      try {
        const response = await listTransactions({
          page: 1,
          perPage: PER_PAGE,
          ...nextFilters,
        });
        setTransactions(response.data);
        setTotals(response.totalTransactions);
        setPage(response.page);
        setTotalPages(response.totalPages);
      } catch (error) {
        errorHandler(error, 'Falha ao filtrar');
      } finally {
        setLoading(false);
      }
    },
    [errorHandler]
  );

  const handleDelete = useCallback(
    (transaction: ITransaction) => {
      Alert.alert(
        'Excluir transação',
        'Deseja realmente excluir esta transação?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteTransaction(transaction.id);
                await fetchTransactions(1, false);
              } catch (error) {
                errorHandler(error, 'Falha ao excluir');
              }
            },
          },
        ]
      );
    },
    [fetchTransactions, errorHandler]
  );

  const openCreate = () => {
    setEditingTransaction(null);
    setFormVisible(true);
  };

  const openEdit = (transaction: ITransaction) => {
    setEditingTransaction(transaction);
    setFormVisible(true);
  };

  if (loading && transactions.length === 0) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <Header />
      <SummaryCards totals={totals} />
      <View className="flex-row justify-between items-center px-6 mb-3">
        <Text className="text-white text-lg font-bold">Transações</Text>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => setFiltersVisible(true)}>
            <Text className="text-accent-brand-light">Filtros</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openCreate}>
            <Text className="text-accent-brand-light">Nova</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <Text className="text-gray-700 text-center mt-8 px-6">
            Nenhuma transação encontrada
          </Text>
        }
        ListFooterComponent={
          loadingMore ? (
            <Text className="text-gray-700 text-center py-4">Carregando...</Text>
          ) : page < totalPages ? (
            <TouchableOpacity className="py-4" onPress={loadMore}>
              <Text className="text-accent-brand-light text-center">
                Carregar mais
              </Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 24 }}
      />
      <FiltersModal
        visible={filtersVisible}
        initialFilters={filters}
        onClose={() => setFiltersVisible(false)}
        onApply={handleApplyFilters}
      />
      <TransactionFormModal
        visible={formVisible}
        editingTransaction={editingTransaction}
        onClose={() => setFormVisible(false)}
        onSuccess={() => fetchTransactions(1, false)}
      />
    </SafeAreaView>
  );
}
