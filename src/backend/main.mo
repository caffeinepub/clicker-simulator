import Time "mo:core/Time";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  type PlayerState = {
    coins : Int;
    clickPower : Int;
    passiveRate : Int;
    rebirthCount : Int;
    rebirthBonus : Int;
    lastClaim : Int;
    upgradesBought : [Text];
  };

  let players = Map.empty<Principal, PlayerState>();

  func getInitialState() : PlayerState {
    {
      coins = 0;
      clickPower = 1;
      passiveRate = 0;
      rebirthCount = 0;
      rebirthBonus = 0;
      lastClaim = Time.now();
      upgradesBought = [];
    };
  };

  public query ({ caller }) func getPlayerState() : async PlayerState {
    switch (players.get(caller)) {
      case (?state) { state };
      case (null) {
        let initial = getInitialState();
        initial;
      };
    };
  };

  public shared ({ caller }) func click() : async Int {
    let state = switch (players.get(caller)) {
      case (?s) { s };
      case (null) { getInitialState() };
    };
    let coinsEarned = state.clickPower * (100 + state.rebirthBonus) / 100;
    let newState : PlayerState = {
      coins = state.coins + coinsEarned;
      clickPower = state.clickPower;
      passiveRate = state.passiveRate;
      rebirthCount = state.rebirthCount;
      rebirthBonus = state.rebirthBonus;
      lastClaim = state.lastClaim;
      upgradesBought = state.upgradesBought;
    };
    players.add(caller, newState);
    newState.coins;
  };

  public shared ({ caller }) func claimPassive() : async Int {
    let state = switch (players.get(caller)) {
      case (?s) { s };
      case (null) { getInitialState() };
    };

    let now = Time.now();
    let intervals = (now - state.lastClaim) / (10_000_000_000);
    if (intervals <= 0) {
      return 0;
    };
    let coinsEarned = state.passiveRate * intervals * (100 + state.rebirthBonus) / 100;
    let newState : PlayerState = {
      coins = state.coins + coinsEarned;
      clickPower = state.clickPower;
      passiveRate = state.passiveRate;
      rebirthCount = state.rebirthCount;
      rebirthBonus = state.rebirthBonus;
      lastClaim = now;
      upgradesBought = state.upgradesBought;
    };
    players.add(caller, newState);
    coinsEarned;
  };

  public shared ({ caller }) func buyUpgrade(id : Text, cost : Int, effect : Int, upgradeType : Text) : async {
    #ok : PlayerState;
    #err : Text;
  } {
    let state = switch (players.get(caller)) {
      case (?s) { s };
      case (null) { getInitialState() };
    };

    if (state.coins < cost) {
      return #err("Not enough coins");
    };

    if (state.upgradesBought.any(func(u) { Text.equal(u, id) })) {
      return #err("Upgrade already bought");
    };

    let newCoins = state.coins - cost;
    let (newClickPower, newPassiveRate) = if (Text.equal(upgradeType, "click")) {
      (state.clickPower + effect, state.passiveRate);
    } else if (Text.equal(upgradeType, "passive")) {
      (state.clickPower, state.passiveRate + effect);
    } else {
      (state.clickPower, state.passiveRate);
    };

    let newUpgrades = state.upgradesBought.concat([id]);

    let newState : PlayerState = {
      coins = newCoins;
      clickPower = newClickPower;
      passiveRate = newPassiveRate;
      rebirthCount = state.rebirthCount;
      rebirthBonus = state.rebirthBonus;
      lastClaim = state.lastClaim;
      upgradesBought = newUpgrades;
    };

    players.add(caller, newState);
    #ok(newState);
  };

  public shared ({ caller }) func rebirth() : async {
    #ok : Int;
    #err : Text;
  } {
    let state = switch (players.get(caller)) {
      case (?s) { s };
      case (null) { getInitialState() };
    };

    if (state.rebirthCount >= 10) {
      Runtime.trap("You have reached the maximum number of rebirths.");
    };

    let newRebirthCount = state.rebirthCount + 1;
    let newBonus = newRebirthCount * 50;

    let newState : PlayerState = {
      coins = 0;
      clickPower = 1;
      passiveRate = 0;
      rebirthCount = newRebirthCount;
      rebirthBonus = newBonus;
      lastClaim = Time.now();
      upgradesBought = [];
    };

    players.add(caller, newState);
    #ok(newRebirthCount);
  };
};
