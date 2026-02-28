import { motion } from "motion/react";

export default function SunDecoration() {
  return (
    <>
      {/* Big sun in upper right */}
      <div className="fixed top-[-20px] right-[-20px] pointer-events-none z-0">
        {/* Outer rays */}
        <motion.div
          className="absolute"
          style={{
            width: 180,
            height: 180,
            top: -20,
            right: -20,
            background:
              "conic-gradient(from 0deg, oklch(0.92 0.18 88 / 0.0) 0deg, oklch(0.92 0.18 88 / 0.3) 10deg, oklch(0.92 0.18 88 / 0.0) 20deg, oklch(0.92 0.18 88 / 0.3) 30deg, oklch(0.92 0.18 88 / 0.0) 40deg, oklch(0.92 0.18 88 / 0.3) 50deg, oklch(0.92 0.18 88 / 0.0) 60deg, oklch(0.92 0.18 88 / 0.3) 70deg, oklch(0.92 0.18 88 / 0.0) 80deg, oklch(0.92 0.18 88 / 0.3) 90deg, oklch(0.92 0.18 88 / 0.0) 100deg, oklch(0.92 0.18 88 / 0.3) 110deg, oklch(0.92 0.18 88 / 0.0) 120deg)",
            borderRadius: "50%",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        {/* Sun circle */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 35%, oklch(0.95 0.2 90), oklch(0.82 0.22 82))",
            boxShadow: "0 0 40px oklch(0.86 0.2 88 / 0.6)",
            position: "absolute",
            top: 10,
            right: 10,
          }}
        />
        {/* Sun face */}
        <div
          className="absolute text-2xl flex items-center justify-center"
          style={{ top: 28, right: 28, width: 64, height: 64 }}
        >
          😊
        </div>
      </div>

      {/* Farm hill at bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 h-32"
        style={{
          background:
            "linear-gradient(to top, oklch(0.55 0.2 140), oklch(0.68 0.18 140) 60%, transparent)",
          borderRadius: "50% 50% 0 0 / 20% 20% 0 0",
        }}
      />

      {/* Small decorative flowers */}
      <FloatingDecor
        emoji="🌻"
        style={{ bottom: "10%", left: "5%" }}
        delay={0}
      />
      <FloatingDecor
        emoji="🌸"
        style={{ bottom: "8%", left: "18%" }}
        delay={0.5}
      />
      <FloatingDecor
        emoji="🌼"
        style={{ bottom: "12%", left: "82%" }}
        delay={1}
      />
      <FloatingDecor
        emoji="🌺"
        style={{ bottom: "9%", right: "5%" }}
        delay={1.5}
      />
    </>
  );
}

function FloatingDecor({
  emoji,
  style,
  delay,
}: {
  emoji: string;
  style: React.CSSProperties;
  delay: number;
}) {
  return (
    <motion.div
      className="fixed pointer-events-none z-0 text-3xl"
      style={style}
      animate={{ y: [0, -6, 0] }}
      transition={{
        duration: 3 + delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay,
      }}
    >
      {emoji}
    </motion.div>
  );
}
