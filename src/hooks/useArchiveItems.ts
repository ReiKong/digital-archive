import { useEffect, useState } from 'react';
import { INITIAL_ITEMS, type ArchiveItem } from '../data';

const STORAGE_KEY = 'the-things-i-kept:v1';

function initialItems(): ArchiveItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const positions = JSON.parse(saved) as Record<
        string,
        { x: number; y: number; z: number }
      >;

      return INITIAL_ITEMS.map(i => ({
        ...i,
        ...positions[i.id]
      }));
    }
  } catch {
    /* browser may block storage */
  }

  return INITIAL_ITEMS;
}

export function useArchiveItems() {
  const [items, setItems] = useState<ArchiveItem[]>(initialItems);
  const [lastMoved, setLastMoved] = useState<string | null>(null);

  useEffect(() => {
    const positions = Object.fromEntries(
      items.map(i => [
        i.id,
        {
          x: i.x,
          y: i.y,
          z: i.z
        }
      ])
    );

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch {
      /* ignore */
    }
  }, [items]);

  const reset = () => {
    if (!confirm('Reset all items to their original positions?')) {
      return;
    }

    setItems(INITIAL_ITEMS);
    setLastMoved(null);
  };

  return { items, setItems, lastMoved, setLastMoved, reset };
}
