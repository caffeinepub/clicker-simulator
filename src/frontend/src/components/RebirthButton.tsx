import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { formatNumber } from "../App";

interface RebirthButtonProps {
  coins: bigint;
  rebirthCount: bigint;
  rebirthBonus: bigint;
  onRebirth: () => Promise<void>;
}

export default function RebirthButton({
  coins: _coins,
  rebirthCount,
  rebirthBonus,
  onRebirth,
}: RebirthButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const nextCount = Number(rebirthCount) + 1;
  const nextBonus = Number(rebirthBonus) + 50;

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onRebirth();
      setOpen(false);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: celebration particles are static count
                key={i}
                className="absolute text-3xl"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * window.innerWidth * 0.8,
                  y: (Math.random() - 0.5) * window.innerHeight * 0.8,
                  opacity: 0,
                  scale: 1.5,
                  rotate: (Math.random() - 0.5) * 360,
                }}
                transition={{ duration: 2, delay: i * 0.05, ease: "easeOut" }}
              >
                {["⭐", "🌟", "✨", "💫", "🎉", "🎊"][i % 6]}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-white rounded-3xl p-8 shadow-2xl border-4"
              style={{ borderColor: "oklch(0.62 0.2 290)" }}
            >
              <div className="text-6xl mb-3">🌟</div>
              <h3
                className="text-3xl font-game font-black"
                style={{ color: "oklch(0.62 0.2 290)" }}
              >
                REBIRTH!
              </h3>
              <p
                className="font-game font-bold text-lg mt-1"
                style={{ color: "oklch(0.35 0.05 60)" }}
              >
                Level {nextCount} Farmer!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rebirth button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="relative rounded-3xl px-8 py-4 font-game font-black text-white text-lg cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-rebirth-purple overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.62 0.2 290), oklch(0.72 0.18 310))",
          boxShadow:
            "0 6px 0 oklch(0.45 0.18 290), 0 10px 30px oklch(0.62 0.2 290 / 0.4)",
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97, y: 4 }}
        animate={{
          boxShadow: [
            "0 6px 0 oklch(0.45 0.18 290), 0 10px 30px oklch(0.62 0.2 290 / 0.3)",
            "0 6px 0 oklch(0.45 0.18 290), 0 10px 50px oklch(0.62 0.2 290 / 0.6)",
            "0 6px 0 oklch(0.45 0.18 290), 0 10px 30px oklch(0.62 0.2 290 / 0.3)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        aria-label="Rebirth - reset progress for a permanent bonus"
      >
        {/* Shimmer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(1 0 0 / 0.15), transparent)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <span className="relative z-10 flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            🌟
          </motion.span>
          <span>REBIRTH {Number(rebirthCount)}/10</span>
          <motion.span
            animate={{ rotate: [0, -360] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            🌟
          </motion.span>
        </span>

        {/* Next bonus preview */}
        <div className="relative z-10 text-xs font-bold opacity-80 mt-0.5">
          +{nextBonus}% multiplier next rebirth
        </div>
      </motion.button>

      {/* Confirmation dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="rounded-3xl border-2 max-w-sm"
          style={{ borderColor: "oklch(0.62 0.2 290)" }}
        >
          <DialogHeader>
            <div className="text-5xl text-center mb-2">🌟</div>
            <DialogTitle className="text-center font-game font-black text-2xl text-rebirth">
              Ready to Rebirth?
            </DialogTitle>
            <DialogDescription
              className="text-center font-game text-base"
              style={{ color: "oklch(0.35 0.05 60)" }}
            >
              This will <strong>reset all your coins and upgrades</strong>, but
              grant you a permanent{" "}
              <strong style={{ color: "oklch(0.62 0.2 290)" }}>
                +50% bonus multiplier
              </strong>
              !
            </DialogDescription>
          </DialogHeader>

          <div
            className="my-2 rounded-2xl p-4 text-center"
            style={{ background: "oklch(0.95 0.04 290)" }}
          >
            <div
              className="font-game font-black text-lg"
              style={{ color: "oklch(0.42 0.18 290)" }}
            >
              Rebirth Level: {Number(rebirthCount)} → {nextCount}
            </div>
            <div
              className="font-game font-bold text-sm mt-1"
              style={{ color: "oklch(0.52 0.14 290)" }}
            >
              Bonus: {Number(rebirthBonus)}% → {nextBonus}%
            </div>
            <div
              className="font-game text-xs mt-2"
              style={{ color: "oklch(0.55 0.08 60)" }}
            >
              ⚠️ All coins and upgrades will be lost
            </div>
          </div>

          <DialogFooter className="flex gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="flex-1 rounded-xl font-game font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isPending}
              className="flex-1 rounded-xl font-game font-bold text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.2 290), oklch(0.72 0.18 310))",
              }}
            >
              {isPending ? "✨ Rebirthing..." : "🌟 Rebirth!"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
