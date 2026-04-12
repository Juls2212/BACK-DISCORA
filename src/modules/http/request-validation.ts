const sanitizeNonEmptyString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const sanitizedValue = value.trim();
  return sanitizedValue ? sanitizedValue : null;
};

const sanitizeOptionalString = (value: unknown): string | undefined | null => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const sanitizedValue = value.trim();
  return sanitizedValue ? sanitizedValue : null;
};

const sanitizePositiveNumber = (value: unknown): number | null => {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return null;
  }

  return value;
};

const sanitizeRouteId = (value: unknown): string | null => {
  return sanitizeNonEmptyString(value);
};

export {
  sanitizeNonEmptyString,
  sanitizeOptionalString,
  sanitizePositiveNumber,
  sanitizeRouteId
};
