import { useCallback, useMemo } from 'react'
import { motion } from 'motion/react'

interface EmojiRainProps {
  active: boolean
}

interface EmojiParticle {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  rotation: number
}

export default function EmojiRain({ active }: EmojiRainProps) {
  const particles: EmojiParticle[] = useMemo(() => {
    if (!active) return []
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 20 + Math.random() * 28,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      rotation: Math.random() * 360,
    }))
  }, [active])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <EmojiDrop key={p.id} particle={p} />
      ))}
    </div>
  )
}

function EmojiDrop({ particle }: { particle: EmojiParticle }) {
  const handleComplete = useCallback(() => {
    // Particle animation complete — no cleanup needed since parent controls lifecycle
  }, [])

  return (
    <motion.div
      initial={{
        y: -60,
        x: `${particle.left}vw`,
        rotate: particle.rotation,
        opacity: 0,
      }}
      animate={{
        y: '105vh',
        rotate: particle.rotation + 360,
        opacity: [0, 1, 1, 0.8, 0],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        ease: 'linear',
      }}
      onAnimationComplete={handleComplete}
      className="absolute top-0"
      style={{
        fontSize: particle.size,
        left: 0,
        willChange: 'transform',
      }}
    >
      🖕
    </motion.div>
  )
}
