'use client'
import { useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  items: ReactNode[];
  autoPlayInterval?: number;
}

const Carousel = ({ items, autoPlayInterval = 5000 }: CarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isAutoPlaying || !items.length) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, items.length, autoPlayInterval]);

  const next = (): void => {
    setCurrent((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const prev = (): void => {
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  const goTo = (index: number): void => {
    setCurrent(index);
    setIsAutoPlaying(false);
  };

  if (!items.length) return null;

  return (
    <div className="relative w-full py-5">
      {/* Content Area */}
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full shrink-0">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={next}
        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`transition-all duration-300 rounded-full ${index === current
              ? 'w-8 h-3 bg-blue-600'
              : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Example usage with testimonials
interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const TestimonialCarousel = () => {
  const testimonialData: Testimonial[] = [
    {
      quote: "Amazing product! Changed my life completely.",
      name: "Sarah Johnson",
      role: "CEO, TechStart"
    },
    {
      quote: "Outstanding service and support. Highly recommend!",
      name: "Michael Chen",
      role: "Student - KNUST"
    },
    {
      quote: "Best investment we've made this year.",
      name: "Emily Rodriguez",
      role: "Student - KNUST"
    }
  ];

  const testimonials = testimonialData.map((testimonial, index) => (
    <div key={index} className="bg-white/90 backdrop-blur-sm p-10 md:p-14 text-center rounded-3xl border border-gray-100 shadow-xl relative overflow-hidden">
      <div className="absolute top-4 left-6 text-gray-200 pointer-events-none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 6.79086 11.8079 5 14.017 5H15.017C15.5693 5 16.017 5.44772 16.017 6V7C16.017 7.55228 15.5693 8 15.017 8H14.017C12.9124 8 12.017 8.89543 12.017 10V11H14.017C15.1216 11 16.017 11.8954 16.017 13V15.5C16.017 18.5376 13.5546 21 10.517 21H10.017C9.46472 21 9.017 20.5523 9.017 20V19C9.017 18.4477 9.46472 18 10.017 18H10.517C11.6216 18 12.517 17.1046 12.517 16V15H10.017C8.91243 15 8.017 14.1046 8.017 13V9C8.017 5.68629 10.7033 3 14.017 3H15.017C17.2261 3 19.017 4.79086 19.017 7V15C19.017 18.3137 16.3308 21 13.017 21H14.017Z" opacity="0.1" />
        </svg>
      </div>
      <p className="text-gray-700 text-lg md:text-2xl font-medium italic mb-8 relative z-10">"{testimonial.quote}"</p>
      <div className="flex flex-col items-center">
        <div className="w-12 h-1 overflow-hidden rounded-full bg-linear-to-r from-blue-600 to-orange-500 mb-4"></div>
        <p className="font-bold text-gray-900 text-xl">{testimonial.name}</p>
        <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">{testimonial.role}</p>
      </div>
    </div>
  ));

  return (
    <div className="py-10 px-3 flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h3 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-2">Success Stories</h3>
        <p className='text-3xl md:text-4xl font-black text-slate-900'>
          Real People, <span className='text-blue-600'>Real Results</span>
        </p>
      </div>

      <div className="max-w-2xl w-full">
        <Carousel items={testimonials} autoPlayInterval={5000} />
      </div>
    </div>
  );
};

export default TestimonialCarousel;