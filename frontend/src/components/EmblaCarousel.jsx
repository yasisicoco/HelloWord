import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import './EmblaCarousel.sass';

const EmblaCarousel = ({ slides, options, storageKey }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [currentIndex, setCurrentIndex] = useState(0);
  const nav = useNavigate();

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setCurrentIndex(index);
    localStorage.setItem(storageKey, index.toString());
  }, [emblaApi, storageKey]);

  useEffect(() => {
    if (!emblaApi) return;

    const storedIndex = localStorage.getItem(storageKey);
    if (storedIndex !== null) {
      emblaApi.scrollTo(parseInt(storedIndex, 10));
    }

    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect, storageKey]);

  const handleSlideClick = (type) => {
    nav(`/${type}`);
  };

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi],
  );

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div
              className={`embla__slide ${
                index === (currentIndex - 1 + slides.length) % slides.length
                  ? 'embla__slide--prev'
                  : index === (currentIndex + 1) % slides.length
                    ? 'embla__slide--next'
                    : ''
              }`}
              key={index}
              onClick={() => handleSlideClick(slide.type)}>
              <img src={slide.image} alt={slide.type} className="embla__slide__img" />
            </div>
          ))}
        </div>
      </div>
      <div className="embla__dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`embla__dot ${index === currentIndex ? 'embla__dot--selected' : ''}`}
          />
        ))}
      </div>
    </section>
  );
};

export default EmblaCarousel;
