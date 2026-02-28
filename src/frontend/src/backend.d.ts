import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlayerState {
    rebirthCount: bigint;
    clickPower: bigint;
    coins: bigint;
    passiveRate: bigint;
    rebirthBonus: bigint;
    upgradesBought: Array<string>;
    lastClaim: bigint;
}
export interface backendInterface {
    buyUpgrade(id: string, cost: bigint, effect: bigint, upgradeType: string): Promise<{
        __kind__: "ok";
        ok: PlayerState;
    } | {
        __kind__: "err";
        err: string;
    }>;
    claimPassive(): Promise<bigint>;
    click(): Promise<bigint>;
    getPlayerState(): Promise<PlayerState>;
    rebirth(): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
