/**
 * useForm hook - manages form state and validation
 * Generic form handling with functional approach
 */

import { useState, useCallback } from 'react';

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  handleChange: (name: keyof T, value: any) => void;
  handleSubmit: (callback: (values: T) => void | Promise<void>) => (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setValues: (values: T) => void;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<Record<keyof T, string>>
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user types
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  }, []);

  const handleSubmit = useCallback(
    (callback: (values: T) => void | Promise<void>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault();

        if (validate) {
          const validationErrors = validate(values);
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
          }
        }

        await callback(values);
      };
    },
    [values, validate]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    setValues
  };
};
