import { Text, TouchableOpacity, View } from 'react-native';
import { ITransaction } from '@/interfaces/http/transaction.interface';
import { formatCurrencyFromCents } from '@/shared/utils/currency';

type TransactionItemProps = {
  transaction: ITransaction;
  onEdit: (transaction: ITransaction) => void;
  onDelete: (transaction: ITransaction) => void;
};

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  const isIncome = transaction.typeId === 1;

  return (
    <View className="bg-background-secondary rounded-lg p-4 mb-3 mx-6">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <Text className="text-white text-base font-medium">
            {transaction.description || 'Sem descrição'}
          </Text>
          <Text className="text-gray-700 text-sm mt-1">
            {transaction.category?.name ?? `Categoria ${transaction.categoryId}`}
          </Text>
          <Text className="text-gray-700 text-xs mt-1">
            {transaction.type?.name ?? (isIncome ? 'Entrada' : 'Saída')}
          </Text>
        </View>
        <Text
          className={
            isIncome ? 'text-accent-brand-light font-bold' : 'text-accent-red font-bold'
          }
        >
          {formatCurrencyFromCents(transaction.value)}
        </Text>
      </View>
      <View className="flex-row gap-4 mt-3">
        <TouchableOpacity onPress={() => onEdit(transaction)}>
          <Text className="text-accent-brand-light text-sm">Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(transaction)}>
          <Text className="text-accent-red text-sm">Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
