import { useState } from 'react';
import { ArchiveCanvas } from './components/ArchiveCanvas';
import { ArchiveDetail } from './components/ArchiveDetail';
import { ZoomControls } from './components/ZoomControls';
import { useArchiveCanvas } from './hooks/useArchiveCanvas';
import { useArchiveItems } from './hooks/useArchiveItems';
import { useArchiveKeyboard } from './hooks/useArchiveKeyboard';

export default function App() {
  const { items, setItems, lastMoved, setLastMoved, reset } = useArchiveItems();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.find(i => i.id === selectedId);
  const selectedIndex = items.findIndex(i => i.id === selectedId);

  const canvas = useArchiveCanvas({
    setItems,
    selectedId,
    setSelectedId,
    setLastMoved
  });

  useArchiveKeyboard(items, selectedId, selectedIndex, setSelectedId);

  const next = (step: number) =>
    setSelectedId(
      items[(selectedIndex + step + items.length) % items.length]?.id ?? null
    );

  return (
    <div className="app">
      <header className="topbar"></header>
      <ArchiveCanvas
        items={items}
        camera={canvas.camera}
        ready={canvas.ready}
        selectedId={selectedId}
        lastMoved={lastMoved}
        viewportRef={canvas.viewportRef}
        beginPan={canvas.beginPan}
        beginItem={canvas.beginItem}
        movePointer={canvas.movePointer}
        endPointer={canvas.endPointer}
        cancelPointer={canvas.cancelPointer}
      />
      <ZoomControls
        scale={canvas.camera.scale}
        zoomTo={canvas.zoomTo}
        recenter={canvas.recenter}
        reset={reset}
      />
      {selected && (
        <ArchiveDetail
          key={selected.id}
          item={selected}
          selectedIndex={selectedIndex}
          total={items.length}
          close={() => setSelectedId(null)}
          next={next}
        />
      )}
    </div>
  );
}
