import {Asset} from  "./Asset";

export enum PlayerState {
    LoadingAssets,
    Ready,
    Disconnected,
    Idle
}

export class Player {
    name: string;
    state: PlayerState;
    assets: Asset[];
    deaths: number;
    kills: number;
    experience: number;
    gold: number;
    damageDealt: number;
    damageReceived: number;
    healingDealt: number;

    constructor() {

    }
}
