"use client";
import React, { useState } from "react";
import Image from 'next/image'

const images = [
  "https://media.bighaat.com/wsfbanners/b59d109c-4222-4f9d-ba6c-268a8ab771f9.webp?w=1920&q=80",
  "https://media.bighaat.com/wsfbanners/f56e1eaa-702c-48fd-8efc-ed7c9592ba19.webp?w=1920&q=80",
  "https://media.bighaat.com/wsfbanners/aab04e5f-477c-44b0-97be-169b6e784af6.webp?w=1920&q=80",
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full px-4 mx-auto border-2 border-gray-300 p-2 ">
      <div className=" rounded-lg">
        <Image
          src={images[current]}
          alt={`Slide ${current + 1}`}
          className="w-full h-120 object-cover carousel-img"
          width={1200}
          height={480}
        />
      </div>
      {/* <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2  rounded-full p-2"
        aria-label="Previous Slide"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2  rounded-full p-2"
        aria-label="Next Slide"
      >
        &#8594;
      </button> */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === current ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
}