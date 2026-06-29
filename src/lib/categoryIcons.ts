import type { ComponentType } from 'react';
import {
  ShoppingCart,
  Briefcase,
  House,
  FilmSlate,
  Laptop,
  Coffee,
  Car,
  Heartbeat,
  GameController,
  Sparkle,
} from '@phosphor-icons/react/dist/ssr';

export type PhosphorIcon = ComponentType<{
  size?: number | string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  className?: string;
  color?: string;
}>;

export const categoryIcons: Record<string, PhosphorIcon> = {
  Food: ShoppingCart as PhosphorIcon,
  Salary: Briefcase as PhosphorIcon,
  Housing: House as PhosphorIcon,
  Entertainment: FilmSlate as PhosphorIcon,
  Freelance: Laptop as PhosphorIcon,
  Coffee: Coffee as PhosphorIcon,
  Transport: Car as PhosphorIcon,
  Health: Heartbeat as PhosphorIcon,
  Gaming: GameController as PhosphorIcon,
  Other: Sparkle as PhosphorIcon,
};

export function getCategoryIcon(category: string): PhosphorIcon {
  return categoryIcons[category] ?? (Sparkle as PhosphorIcon);
}
