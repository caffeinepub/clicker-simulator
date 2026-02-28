import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ClickButton from "./components/ClickButton";
import CustomerSpawner from "./components/CustomerSpawner";
import FloatingCoins from "./components/FloatingCoins";
import GameHUD from "./components/GameHUD";
import RebirthButton from "./components/RebirthButton";
import SunDecoration from "./components/SunDecoration";
import UpgradeShop from "./components/UpgradeShop";
import { useActor } from "./hooks/useActor";

export interface PlayerState {
  rebirthCount: bigint;
  clickPower: bigint;
  coins: bigint;
  passiveRate: bigint;
  rebirthBonus: bigint;
  upgradesBought: Array<string>;
  lastClaim: bigint;
}

export interface FloatLabel {
  id: number;
  x: number;
  y: number;
  amount: number;
  isCustomer?: boolean;
}

export const UPGRADES = [
  {
    id: "better_hands",
    name: "Better Hands",
    description: "+1 coin per click",
    cost: 50n,
    effect: 1n,
    upgradeType: "click",
    emoji: "👐",
  },
  {
    id: "golden_fork",
    name: "Golden Fork",
    description: "+5 coins per click",
    cost: 200n,
    effect: 5n,
    upgradeType: "click",
    emoji: "🍴",
  },
  {
    id: "magic_hoe",
    name: "Magic Hoe",
    description: "+20 coins per click",
    cost: 800n,
    effect: 20n,
    upgradeType: "click",
    emoji: "⚒️",
  },
  {
    id: "enchanted_gloves",
    name: "Enchanted Gloves",
    description: "+80 coins per click",
    cost: 3000n,
    effect: 80n,
    upgradeType: "click",
    emoji: "🧤",
  },
  {
    id: "divine_harvest",
    name: "Divine Harvest",
    description: "+300 coins per click",
    cost: 12000n,
    effect: 300n,
    upgradeType: "click",
    emoji: "✨",
  },
  {
    id: "scarecrow",
    name: "Scarecrow",
    description: "+5 coins/10s",
    cost: 100n,
    effect: 5n,
    upgradeType: "passive",
    emoji: "🪆",
  },
  {
    id: "irrigation",
    name: "Irrigation",
    description: "+20 coins/10s",
    cost: 400n,
    effect: 20n,
    upgradeType: "passive",
    emoji: "💧",
  },
  {
    id: "greenhouse",
    name: "Greenhouse",
    description: "+80 coins/10s",
    cost: 1500n,
    effect: 80n,
    upgradeType: "passive",
    emoji: "🏡",
  },
  {
    id: "robot_farmer",
    name: "Robot Farmer",
    description: "+300 coins/10s",
    cost: 6000n,
    effect: 300n,
    upgradeType: "passive",
    emoji: "🤖",
  },
  {
    id: "magical_garden",
    name: "Magical Garden",
    description: "+1000 coins/10s",
    cost: 25000n,
    effect: 1000n,
    upgradeType: "passive",
    emoji: "🌟",
  },
];

let floatIdCounter = 0;

export default function App() {
  const { actor, isFetching } = useActor();
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [coins, setCoins] = useState<bigint>(0n);
  const [floatLabels, setFloatLabels] = useState<FloatLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clickAnimKey, setClickAnimKey] = useState(0);
  const passiveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  // Load initial state
  useEffect(() => {
    if (!actor || isFetching) return;

    const loadState = async () => {
      try {
        const state = await actor.getPlayerState();
        setPlayerState(state);
        setCoins(state.coins);
      } catch (err) {
        console.error("Failed to load player state:", err);
        toast.error("Failed to load game data");
      } finally {
        setIsLoading(false);
      }
    };

    loadState();
  }, [actor, isFetching]);

  // Passive income every 10s
  // biome-ignore lint/correctness/useExhaustiveDependencies: we deliberately re-create interval when passiveRate changes
  useEffect(() => {
    if (!actor || !playerState) return;

    if (passiveIntervalRef.current) clearInterval(passiveIntervalRef.current);

    passiveIntervalRef.current = setInterval(async () => {
      try {
        const earned = await actor.claimPassive();
        if (earned > 0n) {
          setCoins((prev) => prev + earned);
          setPlayerState((prev) =>
            prev ? { ...prev, coins: prev.coins + earned } : prev,
          );
          addFloatLabel(
            window.innerWidth / 2,
            window.innerHeight / 2,
            Number(earned),
            false,
          );
          toast(`🌾 +${formatNumber(Number(earned))} passive coins!`, {
            duration: 2000,
            className: "game-toast",
          });
        }
      } catch (err) {
        console.error("Passive claim error:", err);
      }
    }, 10000);

    return () => {
      if (passiveIntervalRef.current) clearInterval(passiveIntervalRef.current);
    };
  }, [actor, playerState?.passiveRate]);

  const addFloatLabel = useCallback(
    (x: number, y: number, amount: number, isCustomer = false) => {
      const id = floatIdCounter++;
      setFloatLabels((prev) => [...prev, { id, x, y, amount, isCustomer }]);
      setTimeout(() => {
        setFloatLabels((prev) => prev.filter((l) => l.id !== id));
      }, 1300);
    },
    [],
  );

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      if (!actor) return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;

      const clickVal = Number(playerState?.clickPower ?? 1n);
      setCoins((prev) => prev + BigInt(clickVal));
      setClickAnimKey((k) => k + 1);
      addFloatLabel(
        x + (Math.random() - 0.5) * 60,
        y + (Math.random() - 0.5) * 30,
        clickVal,
      );

      try {
        const newTotal = await actor.click();
        setCoins(newTotal);
        setPlayerState((prev) => (prev ? { ...prev, coins: newTotal } : prev));
      } catch (err) {
        console.error("Click error:", err);
        setCoins((prev) => prev - BigInt(clickVal));
      }
    },
    [actor, playerState?.clickPower, addFloatLabel],
  );

  const handleCustomerClick = useCallback(
    async (amount: number, x: number, y: number) => {
      if (!actor) return;
      setCoins((prev) => prev + BigInt(amount));
      addFloatLabel(x, y, amount, true);

      try {
        const newTotal = await actor.click();
        setCoins(newTotal);
        setPlayerState((prev) => (prev ? { ...prev, coins: newTotal } : prev));
      } catch (err) {
        console.error("Customer click error:", err);
      }
    },
    [actor, addFloatLabel],
  );

  const handleBuyUpgrade = useCallback(
    async (id: string, cost: bigint, effect: bigint, upgradeType: string) => {
      if (!actor || !playerState) return;
      if (coins < cost) {
        toast.error("Not enough coins!");
        return;
      }

      setCoins((prev) => prev - cost);
      setPlayerState((prev) =>
        prev
          ? {
              ...prev,
              coins: prev.coins - cost,
              upgradesBought: [...prev.upgradesBought, id],
              clickPower:
                upgradeType === "click"
                  ? prev.clickPower + effect
                  : prev.clickPower,
              passiveRate:
                upgradeType === "passive"
                  ? prev.passiveRate + effect
                  : prev.passiveRate,
            }
          : prev,
      );

      try {
        const result = await actor.buyUpgrade(id, cost, effect, upgradeType);
        if (result.__kind__ === "ok") {
          setPlayerState(result.ok);
          setCoins(result.ok.coins);
          toast.success("✅ Purchased upgrade!");
        } else {
          toast.error(`Failed: ${result.err}`);
          const state = await actor.getPlayerState();
          setPlayerState(state);
          setCoins(state.coins);
        }
      } catch (err) {
        console.error("Buy upgrade error:", err);
        toast.error("Purchase failed");
        const state = await actor.getPlayerState();
        setPlayerState(state);
        setCoins(state.coins);
      }
    },
    [actor, playerState, coins],
  );

  const handleRebirth = useCallback(async () => {
    if (!actor) return;

    try {
      const result = await actor.rebirth();
      if (result.__kind__ === "ok") {
        const newRebirthCount = result.ok;
        toast.success(
          `🌟 Rebirth ${newRebirthCount}! Bonus multiplier active!`,
          { duration: 4000 },
        );
        const state = await actor.getPlayerState();
        setPlayerState(state);
        setCoins(state.coins);
      } else {
        toast.error(`Rebirth failed: ${result.err}`);
      }
    } catch (err) {
      console.error("Rebirth error:", err);
      toast.error("Rebirth failed");
    }
  }, [actor]);

  if (isLoading || isFetching) {
    return (
      <div className="farm-bg min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-8xl mb-4 animate-bounce">🌻</div>
          <p className="text-2xl font-game font-bold text-white drop-shadow-lg">
            Growing your farm...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="farm-bg min-h-screen relative overflow-hidden font-game select-none">
      {/* Decorative sun */}
      <SunDecoration />

      {/* Floating coin labels */}
      <FloatingCoins labels={floatLabels} />

      {/* Customers - fixed positioned across entire screen */}
      <CustomerSpawner
        clickPower={playerState?.clickPower ?? 1n}
        onCustomerClick={handleCustomerClick}
      />

      {/* Background clouds */}
      <Cloud style={{ top: "8%", left: "5%", animationDelay: "0s" }} />
      <Cloud style={{ top: "12%", left: "60%", animationDelay: "3s" }} />
      <Cloud style={{ top: "5%", left: "35%", animationDelay: "6s" }} />

      {/* HUD */}
      <GameHUD
        coins={coins}
        clickPower={playerState?.clickPower ?? 1n}
        passiveRate={playerState?.passiveRate ?? 0n}
        rebirthCount={playerState?.rebirthCount ?? 0n}
        rebirthBonus={playerState?.rebirthBonus ?? 0n}
      />

      {/* Main game area */}
      <main className="relative pt-28 pb-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* Center: click area */}
          <div className="flex-1 flex flex-col items-center gap-6 min-w-0">
            {/* Click button */}
            <div className="relative mt-8">
              <ClickButton onClick={handleClick} animKey={clickAnimKey} />
            </div>

            {/* Rebirth */}
            {(playerState?.rebirthCount ?? 0n) < 10n && (
              <RebirthButton
                coins={coins}
                rebirthCount={playerState?.rebirthCount ?? 0n}
                rebirthBonus={playerState?.rebirthBonus ?? 0n}
                onRebirth={handleRebirth}
              />
            )}

            {/* Max rebirth badge */}
            {(playerState?.rebirthCount ?? 0n) >= 10n && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-rebirth-purple text-white px-6 py-3 rounded-full font-game font-black text-lg shadow-game-purple"
              >
                🏆 MAX REBIRTH ACHIEVED! 🏆
              </motion.div>
            )}
          </div>

          {/* Right: upgrade shop */}
          <div className="lg:w-80 w-full">
            <UpgradeShop
              coins={coins}
              upgradesBought={playerState?.upgradesBought ?? []}
              onBuyUpgrade={handleBuyUpgrade}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 text-sm text-white/60 font-game">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white/90 transition-colors"
        >
          caffeine.ai
        </a>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
}

function Cloud({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute pointer-events-none opacity-80"
      style={style}
      animate={{ x: [0, 30, 0] }}
      transition={{
        duration: 8 + Math.random() * 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      <div className="text-5xl">☁️</div>
    </motion.div>
  );
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toLocaleString();
}
