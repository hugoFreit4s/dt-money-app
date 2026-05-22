import { Text, View } from 'react-native';
import { ITotalTransactions } from '@/interfaces/http/transaction.interface';
import { formatCurrencyFromCents } from '@/shared/utils/currency';

type SummaryCardsProps = {
  totals: ITotalTransactions;
};

export function SummaryCards({ totals }: SummaryCardsProps) {
  return (
    <View className="flex-row gap-3 px-6 mb-4">
      <View className="flex-1 bg-accent-brand-bg-primary rounded-lg p-3">
        <Text className="text-gray-500 text-xs">Entradas</Text>
        <Text className="text-white text-base font-bold mt-1">
          {formatCurrencyFromCents(totals.revenue)}
        </Text>
      </View>
      <View className="flex-1 bg-accent-red-bg-primary rounded-lg p-3">
        <Text className="text-gray-500 text-xs">Saídas</Text>
        <Text className="text-white text-base font-bold mt-1">
          {formatCurrencyFromCents(totals.expense)}
        </Text>
      </View>
      <View className="flex-1 bg-accent-blue-dark rounded-lg p-3">
        <Text className="text-gray-500 text-xs">Total</Text>
        <Text className="text-white text-base font-bold mt-1">
          {formatCurrencyFromCents(totals.total)}
        </Text>
      </View>
    </View>
  );
}
