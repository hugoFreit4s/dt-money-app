import { useCallback } from 'react';
import { useSnackbar } from '@/context/snackbar.context';
import { AppError } from '@/shared/helpers/appError';

export function useErrorHandler() {
  const { notify } = useSnackbar();

  return useCallback(
    (error: unknown, fallback = 'Falha inesperada') => {
      const message = error instanceof AppError ? error.message : fallback;
      notify({ message });
    },
    [notify]
  );
}
