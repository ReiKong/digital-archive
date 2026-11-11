import { useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ArchiveItem } from '../data';

export function useArchiveKeyboard(
  items: ArchiveItem[],
  selectedId: string | null,
  selectedIndex: number,
  setSelectedId: Dispatch<SetStateAction<string | null>>
) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);
      if (!selectedId) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedId(items[(selectedIndex + 1) % items.length]?.id ?? null);
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSelectedId(
          items[(selectedIndex - 1 + items.length) % items.length]?.id ?? null
        );
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, items, selectedIndex, setSelectedId]);
}
