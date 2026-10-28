export const cleanText = (value, maxLength = 500) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export const requireText = (value, fieldName, maxLength = 500) => {
  const cleaned = cleanText(value, maxLength);

  if (!cleaned) {
    throw new Error(`${fieldName} is required`);
  }

  return cleaned;
};
