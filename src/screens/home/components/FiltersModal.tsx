import { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ICategory } from '@/interfaces/http/transaction.interface';
import { IListTransactionsParams } from '@/interfaces/http/transaction.interface';
import { listCategories } from '@/services/dtmoney/transaction.service';
import { AppButton } from '@/components/AppButton';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';

export type FiltersState = Pick<
  IListTransactionsParams,
  'searchText' | 'typeId' | 'categoryIds' | 'from' | 'to' | 'orderId'
>;

type FiltersModalProps = {
  visible: boolean;
  initialFilters: FiltersState;
  onClose: () => void;
  onApply: (filters: FiltersState) => void;
};

export function FiltersModal({
  visible,
  initialFilters,
  onClose,
  onApply,
}: FiltersModalProps) {
  const errorHandler = useErrorHandler();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  useEffect(() => {
    if (visible) {
      setFilters(initialFilters);
      listCategories()
        .then(setCategories)
        .catch((error) => errorHandler(error, 'Falha ao carregar categorias'));
    }
  }, [visible, initialFilters, errorHandler]);

  const toggleCategory = (categoryId: number) => {
    setFilters((prev) => {
      const current = prev.categoryIds ?? [];
      const exists = current.includes(categoryId);
      return {
        ...prev,
        categoryIds: exists
          ? current.filter((id) => id !== categoryId)
          : [...current, categoryId],
      };
    });
  };

  const clearFilters = () => {
    onApply({});
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-background-primary rounded-t-2xl max-h-[85%]">
          <ScrollView className="px-6 py-6">
            <Text className="text-white text-xl font-bold mb-4">Filtros</Text>
            <Text className="text-gray-700 text-sm mb-2">Busca</Text>
            <TextInput
              value={filters.searchText ?? ''}
              onChangeText={(searchText) =>
                setFilters((prev) => ({ ...prev, searchText }))
              }
              placeholder="Descrição"
              placeholderTextColor="#7C7C8A"
              className="bg-background-secondary text-white rounded-lg px-4 py-3 mb-4"
            />
            <Text className="text-gray-700 text-sm mb-2">Tipo</Text>
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${
                  filters.typeId === 1 ? 'bg-accent-brand' : 'bg-background-secondary'
                }`}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    typeId: prev.typeId === 1 ? undefined : 1,
                  }))
                }
              >
                <Text className="text-white">Entrada</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${
                  filters.typeId === 2 ? 'bg-accent-red' : 'bg-background-secondary'
                }`}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    typeId: prev.typeId === 2 ? undefined : 2,
                  }))
                }
              >
                <Text className="text-white">Saída</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-700 text-sm mb-2">Categorias</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {categories.map((category) => {
                const selected = filters.categoryIds?.includes(category.id);
                return (
                  <TouchableOpacity
                    key={category.id}
                    className={`px-3 py-2 rounded-lg ${
                      selected ? 'bg-accent-brand' : 'bg-background-secondary'
                    }`}
                    onPress={() => toggleCategory(category.id)}
                  >
                    <Text className="text-white text-sm">{category.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text className="text-gray-700 text-sm mb-2">Ordenação (ID)</Text>
            <View className="flex-row gap-2 mb-4">
              {(['DESC', 'ASC'] as const).map((order) => (
                <TouchableOpacity
                  key={order}
                  className={`px-4 py-2 rounded-lg ${
                    filters.orderId === order
                      ? 'bg-accent-brand'
                      : 'bg-background-secondary'
                  }`}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      orderId: prev.orderId === order ? undefined : order,
                    }))
                  }
                >
                  <Text className="text-white">{order}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <AppButton title="Aplicar" onPress={() => onApply(filters)} />
            <View className="mt-3">
              <AppButton title="Limpar" mode="outline" onPress={clearFilters} />
            </View>
            <View className="mt-3 mb-4">
              <AppButton title="Fechar" mode="outline" onPress={onClose} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
