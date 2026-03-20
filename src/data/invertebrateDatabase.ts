import { Invertebrate } from '../types';

export const INVERTEBRATE_DATABASE: Invertebrate[] = [];

export function getInvertebrateById(id: string): Invertebrate | undefined {
  return INVERTEBRATE_DATABASE.find((i) => i.id === id);
}
