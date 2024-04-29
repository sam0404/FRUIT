import { _decorator } from 'cc';
import { IBonusCombo } from '../interface/IBonusCombo';
const { ccclass } = _decorator;

@ccclass('BananaBonus')
export class BananaBonus implements IBonusCombo {
    private _message: string
    private _bonus: number

    constructor(message: string, bonus: number) {
        this._bonus = bonus
        this._message = message
    }

    public get message(): string {
        return this._message
    }
    public get bonus(): number {
        return this._bonus
    }
}