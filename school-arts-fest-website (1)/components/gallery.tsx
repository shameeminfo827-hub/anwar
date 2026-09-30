import Image from 'next/image'

const PHOTOS = [
  { src: '/gallery/dance.png', alt: 'Group dance performance on the open air stage', caption: 'Group Dance', span: 'md:col-span-2 md:row-span-2' },
  { src: '/gallery/painting.png', alt: 'Students painting with watercolors in the art studio', caption: 'Watercolor Painting', span: '' },
  { src: '/gallery/music.png', alt: 'Student playing violin in the main auditorium', caption: 'Instrumental Music', span: '' },
  { src: '/gallery/theatre.png', alt: 'Students performing a skit on stage', caption: 'Skit', span: '' },
  { src: '/gallery/choir.png', alt: 'Junior choir singing on stage', caption: 'Choir', span: '' },
  { src: '/gallery/prize.png', alt: 'Winners holding trophies at the prize ceremony', caption: 'Prize Ceremony', span: 'md:col-span-2' },
]

export function Gallery() {
  return (
    <ul className="grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {PHOTOS.map((photo) => (
        <li key={photo.src} className={`group relative overflow-hidden rounded-2xl ${photo.span}`}>
          <figure className="h-full">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-semibold text-white">
              {photo.caption}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
