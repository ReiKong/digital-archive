import { Crosshair, Minus, Plus, RotateCcw } from 'lucide-react';

type Props = {
  scale: number;
  zoomTo: (scale: number) => void;
  recenter: () => void;
  reset: () => void;
};

export function ZoomControls({ scale, zoomTo, recenter, reset }: Props) {
  return (
    <footer className="footer">
      <div className="zoom-control">
        <button onClick={() => zoomTo(scale / 1.25)} aria-label="Zoom out">
          <Minus size={15} />
        </button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => zoomTo(scale * 1.25)} aria-label="Zoom in">
          <Plus size={15} />
        </button>
        <span className="zoom-divider" />
        <button onClick={recenter} title="Recenter canvas" aria-label="Recenter canvas">
          <Crosshair size={15} />
        </button>
        <button onClick={reset} title="Reset item positions" aria-label="Reset positions">
          <RotateCcw size={15} />
        </button>
      </div>
    </footer>
  );
}
