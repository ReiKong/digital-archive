import { X } from 'lucide-react';
import type { ArchiveItem } from '../data';
import { DetailGallery } from './DetailGallery';
import { DetailInfo } from './DetailInfo';

type Props = {
  item: ArchiveItem;
  selectedIndex: number;
  total: number;
  close: () => void;
  next: (step: number) => void;
};

export function ArchiveDetail({ item, selectedIndex, total, close, next }: Props) {
  const gallery = item.images?.length ? item.images : [item.image];
  const tags = item.tags?.length ? item.tags : [item.category.toLowerCase()];

  return (
    <div
      className="detail-layer"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      key={item.id}
    >
      <div className="detail-backdrop" onClick={close} />
      <button className="close-detail" onClick={close} aria-label="Close detail">
        <X size={22} strokeWidth={1.4} />
      </button>
      <div className="detail-layout">
        <DetailGallery title={item.title} id={item.id} images={gallery} />
        <DetailInfo
          item={item}
          tags={tags}
          selectedIndex={selectedIndex}
          total={total}
          next={next}
        />
      </div>
    </div>
  );
}
