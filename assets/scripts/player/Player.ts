import { _decorator } from 'cc';
import { GlobalEvent } from '../utils/event/GlobalEvent';
const { ccclass } = _decorator;

@ccclass('Player')
export class Player {
    private _quiantityLifes: number

    constructor(lifes: number) {
        this._quiantityLifes = lifes
    }

    public get lifes(): number {
        return this._quiantityLifes
    }

    public addLife(quantity: number) {
        this._quiantityLifes += quantity

        GlobalEvent.emit('LIFE_CHANGED', quantity)
    }

    public removeLife(quantity: number) {
        this._quiantityLifes -= quantity

        GlobalEvent.emit('LIFE_CHANGED', -quantity)
    }
}
