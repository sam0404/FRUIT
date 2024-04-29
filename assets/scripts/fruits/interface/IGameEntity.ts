import { FruitName } from "../../enum/FruitName"
import { IGameEntityMovement } from "../../movement/interface/IGameEntityMovement"


export interface IGameEntity {
    get points(): number
    get speed(): number
    get isCollected(): boolean
    get fruitType(): FruitName

    onMove(movement: IGameEntityMovement): void
    onStop(): void
    playCollectAnimation(): void
    playCollectSound(): void
    onCollect(): void
}