export function normalizeValue<T>(value: T | undefined | null): T | null {
  if (typeof value === 'object' || Array.isArray(value) || typeof value === 'function') {
    return null;
  }
  if (value === undefined || value === null) return null;
  if (typeof value === 'number' && isNaN(value)) return null;
  return value;
}

export function boolToInt(value?: boolean | null): number {
  return value ? 1 : 0;
}

export function parse10Int(value: any): number | null {
  if (value == null) return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
}