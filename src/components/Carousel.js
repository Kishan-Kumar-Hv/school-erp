'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel({ schoolName = 'Holy Cross Sisters School' }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/assets/holy_cross_hero.png",
      title: `Welcome to ${schoolName}`,
      desc: "Providing holistic development, modern digital learning, and quality education for future leaders."
    },
    {
      image: "/assets/extracurricular_sports.png",
      title: "Champions In Sports & Physical Education",
      desc: "Nurturing discipline, teamwork, and athletic excellence through state-of-the-art sports coaching."
    },
    {
      image: "/assets/extracurricular_coding.png",
      title: "STEM & Digital Education Labs",
      desc: "Preparing students for a digital future with coding classes, robot design, and advanced science equipment."
    },
    {
      image: "/assets/extracurricular_art.png",
      title: "Creative Expression, Pottery & Craft Workshops",
      desc: "Unlocking artistic potential through pottery wheels, painting lessons, and traditional craft creation."
    },
    {
      image: "/assets/extracurricular_drama.png",
      title: "Creative Arts, Drama & Performing Clubs",
      desc: "Boosting student self-confidence and speech articulation with our drama, debate, and music modules."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel-wrapper relative w-full overflow-hidden bg-[#1D2731]" style={{ height: '480px' }}>
      {slides.map((slide, idx) => (
        <div 
          key={idx} 
          className={`carousel-slide absolute inset-0 w-full h-full flex items-end transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'active opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="carousel-image absolute inset-0 w-full h-full object-cover" 
          />
          <div className="carousel-overlay absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 md:p-16 z-20 text-white">
            <h2 className="carousel-title font-serif text-2xl md:text-4xl font-bold mb-2.5 text-[#D9B310] tracking-wide leading-tight drop-shadow-md">
              {slide.title.toUpperCase()}
            </h2>
            <p className="carousel-desc text-xs md:text-base max-w-[750px] text-slate-200 font-medium leading-relaxed drop-shadow-sm">
              {slide.desc}
            </p>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide} 
        className="carousel-nav-btn absolute left-6 top-1/2 -translate-y-1/2 bg-[#0B3C5D]/60 hover:bg-[#0B3C5D] text-white w-11 h-11 rounded-full flex items-center justify-center z-30 transition-all focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>
      <button 
        onClick={nextSlide} 
        className="carousel-nav-btn absolute right-6 top-1/2 -translate-y-1/2 bg-[#0B3C5D]/60 hover:bg-[#0B3C5D] text-white w-11 h-11 rounded-full flex items-center justify-center z-30 transition-all focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className="w-2.5 h-2.5 rounded-full p-0 border-none cursor-pointer transition-all"
            style={{
              backgroundColor: idx === currentSlide ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
