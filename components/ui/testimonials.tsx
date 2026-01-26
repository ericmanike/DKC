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
            className={`transition-all duration-300 rounded-full ${
              index === current
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
      role: "Student -knust"
    },
    {
      quote: "Best investment we've made this year.",
      name: "Emily Rodriguez",
      role: "Student -knust"
    }
  ];

  const testimonials = testimonialData.map((testimonial, index) => (
    <div key={index} className="bg-white p-8 text-center text-[10px] md:text-xl">
      <p className="text-[10px] md:text-xl mb-4">"{testimonial.quote}"</p>
      <p className="font-bold">{testimonial.name}</p>
      <p className="text-gray-600">{testimonial.role}</p>
    </div>
  ));

  return (
    <div className="py-10 px-3 md:py-30 rounded-2xl flex flex-col items-center justify-center ">
     <p className=' text-[12px] md:text-3xl font-extrabold text-center text-black  mb-8'>  The value<span className='text-orange-500 mx-2'>Digital Kingdom Chronicles</span>  brings to our students and customers</p>
     
      <div className="max-w-2xl w-full">
      
        <Carousel items={testimonials} autoPlayInterval={5000} />
      </div>
    </div>
  );
};

export default TestimonialCarousel;