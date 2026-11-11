import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, Dispatch, SetStateAction } from 'react';
import { INITIAL_ITEMS, type ArchiveItem } from '../data';
import type { Action, Camera } from '../types/canvas';
import { clamp, MAX_ZOOM, MIN_ZOOM } from '../utils/canvas';

type Options = {
  setItems: Dispatch<SetStateAction<ArchiveItem[]>>;
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setLastMoved: Dispatch<SetStateAction<string | null>>;
};

export function useArchiveCanvas({
  setItems,
  selectedId,
  setSelectedId,
  setLastMoved
}: Options) {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 });
  const [ready, setReady] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<Action | null>(null);
  const camRef = useRef(camera);
  const topZ = useRef(Math.max(...INITIAL_ITEMS.map(i => i.z)));

  camRef.current = camera;

  useEffect(() => {
    const alignInitial = () => {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;

      const scale =
        rect.width < 700 ? 0.65 : rect.width < 1100 ? 0.8 : 1;

      setCamera({
        x: rect.width / 2 - 1040 * scale,
        y: rect.height / 2 - 570 * scale,
        scale
      });
      setReady(true);
    };

    alignInitial();
  }, []);

  const zoomTo = useCallback(
    (nextScale: number, focal?: { x: number; y: number }) => {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;

      const point = focal ?? {
        x: rect.width / 2,
        y: rect.height / 2
      };

      setCamera(c => {
        const scale = clamp(nextScale, MIN_ZOOM, MAX_ZOOM);
        return {
          scale,
          x: point.x - (point.x - c.x) * scale / c.scale,
          y: point.y - (point.y - c.y) * scale / c.scale
        };
      });
    },
    []
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const wheel = (event: WheelEvent) => {
      if (selectedId) return;
      event.preventDefault();
      const rect = el.getBoundingClientRect();

      if (event.ctrlKey || event.metaKey) {
        const factor = Math.exp(-event.deltaY * 0.008);
        const c = camRef.current;
        const scale = clamp(c.scale * factor, MIN_ZOOM, MAX_ZOOM);
        const fx = event.clientX - rect.left;
        const fy = event.clientY - rect.top;

        setCamera({
          x: fx - (fx - c.x) * scale / c.scale,
          y: fy - (fy - c.y) * scale / c.scale,
          scale
        });
      } else {
        setCamera(c => ({
          ...c,
          x: c.x - event.deltaX,
          y: c.y - event.deltaY
        }));
      }
    };

    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, [selectedId]);

  const beginPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (selectedId || event.button !== 0) return;
    if ((event.target as HTMLElement).closest('[data-archive-item]')) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    actionRef.current = {
      mode: 'pan',
      startX: event.clientX,
      startY: event.clientY,
      origin: camRef.current,
      moved: false
    };
  };

  const beginItem = (
    event: ReactPointerEvent<HTMLButtonElement>,
    item: ArchiveItem
  ) => {
    if (selectedId || event.button !== 0) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    actionRef.current = {
      mode: 'item',
      id: item.id,
      startX: event.clientX,
      startY: event.clientY,
      x: item.x,
      y: item.y,
      scale: camRef.current.scale,
      moved: false
    };
  };

  const movePointer = (event: ReactPointerEvent) => {
    const a = actionRef.current;
    if (!a) return;

    const dx = event.clientX - a.startX;
    const dy = event.clientY - a.startY;

    if (!a.moved && Math.hypot(dx, dy) > 5) a.moved = true;
    if (!a.moved) return;

    if (a.mode === 'pan') {
      setCamera({
        ...a.origin,
        x: a.origin.x + dx,
        y: a.origin.y + dy
      });
    } else {
      setItems(prev =>
        prev.map(i =>
          i.id === a.id
            ? { ...i, x: a.x + dx / a.scale, y: a.y + dy / a.scale }
            : i
        )
      );
    }
  };

  const endPointer = () => {
    const a = actionRef.current;
    actionRef.current = null;
    if (!a || a.mode !== 'item') return;

    if (a.moved) {
      setLastMoved(a.id);
      return;
    }

    setLastMoved(null);
    topZ.current += 1;
    setItems(prev =>
      prev.map(i => i.id === a.id ? { ...i, z: topZ.current } : i)
    );
    setSelectedId(a.id);
  };

  const cancelPointer = () => {
    actionRef.current = null;
  };

  const recenter = () => {
    const r = viewportRef.current?.getBoundingClientRect();
    if (!r) return;

    const scale = r.width < 700 ? 0.65 : r.width < 1100 ? 0.8 : 1;
    setCamera({
      x: r.width / 2 - 1040 * scale,
      y: r.height / 2 - 570 * scale,
      scale
    });
  };

  return {
    camera,
    ready,
    viewportRef,
    zoomTo,
    recenter,
    beginPan,
    beginItem,
    movePointer,
    endPointer,
    cancelPointer
  };
}
