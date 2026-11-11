type Props = {
  title: string;
  id: string;
  images: string[];
};

export function DetailGallery({ title, id, images }: Props) {
  return (
    <div className="detail-gallery" tabIndex={0} aria-label={`Images of ${title}`}>
      {images.map((image, index) => (
        <figure className="detail-gallery-image" key={`${id}-${index}`}>
          <img
            src={image}
            alt={`${title} — image ${index + 1} of ${images.length}`}
          />
          <figcaption>
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(images.length).padStart(2, '0')}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
