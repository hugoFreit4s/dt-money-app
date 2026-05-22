import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as yup from 'yup';
import {
  ICategory,
  ITransaction,
} from '@/interfaces/http/transaction.interface';
import {
  createTransaction,
  listCategories,
  updateTransaction,
} from '@/services/dtmoney/transaction.service';
import { AppButton } from '@/components/AppButton';
import { useErrorHandler } from '@/shared/hooks/useErrorHandler';
import {
  formatCurrencyInput,
  parseCurrencyToCents,
} from '@/shared/utils/currency';

type TransactionFormValues = {
  typeId: number;
  categoryId: number;
  valueDisplay: string;
  description: string;
};

const transactionSchema = yup.object({
  typeId: yup.number().required(),
  categoryId: yup.number().required(),
  valueDisplay: yup.string().required('Valor é obrigatório'),
  description: yup.string().default(''),
});

type TransactionFormModalProps = {
  visible: boolean;
  editingTransaction: ITransaction | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function TransactionFormModal({
  visible,
  editingTransaction,
  onClose,
  onSuccess,
}: TransactionFormModalProps) {
  const errorHandler = useErrorHandler();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset, watch, setValue } =
    useForm<TransactionFormValues>({
      resolver: yupResolver(transactionSchema) as Resolver<TransactionFormValues>,
      defaultValues: {
        typeId: 2,
        categoryId: 1,
        valueDisplay: '',
        description: '',
      },
    });

  const typeId = watch('typeId');

  useEffect(() => {
    if (visible) {
      listCategories()
        .then(setCategories)
        .catch((error) => errorHandler(error, 'Falha ao carregar categorias'));
    }
  }, [visible, errorHandler]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    if (editingTransaction) {
      reset({
        typeId: editingTransaction.typeId,
        categoryId: editingTransaction.categoryId,
        valueDisplay: formatCurrencyInput(editingTransaction.value),
        description: editingTransaction.description ?? '',
      });
      return;
    }

    reset({
      typeId: 2,
      categoryId: 1,
      valueDisplay: '',
      description: '',
    });
  }, [visible, editingTransaction, reset]);

  const onSubmit = async (data: TransactionFormValues) => {
    setSubmitting(true);
    try {
      const value = parseCurrencyToCents(data.valueDisplay);
      if (editingTransaction) {
        await updateTransaction({
          id: editingTransaction.id,
          typeId: data.typeId,
          categoryId: data.categoryId,
          value,
          description: data.description,
        });
      } else {
        await createTransaction({
          typeId: data.typeId,
          categoryId: data.categoryId,
          value,
          description: data.description,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      errorHandler(error, 'Falha ao salvar transação');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-background-primary rounded-t-2xl max-h-[90%]">
          <ScrollView className="px-6 py-6">
            <Text className="text-white text-xl font-bold mb-4">
              {editingTransaction ? 'Editar transação' : 'Nova transação'}
            </Text>
            <Text className="text-gray-700 text-sm mb-2">Tipo</Text>
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${
                  typeId === 1 ? 'bg-accent-brand' : 'bg-background-secondary'
                }`}
                onPress={() => setValue('typeId', 1)}
              >
                <Text className="text-white">Entrada</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`px-4 py-2 rounded-lg ${
                  typeId === 2 ? 'bg-accent-red' : 'bg-background-secondary'
                }`}
                onPress={() => setValue('typeId', 2)}
              >
                <Text className="text-white">Saída</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-gray-700 text-sm mb-2">Categoria</Text>
            <Controller
              control={control}
              name="categoryId"
              render={({ field: { value, onChange } }) => (
                <View className="flex-row flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      className={`px-3 py-2 rounded-lg ${
                        value === category.id
                          ? 'bg-accent-brand'
                          : 'bg-background-secondary'
                      }`}
                      onPress={() => onChange(category.id)}
                    >
                      <Text className="text-white text-sm">{category.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            <Text className="text-gray-700 text-sm mb-2">Valor</Text>
            <Controller
              control={control}
              name="valueDisplay"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <View className="mb-4">
                  <TextInput
                    value={value}
                    onChangeText={(text) => {
                      const cents = parseCurrencyToCents(text);
                      onChange(formatCurrencyInput(cents));
                    }}
                    keyboardType="numeric"
                    placeholder="R$ 0,00"
                    placeholderTextColor="#7C7C8A"
                    className="bg-background-secondary text-white rounded-lg px-4 py-3"
                  />
                  {error?.message ? (
                    <Text className="text-accent-red text-sm mt-1">
                      {error.message}
                    </Text>
                  ) : null}
                </View>
              )}
            />
            <Text className="text-gray-700 text-sm mb-2">Descrição</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Descrição"
                  placeholderTextColor="#7C7C8A"
                  className="bg-background-secondary text-white rounded-lg px-4 py-3 mb-4"
                />
              )}
            />
            <AppButton
              title={submitting ? 'Salvando...' : 'Salvar'}
              disabled={submitting}
              onPress={handleSubmit(onSubmit)}
            />
            <View className="mt-3 mb-4">
              <AppButton title="Cancelar" mode="outline" onPress={onClose} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
