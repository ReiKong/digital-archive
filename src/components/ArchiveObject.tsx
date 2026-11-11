import type { PointerEvent as ReactPointerEvent } from 'react';
import type { ArchiveItem } from '../data';

type Props = {
  item: ArchiveItem;
  moved: boolean;
  onPointerDown: (
    event: ReactPointerEvent<HTMLButtonElement>,
    item: ArchiveItem
  ) => void;
};

export function ArchiveObject({ item, moved, onPointerDown }: Props) {
  return (
    <button
      data-archive-item
      className={`archive-item ${moved ? 'was-moved' : ''}`}
      onPointerDown={event => onPointerDown(event, item)}
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
      <img src={item.image} alt={item.title} draggable={false} />
    </button>
  );
}
