import { BonusType } from "../../enum/BonusType";
import { FruitName } from "../../enum/FruitName";

export interface IBonusManager {
    getBonus(fruitType: FruitName, quantity: number): BonusType
    clear(): void
}