import Image from 'next/image'

export default function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="Qué Bárbaro"
      width={2165}
      height={743}
      className={className}
      aria-hidden
    />
  )
}
