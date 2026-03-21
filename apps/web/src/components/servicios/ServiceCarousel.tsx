'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Props {
  images: string[]
  alt: string
}

export default function ServiceCarousel({ images, alt }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length)
    }, 5000)
    return () => clearInterval(id)
  }, [images.length])

  return (
    <div className="absolute inset-0">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          priority={i === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
          style={{
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.2s ease-in-out',
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(26,31,58,0.35) 0%, transparent 50%)' }}
      />
    </div>
  )
}
