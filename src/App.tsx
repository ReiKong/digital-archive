
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Crosshair,
  Minus,
  Plus,
  RotateCcw,
  X
} from 'lucide-react';
import { INITIAL_ITEMS, type ArchiveItem } from './data';

type Camera = {
  x: number;
  y: number;
  scale: number;
};

type Action =
  | {
      mode: 'pan';
      startX: number;
      startY: number;
      origin: Camera;
      moved: boolean;
    }
  | {
      mode: 'item';
      id: string;
      startX: number;
      startY: number;
      x: number;
      y: number;
      scale: number;
      moved: boolean;
    };

const STORAGE_KEY = 'the-things-i-kept:v1';
const MIN_ZOOM = 0.38;
const MAX_ZOOM = 2.3;

const clamp = (v: number, a: number, b: number) =>
  Math.min(Math.max(v, a), b);

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

export default function App() {
  const [items, setItems] = useState<ArchiveItem[]>(initialItems);
  const [camera, setCamera] = useState<Camera>({
    x: 0,
    y: 0,
    scale: 1
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastMoved, setLastMoved] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<Action | null>(null);
  const itemsRef = useRef(items);
  const camRef = useRef(camera);
  const topZ = useRef(Math.max(...INITIAL_ITEMS.map(i => i.z)));

  const [ready, setReady] = useState(false);

  const selected = items.find(i => i.id === selectedId);
  const selectedIndex = items.findIndex(i => i.id === selectedId);

  itemsRef.current = items;
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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedId(null);

      if (!selectedId) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedId(
          items[(selectedIndex + 1) % items.length]?.id ?? null
        );
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setSelectedId(
          items[
            (selectedIndex - 1 + items.length) % items.length
          ]?.id ?? null
        );
      }
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [selectedId, items, selectedIndex]);

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

  const beginPan = (event: React.PointerEvent<HTMLDivElement>) => {
    if (selectedId || event.button !== 0) return;

    if (
      (event.target as HTMLElement).closest('[data-archive-item]')
    ) {
      return;
    }

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
    event: React.PointerEvent<HTMLButtonElement>,
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

  const movePointer = (event: React.PointerEvent) => {
    const a = actionRef.current;

    if (!a) return;

    const dx = event.clientX - a.startX;
    const dy = event.clientY - a.startY;

    if (!a.moved && Math.hypot(dx, dy) > 5) {
      a.moved = true;
    }

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
            ? {
                ...i,
                x: a.x + dx / a.scale,
                y: a.y + dy / a.scale
              }
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
      prev.map(i =>
        i.id === a.id
          ? {
              ...i,
              z: topZ.current
            }
          : i
      )
    );

    setSelectedId(a.id);
  };

  const reset = () => {
    if (!confirm('Reset all items to their original positions?')) {
      return;
    }

    setItems(INITIAL_ITEMS);
    setLastMoved(null);
  };

  const recenter = () => {
    const r = viewportRef.current?.getBoundingClientRect();

    if (!r) return;

    const scale =
      r.width < 700 ? 0.65 : r.width < 1100 ? 0.8 : 1;

    setCamera({
      x: r.width / 2 - 1040 * scale,
      y: r.height / 2 - 570 * scale,
      scale
    });
  };

  const selectionScreen = selected
    ? {
        x:
          camera.x +
          (selected.x + selected.width / 2) * camera.scale,
        y:
          camera.y +
          (selected.y + selected.width * 0.63) * camera.scale
      }
    : null;

  const next = (step: number) =>
    setSelectedId(
      items[
        (selectedIndex + step + items.length) % items.length
      ]?.id ?? null
    );

  const vw =
    typeof window === 'undefined' ? 1280 : window.innerWidth;

  const vh =
    typeof window === 'undefined' ? 800 : window.innerHeight;

  const floatingWidth = Math.min(860, vw - 70);

  const floatingLeft = selectionScreen
    ? clamp(
        selectionScreen.x + floatingWidth + 32 < vw - 26
          ? selectionScreen.x + 32
          : selectionScreen.x - floatingWidth - 32,
        25,
        Math.max(25, vw - floatingWidth - 25)
      )
    : 25;

  const floatingTop = selectionScreen
    ? clamp(
        selectionScreen.y - 170,
        36,
        Math.max(36, vh - 470)
      )
    : 36;

  return (
    <div className="app">
      <header className="topbar">
      </header>

      <main
        ref={viewportRef}
        className={`viewport ${
          selectedId ? 'viewport-selected' : ''
        } ${ready ? 'is-ready' : ''}`}
        onPointerDown={beginPan}
        onPointerMove={movePointer}
        onPointerUp={endPointer}
        onPointerCancel={() => {
          actionRef.current = null;
        }}
      >
        <div
          className="world"
          style={{
            transform: `translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale})`
          }}
        >
          {items.map(item => (
            <button
              key={item.id}
              data-archive-item
              className={`archive-item ${
                lastMoved === item.id ? 'was-moved' : ''
              }`}
              onPointerDown={event => beginItem(event, item)}
              onDragStart={event => event.preventDefault()}
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                zIndex: item.z,
                transform: `rotate(${item.rotation}deg)`
              }}
              aria-label={`View ${item.title}`}
            >
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
              />
            </button>
          ))}
        </div>

        <div
          className="canvas-vignette"
          aria-hidden="true"
        />
      </main>

      <footer className="footer">
        <div className="zoom-control">
          <button
            onClick={() => zoomTo(camRef.current.scale / 1.25)}
            aria-label="Zoom out"
          >
            <Minus size={15} />
          </button>

          <span>{Math.round(camera.scale * 100)}%</span>

          <button
            onClick={() => zoomTo(camRef.current.scale * 1.25)}
            aria-label="Zoom in"
          >
            <Plus size={15} />
          </button>

          <span className="zoom-divider" />

          <button
            onClick={recenter}
            title="Recenter canvas"
            aria-label="Recenter canvas"
          >
            <Crosshair size={15} />
          </button>

          <button
            onClick={reset}
            title="Reset item positions"
            aria-label="Reset positions"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </footer>

      {selected && selectionScreen && (
        <div
          className="detail-layer"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div
            className="detail-backdrop"
            onClick={() => setSelectedId(null)}
          />

          <div
            className="detail-card"
            style={
              {
                '--float-left': `${floatingLeft}px`,
                '--float-top': `${floatingTop}px`
              } as React.CSSProperties
            }
          >
            <div className="detail-photo-wrap">
              <div className="detail-photo">
                <img
                  src={selected.image}
                  alt={selected.title}
                />
              </div>
            </div>

            <div className="detail-text">
              <div className="detail-topline">
                <button
                  onClick={() => setSelectedId(null)}
                  className="close-detail"
                  aria-label="Close detail"
                >
                  <X size={21} strokeWidth={1.4} />
                </button>
              </div>

              <span className="detail-category">
                {selected.category} <span>↗</span>
              </span>

              <h1>{selected.title}</h1>

              <div className="detail-location">
                {selected.place}
                {' '}
                <span className="detail-bullet">·</span>
                {' '}
                {selected.year}
              </div>

              <div className="detail-line" />

              <p>{selected.note}</p>

              <div className="detail-bottom">
                <div className="detail-nav">
                  <button
                    onClick={() => next(-1)}
                    aria-label="Previous object"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <span>
                    {(selectedIndex + 1)
                      .toString()
                      .padStart(2, '0')}{' '}
                    /{' '}
                    {items.length.toString().padStart(2, '0')}
                  </span>

                  <button
                    onClick={() => next(1)}
                    aria-label="Next object"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="esc-hint">
            PRESS ESC TO RETURN TO THE ARCHIVE
          </div>
        </div>
      )}
    </div>
  );
}
