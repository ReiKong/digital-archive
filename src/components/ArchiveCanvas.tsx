import type { PointerEvent as ReactPointerEvent, RefObject } from 'react';
import type { ArchiveItem } from '../data';
import type { Camera } from '../types/canvas';
import { ArchiveObject } from './ArchiveObject';

type Props = {
  items: ArchiveItem[];
  camera: Camera;
  ready: boolean;
  selectedId: string | null;
  lastMoved: string | null;
  viewportRef: RefObject<HTMLDivElement>;
  beginPan: (event: ReactPointerEvent<HTMLDivElement>) => void;
  beginItem: (event: ReactPointerEvent<HTMLButtonElement>, item: ArchiveItem) => void;
  movePointer: (event: ReactPointerEvent) => void;
  endPointer: () => void;
  cancelPointer: () => void;
};

export function ArchiveCanvas({
  items,
  camera,
  ready,
  selectedId,
  lastMoved,
  viewportRef,
  beginPan,
  beginItem,
  movePointer,
  endPointer,
  cancelPointer
}: Props) {
  return (
    <main
      ref={viewportRef}
      className={`viewport ${selectedId ? 'viewport-selected' : ''} ${ready ? 'is-ready' : ''}`}
      onPointerDown={beginPan}
      onPointerMove={movePointer}
      onPointerUp={endPointer}
      onPointerCancel={cancelPointer}
    >
      <div
        className="world"
        style={{
          transform: `translate3d(${camera.x}px,${camera.y}px,0) scale(${camera.scale})`
        }}
      >
        {items.map(item => (
          <ArchiveObject
            key={item.id}
            item={item}
            moved={lastMoved === item.id}
            onPointerDown={beginItem}
          />
        ))}
      </div>
      <div className="canvas-vignette" aria-hidden="true" />
    </main>
  );
}
