import { _decorator } from 'cc';
import { IBonusCombo } from '../interface/IBonusCombo';
const { ccclass } = _decorator;

@ccclass('OrangeBonus')
export class OrangeBonus implements IBonusCombo {
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