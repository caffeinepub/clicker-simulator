import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { UPGRADES } from "../App";
import { formatNumber } from "../App";

interface UpgradeShopProps {
  coins: bigint;
  upgradesBought: string[];
  onBuyUpgrade: (
    id: string,
    cost: bigint,
    effect: bigint,
    upgradeType: string,
  ) => void;
}

export default function UpgradeShop({
  coins,
  upgradesBought,
  onBuyUpgrade,
}: UpgradeShopProps) {
  const [justBought, setJustBought] = useState<string | null>(null);

  const clickUpgrades = UPGRADES.filter((u) => u.upgradeType === "click");
  const passiveUpgrades = UPGRADES.filter((u) => u.upgradeType === "passive");

  const handleBuy = (upgrade: (typeof UPGRADES)[0]) => {
    onBuyUpgrade(upgrade.id, upgrade.cost, upgrade.effect, upgrade.upgradeType);
    setJustBought(upgrade.id);
    setTimeout(() => setJustBought(null), 600);
  };

  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
      className="rounded-3xl overflow-hidden"
      style={{
        background: "oklch(1 0 0 / 0.92)",
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 6px 0 oklch(0.82 0.06 90), 0 12px 40px oklch(0 0 0 / 0.1)",
        border: "2px solid oklch(0.92 0.04 90)",
      }}
    >
      {/* Shop header */}
      <div
        className="px-4 pt-4 pb-3 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.88 0.15 85), oklch(0.82 0.18 88))",
        }}
      >
        <h2
          className="text-xl font-game font-black"
          style={{ color: "oklch(0.25 0.05 60)" }}
        >
          🏪 Upgrade Shop
        </h2>
        <p
          className="text-sm font-game font-bold"
          style={{ color: "oklch(0.35 0.05 60)" }}
        >
          🪙 {formatNumber(Number(coins))} coins available
        </p>
      </div>

      <Tabs defaultValue="click" className="w-full">
        <TabsList
          className="grid w-full grid-cols-2 m-3 mb-0 rounded-xl"
          style={{ width: "calc(100% - 1.5rem)" }}
        >
          <TabsTrigger
            value="click"
            className="rounded-lg font-game font-bold text-sm data-[state=active]:bg-coin data-[state=active]:text-foreground"
          >
            ⚡ Click
          </TabsTrigger>
          <TabsTrigger
            value="passive"
            className="rounded-lg font-game font-bold text-sm data-[state=active]:bg-farm-green data-[state=active]:text-white"
          >
            🌱 Passive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="click" className="mt-0">
          <ScrollArea className="h-80 px-3 py-3">
            <div className="space-y-2">
              {clickUpgrades.map((upgrade, index) => (
                <UpgradeCard
                  key={upgrade.id}
                  upgrade={upgrade}
                  coins={coins}
                  isOwned={upgradesBought.includes(upgrade.id)}
                  isJustBought={justBought === upgrade.id}
                  onBuy={() => handleBuy(upgrade)}
                  index={index}
                  type="click"
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="passive" className="mt-0">
          <ScrollArea className="h-80 px-3 py-3">
            <div className="space-y-2">
              {passiveUpgrades.map((upgrade, index) => (
                <UpgradeCard
                  key={upgrade.id}
                  upgrade={upgrade}
                  coins={coins}
                  isOwned={upgradesBought.includes(upgrade.id)}
                  isJustBought={justBought === upgrade.id}
                  onBuy={() => handleBuy(upgrade)}
                  index={index}
                  type="passive"
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

interface UpgradeCardProps {
  upgrade: (typeof UPGRADES)[0];
  coins: bigint;
  isOwned: boolean;
  isJustBought: boolean;
  onBuy: () => void;
  index: number;
  type: "click" | "passive";
}

function UpgradeCard({
  upgrade,
  coins,
  isOwned,
  isJustBought,
  onBuy,
  index,
  type,
}: UpgradeCardProps) {
  const canAfford = coins >= upgrade.cost;
  const isDisabled = isOwned || !canAfford;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl p-3 border-2 transition-all"
      style={{
        background: isOwned
          ? "oklch(0.95 0.04 145)"
          : canAfford
            ? "oklch(0.99 0.01 90)"
            : "oklch(0.96 0.01 0)",
        borderColor: isOwned
          ? "oklch(0.65 0.2 145)"
          : canAfford
            ? type === "click"
              ? "oklch(0.82 0.18 88)"
              : "oklch(0.65 0.2 145)"
            : "oklch(0.85 0.01 0)",
        opacity: isOwned ? 0.8 : 1,
      }}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            background: isOwned
              ? "oklch(0.75 0.18 145)"
              : type === "click"
                ? "oklch(0.88 0.15 88)"
                : "oklch(0.88 0.12 145)",
          }}
        >
          {isOwned ? "✅" : upgrade.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div
            className="font-game font-bold text-sm truncate"
            style={{ color: "oklch(0.22 0.05 60)" }}
          >
            {upgrade.name}
          </div>
          <div
            className="font-game text-xs"
            style={{ color: "oklch(0.45 0.05 80)" }}
          >
            {upgrade.description}
          </div>
        </div>

        {/* Buy button or owned badge */}
        {isOwned ? (
          <div
            className="text-xs font-game font-black px-2 py-1 rounded-lg flex-shrink-0"
            style={{
              background: "oklch(0.65 0.2 145)",
              color: "white",
            }}
          >
            OWNED
          </div>
        ) : (
          <motion.button
            onClick={onBuy}
            disabled={isDisabled}
            className="flex-shrink-0 flex flex-col items-center justify-center text-xs font-game font-black px-2 py-1.5 rounded-xl cursor-pointer disabled:cursor-not-allowed transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              background: isJustBought
                ? "oklch(0.65 0.2 145)"
                : canAfford
                  ? type === "click"
                    ? "oklch(0.82 0.18 88)"
                    : "oklch(0.65 0.2 145)"
                  : "oklch(0.88 0.01 0)",
              color: canAfford ? "oklch(0.22 0.05 60)" : "oklch(0.6 0.01 0)",
              boxShadow: canAfford
                ? type === "click"
                  ? "0 3px 0 oklch(0.62 0.16 82)"
                  : "0 3px 0 oklch(0.48 0.18 140)"
                : "none",
            }}
            whileTap={canAfford ? { scale: 0.95, y: 2 } : {}}
            aria-label={`Buy ${upgrade.name} for ${formatNumber(Number(upgrade.cost))} coins`}
          >
            <span>{isJustBought ? "✓" : "BUY"}</span>
            <span className="text-xs">
              🪙{formatNumber(Number(upgrade.cost))}
            </span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
