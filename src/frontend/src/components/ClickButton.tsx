import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

interface ClickButtonProps {
  onClick: (e: React.MouseEvent) => void;
  animKey: number;
}

const SPARKLE_POSITIONS = [
  { x: -60, y: -60 },
  { x: 60, y: -60 },
  { x: -80, y: 0 },
  { x: 80, y: 0 },
  { x: -60, y: 60 },
  { x: 60, y: 60 },
  { x: 0, y: -80 },
  { x: 0, y: 80 },
];

const SPARKLE_EMOJIS = ["✨", "⭐", "💫", "🌟", "✨", "💫", "⭐", "🌟"];

export default function ClickButton({ onClick, animKey }: ClickButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      setIsPressed(true);
      setShowSparkles(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsPressed(false);
        setShowSparkles(false);
      }, 350);

      onClick(e);
    },
    [onClick],
  );

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 220,
          height: 220,
          background:
            "radial-gradient(circle, oklch(0.86 0.2 88 / 0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Decorative ring */}
      <motion.div
        className="absolute rounded-full border-4 border-dashed pointer-events-none"
        style={{
          width: 190,
          height: 190,
          borderColor: "oklch(0.82 0.18 88 / 0.4)",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Sparkles */}
      <AnimatePresence>
        {showSparkles &&
          SPARKLE_POSITIONS.map((pos, i) => (
            <motion.span
              // biome-ignore lint/suspicious/noArrayIndexKey: sparkle positions are static array
              key={`spark-${animKey}-${i}`}
              className="absolute pointer-events-none text-lg z-10"
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
                x: pos.x,
                y: pos.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
            >
              {SPARKLE_EMOJIS[i]}
            </motion.span>
          ))}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={handleClick}
        className="relative z-10 rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-coin"
        style={{
          width: 160,
          height: 160,
          background: isPressed
            ? "radial-gradient(circle at 50% 60%, oklch(0.75 0.2 88), oklch(0.65 0.18 88))"
            : "radial-gradient(circle at 40% 35%, oklch(0.92 0.18 90), oklch(0.78 0.22 82))",
          boxShadow: isPressed
            ? "0 2px 0 oklch(0.55 0.18 82), 0 4px 12px oklch(0 0 0 / 0.2), inset 0 2px 4px oklch(0 0 0 / 0.15)"
            : "0 8px 0 oklch(0.55 0.18 82), 0 12px 30px oklch(0 0 0 / 0.2), inset 0 2px 4px oklch(1 0 0 / 0.3)",
          transform: isPressed ? "translateY(6px)" : "translateY(0)",
          transition:
            "transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease",
          border: "3px solid oklch(0.65 0.18 82)",
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Click to harvest!"
      >
        {/* Inner highlight */}
        <div
          className="absolute top-3 left-6 w-12 h-6 rounded-full pointer-events-none opacity-50"
          style={{
            background:
              "radial-gradient(ellipse, oklch(1 0 0 / 0.5), transparent)",
          }}
        />

        {/* Emoji */}
        <motion.span
          className="text-6xl drop-shadow-md"
          animate={
            isPressed ? { scale: 0.85, rotate: -5 } : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.15 }}
        >
          🌾
        </motion.span>
      </motion.button>

      {/* Label below */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-game font-black text-sm"
        style={{ color: "oklch(0.3 0.06 80)" }}
      >
        TAP TO HARVEST!
      </div>
    </div>
  );
}
