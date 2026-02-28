# Clicker Simulator

## Current State
Fresh project with no backend logic or frontend UI implemented yet.

## Requested Changes (Diff)

### Add
- Farm-themed clicker game where the player clicks to earn coins by harvesting fruits and vegetables
- Cartoon customer characters (fruits/veggies with faces) that appear randomly on screen and give bonus coins when clicked before disappearing
- Click upgrades: improve coins earned per click (e.g. Better Hands, Golden Fork, Magic Hoe)
- Passive income upgrades: auto-generate coins over time (e.g. Scarecrow, Irrigation System, Greenhouse)
- Rebirth system: reset coins and upgrades but gain a permanent multiplier, up to 10 rebirths
- Persistent game state stored in the backend (coins, click power, upgrades owned, rebirth count, multiplier)
- Passive income accumulation tracked server-side

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend (Motoko):
   - Store player state: coins, clickPower, passiveIncome, rebirthCount, rebirthMultiplier, lastClaimTime
   - Functions: click(), buyUpgrade(id), claimPassive(), rebirth(), getState()
   - Upgrades defined as records with id, name, description, cost, effect, type (click/passive)
   - Rebirth: max 10, each adds +0.5x permanent multiplier, resets coins and upgrades
   - Passive income: calculate coins earned since lastClaimTime on claimPassive()

2. Frontend (React + Tailwind):
   - Colorful cartoon farm theme
   - Big clickable farm button (bounces on click, floating +coins label)
   - Floating cartoon customers (fruit/veggie characters with faces) appear randomly, click for bonus coins, disappear after 3-5 seconds
   - Upgrade shop panel (two tabs: Click Upgrades / Passive Upgrades)
   - Rebirth button (visible when player meets rebirth requirement), shows current rebirth count
   - HUD showing coins, coins/click, coins/sec, rebirth level
   - Satisfying visual feedback: screen shake, sparkles, coin animations
