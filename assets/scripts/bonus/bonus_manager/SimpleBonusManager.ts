import { _decorator } from 'cc';
import { BonusType } from '../../enum/BonusType';
import { FruitName } from '../../enum/FruitName';
import { BananaBonus } from '../bonus_combo/BananaBonus';
import { CoconutBonus } from '../bonus_combo/CoconutBonus';
import { OrangeBonus } from '../bonus_combo/OrangeBonus';
import { IBonusCombo } from '../interface/IBonusCombo';
import { IBonusManager } from '../interface/IBonusManager';
const { ccclass } = _decorator;

@ccclass('SimpleBonusManager')
export class SimpleBonusManager implements IBonusManager {
    private _bonusList: { [key: string]: IBonusCombo } = {}
    private miniBonus: number = 2
    private mediumBonus = 5
    private megaBonus = 10

    constructor() {
        this._bonusList[`${FruitName.BANANA}_${this.miniBonus}`] = new BananaBonus("well done banana", 100)
        this._bonusList[`${FruitName.BANANA}_${this.mediumBonus}`] = new BananaBonus("very well done banana", 200)
        this._bonusList[`${FruitName.BANANA}_${this.megaBonus}`] = new BananaBonus("very well done banana", 500)

        this._bonusList[`${FruitName.COCONUT}_${this.miniBonus}`] = new CoconutBonus("well done coconut", 100)
        this._bonusList[`${FruitName.COCONUT}_${this.mediumBonus}`] = new CoconutBonus("very well done coconut", 150)
        this._bonusList[`${FruitName.COCONUT}_${this.megaBonus}`] = new CoconutBonus("very well done coconut", 300)

        this._bonusList[`${FruitName.ORANGE}_${this.miniBonus}`] = new OrangeBonus("well done orange", 100)
        this._bonusList[`${FruitName.ORANGE}_${this.mediumBonus}`] = new OrangeBonus("very well done orange", 170)
        this._bonusList[`${FruitName.ORANGE}_${this.megaBonus}`] = new OrangeBonus("very well done orange", 350)
    }

    public getBonus(fruitType: FruitName, quantity: number): BonusType {
        if (quantity > this.megaBonus) {
            quantity = this.megaBonus
        }

        let result = {
            message: '',
            bonus: 0
        } as BonusType

        const bonus = this._bonusList[`${fruitType}_${quantity}`]

        if (bonus) {
            result.bonus = bonus.bonus
            result.message = bonus.message
        }

        return result
    }

    public clear() {
        this._bonusList = {}
    }
}