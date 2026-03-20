import { Coral } from '../types';

export const CORAL_DATABASE: Coral[] = [];

export function getCoralById(id: string): Coral | undefined {
  return CORAL_DATABASE.find((c) => c.id === id);
}
