export const CATEGORIES = [
  { id: 'daily', name: '일상' },
  { id: 'dev', name: '개발' },
  { id: 'cooking', name: '요리' },
  { id: 'study', name: '공부' },
  { id: 'exercise', name: '운동' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export function getCategoryName(categoryId: string): string {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  return category?.name || categoryId;
}
