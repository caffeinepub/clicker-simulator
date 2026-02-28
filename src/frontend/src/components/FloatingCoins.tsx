import { AnimatePresence, motion } from "motion/react";
import type { FloatLabel } from "../App";

interface FloatingCoinsProps {
  labels: FloatLabel[];
}

export default function FloatingCoins({ labels }: FloatingCoinsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {labels.map((label) => (
          <motion.div
            key={label.id}
            className="absolute font-game font-black"
            style={{
              left: label.x,
              top: label.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -90, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <span
              className="text-xl drop-shadow-md"
              style={{
                color: label.isCustomer
                  ? "oklch(0.65 0.22 35)"
                  : "oklch(0.55 0.18 88)",
                textShadow:
                  "0 2px 4px oklch(0 0 0 / 0.3), 0 0 0 2px oklch(1 0 0 / 0.8)",
                WebkitTextStroke: "1px oklch(1 0 0 / 0.6)",
              }}
            >
              +{label.amount} {label.isCustomer ? "🛒" : "🪙"}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
