import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Customer {
  id: number;
  x: number;
  y: number;
  emoji: string;
  product: string;
  reward: number;
  popping: boolean;
}

interface CustomerSpawnerProps {
  clickPower: bigint;
  onCustomerClick: (amount: number, x: number, y: number) => void;
}

const CUSTOMER_EMOJIS = ["🧑‍🌾", "👩‍🍳", "👧", "👦", "🧓", "👩", "🧑"];
const PRODUCT_EMOJIS = [
  "🍎",
  "🥕",
  "🍆",
  "🍋",
  "🥦",
  "🍓",
  "🍇",
  "🌽",
  "🥑",
  "🍑",
  "🫑",
  "🥬",
];

let customerIdCounter = 1000;

export default function CustomerSpawner({
  clickPower,
  onCustomerClick,
}: CustomerSpawnerProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const spawnTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const customerTimeoutsRef = useRef<
    Map<number, ReturnType<typeof setTimeout>>
  >(new Map());

  const spawnCustomer = useCallback(() => {
    // Spawn in the playable area (between HUD and bottom, across width)
    const margin = 80;
    const topOffset = 110; // below HUD
    const bottomMax = window.innerHeight - 200; // above footer

    const x = margin + Math.random() * (window.innerWidth - margin * 2);
    const y = topOffset + Math.random() * (bottomMax - topOffset);

    const customerEmoji =
      CUSTOMER_EMOJIS[Math.floor(Math.random() * CUSTOMER_EMOJIS.length)];
    const productEmoji =
      PRODUCT_EMOJIS[Math.floor(Math.random() * PRODUCT_EMOJIS.length)];

    const baseReward = Math.max(
      5,
      Math.floor(Number(clickPower) * (0.5 + Math.random() * 2)),
    );
    const reward = Math.min(
      50 + Number(clickPower) * 3,
      Math.max(5, baseReward),
    );

    const id = customerIdCounter++;
    const customer: Customer = {
      id,
      x,
      y,
      emoji: customerEmoji,
      product: productEmoji,
      reward,
      popping: false,
    };

    setCustomers((prev) => {
      if (prev.length >= 5) return prev;
      return [...prev, customer];
    });

    // Auto-remove after 4 seconds
    const removeTimeout = setTimeout(() => {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      customerTimeoutsRef.current.delete(id);
    }, 4000);
    customerTimeoutsRef.current.set(id, removeTimeout);
  }, [clickPower]);

  const scheduleNextSpawn = useCallback(() => {
    const delay = 5000 + Math.random() * 10000; // 5-15 seconds
    if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    spawnTimeoutRef.current = setTimeout(() => {
      spawnCustomer();
      scheduleNextSpawn();
    }, delay);
  }, [spawnCustomer]);

  useEffect(() => {
    // Spawn first customer after a short delay
    const initialTimeout = setTimeout(() => {
      spawnCustomer();
    }, 2500);

    scheduleNextSpawn();

    return () => {
      clearTimeout(initialTimeout);
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      for (const timeout of customerTimeoutsRef.current.values())
        clearTimeout(timeout);
      customerTimeoutsRef.current.clear();
    };
  }, [spawnCustomer, scheduleNextSpawn]);

  const handleCustomerClick = useCallback(
    (customer: Customer, e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top;

      // Mark as popping
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, popping: true } : c)),
      );

      // Cancel auto-remove timeout
      const timeout = customerTimeoutsRef.current.get(customer.id);
      if (timeout) {
        clearTimeout(timeout);
        customerTimeoutsRef.current.delete(customer.id);
      }

      // Remove after pop animation
      setTimeout(() => {
        setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
      }, 300);

      onCustomerClick(customer.reward, x, y);
    },
    [onCustomerClick],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {customers.map((customer) => (
          <motion.button
            key={customer.id}
            className="absolute pointer-events-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-2xl"
            style={{
              left: customer.x,
              top: customer.y,
              transform: "translate(-50%, -50%)",
            }}
            initial={{ scale: 0, opacity: 0, rotate: -10 }}
            animate={
              customer.popping
                ? { scale: 0, opacity: 0, rotate: 15 }
                : { scale: 1, opacity: 1, rotate: 0 }
            }
            exit={{ scale: 0, opacity: 0 }}
            transition={
              customer.popping
                ? { duration: 0.25, ease: "backIn" }
                : { type: "spring", stiffness: 400, damping: 20 }
            }
            onClick={(e) => handleCustomerClick(customer, e)}
            aria-label={`Customer wants ${customer.product}! Click for +${customer.reward} coins`}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 2.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative"
            >
              {/* Customer bubble */}
              <div
                className="relative bg-white rounded-2xl p-2.5 border-2 border-white"
                style={{
                  boxShadow:
                    "0 4px 0 oklch(0.82 0.06 90), 0 8px 24px oklch(0 0 0 / 0.15)",
                }}
              >
                {/* Urgency timer ring */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-4 pointer-events-none"
                  style={{ borderColor: "oklch(0.65 0.22 35)" }}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 4, ease: "linear" }}
                />

                {/* Customer emoji */}
                <div className="text-3xl leading-none">{customer.emoji}</div>

                {/* Product bubble */}
                <div
                  className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md border-2"
                  style={{ borderColor: "oklch(0.82 0.18 88)" }}
                >
                  {customer.product}
                </div>

                {/* Reward badge */}
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-game font-black px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{
                    background: "oklch(0.65 0.22 35)",
                    boxShadow: "0 2px 0 oklch(0.45 0.22 35)",
                  }}
                >
                  +{customer.reward}🪙
                </div>
              </div>
            </motion.div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
