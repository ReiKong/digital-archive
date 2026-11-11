import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { ArchiveItem } from '../data';

type Props = {
  item: ArchiveItem;
  tags: string[];
  selectedIndex: number;
  total: number;
  next: (step: number) => void;
};

export function DetailInfo({ item, tags, selectedIndex, total, next }: Props) {
  return (
    <aside className="detail-text">
      <h1>{item.title}</h1>
      <div className="detail-location">
        {item.place} <span className="detail-bullet">·</span> {item.year}
      </div>
      <p>{item.note}</p>
      <div className="detail-tags">
        {tags.map(tag => (
          <span key={tag} className="detail-tag">{tag}</span>
        ))}
      </div>
      <div className="detail-nav">
        <button onClick={() => next(-1)} aria-label="Previous object">
          <ArrowLeft size={18} />
        </button>
        <span>
          {(selectedIndex + 1).toString().padStart(2, '0')} /{' '}
          {total.toString().padStart(2, '0')}
        </span>
        <button onClick={() => next(1)} aria-label="Next object">
          <ArrowRight size={18} />
        </button>
      </div>
    </aside>
  );
}
