/**
 * Validate that a string is between min and max length (inclusive).
 */
export function validateLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

/**
 * Validate thread title: 1-100 characters.
 */
export function validateThreadTitle(title: string): boolean {
  return validateLength(title, 1, 100);
}

/**
 * Validate thread context label: 1-120 characters.
 */
export function validateContextLabel(label: string): boolean {
  return validateLength(label, 1, 120);
}

/**
 * Validate action item description: 1-500 characters.
 */
export function validateActionItemDescription(description: string): boolean {
  return validateLength(description, 1, 500);
}
