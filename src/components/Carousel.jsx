import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/assets/hero.png",
      title: "Welcome to Holy Cross Sisters School, Hassan",
      desc: "Providing holistic development and quality education under the guidance of the Sisters of Mercy."
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
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel-wrapper">
      {slides.map((slide, idx) => (
        <div 
          key={idx} 
          className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}
        >
          <img src={slide.image} alt={slide.title} className="carousel-image" />
          <div className="carousel-overlay">
            <h2 className="carousel-title">{slide.title}</h2>
            <p className="carousel-desc">{slide.desc}</p>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="carousel-nav-btn carousel-prev" aria-label="Previous slide">
        <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="carousel-nav-btn carousel-next" aria-label="Next slide">
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators / Dots */}
      <div style={{
        position: 'absolute',
        bottom: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 5,
        display: 'flex',
        gap: '8px'
      }}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: idx === currentSlide ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
