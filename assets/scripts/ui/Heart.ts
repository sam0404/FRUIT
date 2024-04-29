import { Node, Prefab, _decorator } from 'cc';
import { GlobalEvent } from '../utils/event/GlobalEvent';
import { LifePool } from './pool/LifePool';
const { ccclass } = _decorator;

@ccclass('Heart')
export class Heart {
    private _heartContainer: Node
    private _heartList: Node[] = []
    private _lifePool: LifePool | null

    constructor(heartPrefab: Prefab, heartContainer: Node, quantityHearts: number) {
        this._heartContainer = heartContainer
        this._lifePool = new LifePool(heartPrefab)

        this.createHearts(quantityHearts)
        GlobalEvent.on('LIFE_CHANGED', this.updateHeartsContainer, this)
    }

    private createHearts(lifes: number) {
        for (let i = 0; i < lifes; i++) {
            const heart = this._lifePool.getLife()
            this._heartList.push(heart)

            heart.setParent(this._heartContainer)
        }
    }

    private updateHeartsContainer(value: number) {
        if (value < 0) {
            let end = this._heartList.length
            if (this._heartList.length > value) {
                end = Math.abs(value)
            }

            for (let i = 0; i < end; i++) {
                const heart = this._heartList.pop()
                this._lifePool.putLife(heart)
            }

            return
        }

        this.createHearts(value)
    }

    public clear() {
        GlobalEvent.off('LIFE_CHANGED', this.updateHeartsContainer, this)

        this._heartList = []
        this._lifePool.clear()
    }
}