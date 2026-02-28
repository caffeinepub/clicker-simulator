import { motion } from "motion/react";
import { formatNumber } from "../App";

interface GameHUDProps {
  coins: bigint;
  clickPower: bigint;
  passiveRate: bigint;
  rebirthCount: bigint;
  rebirthBonus: bigint;
}

export default function GameHUD({
  coins,
  clickPower,
  passiveRate,
  rebirthCount,
  rebirthBonus,
}: GameHUDProps) {
  const rebirthStars = Array.from(
    { length: Number(rebirthCount) },
    (_, i) => i,
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-card px-4 py-2.5 border-2 border-white"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Coins */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
                  Coins
                </div>
                <motion.div
                  key={coins.toString()}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="text-xl font-game font-black text-coin leading-tight"
                >
                  {formatNumber(Number(coins))}
                </motion.div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-border hidden sm:block" />

            {/* Click power */}
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
                  Per Click
                </div>
                <div className="text-lg font-game font-black text-sun-orange leading-tight">
                  +{formatNumber(Number(clickPower))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-border hidden sm:block" />

            {/* Passive rate */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🕐</span>
              <div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
                  Per 10s
                </div>
                <div className="text-lg font-game font-black text-farm-green leading-tight">
                  +{formatNumber(Number(passiveRate))}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-border hidden sm:block" />

            {/* Rebirth */}
            <div className="flex items-center gap-2">
              <span className="text-xl">🌟</span>
              <div>
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
                  Rebirth
                </div>
                <div className="text-lg font-game font-black text-rebirth leading-tight">
                  {Number(rebirthCount)}/10
                </div>
              </div>
              {rebirthStars.length > 0 && (
                <div className="hidden sm:flex flex-wrap max-w-16 gap-0.5">
                  {rebirthStars.map((i) => (
                    <span key={i} className="text-xs leading-none">
                      ⭐
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bonus multiplier (if any rebirth done) */}
            {rebirthCount > 0n && (
              <>
                <div className="w-px h-10 bg-border hidden sm:block" />
                <div className="flex items-center gap-1">
                  <span className="text-lg">✨</span>
                  <div>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
                      Bonus
                    </div>
                    <div className="text-base font-game font-black text-rebirth leading-tight">
                      +{Number(rebirthBonus)}%
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
