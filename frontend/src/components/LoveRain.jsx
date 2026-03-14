import { motion } from 'framer-motion'

export default function LoveRain() {
    const hearts = [...Array(20)].map((_, i) => ({
        id: i,
        size: Math.random() * 20 + 10,
        left: Math.random() * 100 + "%",
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 10,
    }))

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {hearts.map((heart) => (
                <motion.div
                    key={heart.id}
                    initial={{ y: -50, x: 0, opacity: 0 }}
                    animate={{
                        y: "110vh",
                        x: [0, 20, -20, 0],
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: heart.duration,
                        delay: heart.delay,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        left: heart.left,
                        fontSize: heart.size,
                        color: '#ff69b4',
                        filter: 'drop-shadow(0 0 10px rgba(255, 105, 180, 0.9))'
                    }}
                >
                    ❤️
                </motion.div>
            ))}

            {/* Pink "Splashes" (Glowing blurred circles) */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={`splash-${i}`}
                    initial={{ y: -100, x: Math.random() * 100 + "%", scale: 0, opacity: 0 }}
                    animate={{
                        y: "110vh",
                        scale: [0.8, 1.8, 1.2],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 8,
                        delay: Math.random() * 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute w-64 h-64 bg-pink-500/15 rounded-full blur-[120px]"
                />
            ))}
        </div>
    )
}
