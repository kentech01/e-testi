import { useState } from 'react';
import {  ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { TestimonialCard } from './TestimonialCard';


const testimonials = [
  {
    name: 'Albina Krasniqi',
    role: 'Studente, Prishtinë',
    image: './etesti-icon.svg',
    text: 'E-testi më ndihmoi shumë të përgatitem për maturë. Testet e vërteta dhe statistikat e detajuara ishin shumë të dobishme.',
  },
  {
    name: 'Arben Mustafa',
    role: 'Student, Prizren',
    image: './etesti-icon.svg',
    text: 'Platforma më e mirë për përgatitje! Rezultati im në maturë ishte mbi pritjet falë praktikës së vazhdueshme me E-testi.',
  },
  {
    name: 'Arta Berisha',
    role: 'Mësimdhënëse, Gjakovë',
    image: './etesti-icon.svg',
    text: 'Si mësimdhënëse, e rekomandoj E-testi për të gjithë studentët e mi. Është mjet i shkëlqyer për ndjekjen e progresit.',
  },
  {
    name: 'Dion Berisha',
    role: 'Student, Pejë',
    image: './etesti-icon.svg',
    text: 'Praktika e personalizuar më ndihmoi shumë të përmirësohem në lëndët ku kisha vështirësi.',
  },
  {
    name: 'Era Gashi',
    role: 'Studente, Ferizaj',
    image: './etesti-icon.svg',
    text: 'Platformë shumë e lehtë për përdorim dhe shumë efektive për përgatitje serioze.',
  },
];



export default function TestimonialsSection() {
    if (!testimonials.length) return null;
  
    const [activeIndex, setActiveIndex] = useState(0);
  
    const prev = () => {
      setActiveIndex((i) =>
        i === 0 ? testimonials.length - 1 : i - 1
      );
    };
  
    const next = () => {
      setActiveIndex((i) =>
        i === testimonials.length - 1 ? 0 : i + 1
      );
    };
  
    return (
      <section
        className="bg-[#EEF2FF] text-center"
      >
        <div className="space-y-6 max-w-3xl mx-auto">
        <Badge className="bg-[#F7F9FF] text-[#5684FF] border-0 rounded-full text-[16px] font-normal px-6 py-3">
              Dëshmitë
            </Badge>
          <h2 className="text-4xl md:text-5xl font-bold">
            Çfarë thonë studentët tanë
          </h2>
  
          <p className="text-lg md:text-2xl text-muted-foreground">
            Mijëra studentë kanë arritur rezultate të shkëlqyera me E-testi.
          </p>
        </div>
  
        <div className="relative mt-20 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center max-w-6xl mx-auto">
            {[-1, 0, 1].map((offset) => {
              const index =
                (activeIndex + offset + testimonials.length) %
                testimonials.length;
  
              const testimonial = testimonials[index];
  
              return (
                <TestimonialCard
                  key={`${index}-${offset}`}
                  testimonial={testimonial}
                  active={offset === 0}
                />
              );
            })}
          </div>
        </div>
  
        <div className="flex justify-center items-center gap-4 mt-14">
          <button onClick={prev}>
            <ChevronRight className="rotate-180 text-muted-foreground hover:text-primary" />
          </button>
  
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${
                i === activeIndex
                  ? "bg-[#5684FF]"
                  : "bg-[#CBD5E1]"
              }`}
            />
          ))}
  
          <button onClick={next}>
            <ChevronRight className="text-muted-foreground hover:text-primary" />
          </button>
        </div>
      </section>
    );
  }
  
  
  