import { ValueTransformer } from 'typeorm';

// MySQL devuelve los DECIMAL como texto; esto los convierte a number.
export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) =>
    value === null || value === undefined ? value : parseFloat(value),
};