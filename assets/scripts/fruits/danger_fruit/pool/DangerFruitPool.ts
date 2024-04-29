import { _decorator, instantiate, Node, NodePool, Prefab, Vec3 } from 'cc';
import { GlobalEvent } from '../../../utils/event/GlobalEvent';
import { DangerFruitComponent } from '../component/DangerFruitComponent';

const { ccclass } = _decorator;

const SIZE = 5

@ccclass('DangerFruitPool')
export class DangerFruitPool {
    private _dangerFruitPrefabs: Prefab[] | null
    private _pool: NodePool

    constructor(dangerFruitPrefabs: Prefab[]) {
        this._dangerFruitPrefabs = dangerFruitPrefabs

        this._pool = new NodePool()
        for (let i = 0; i < SIZE; i++) {
            this._pool.put(instantiate(this._dangerFruitPrefabs[0]))
        }

        GlobalEvent.on('DANGER_FRUIT_PUT', this.putFruit, this)
    }

    public getFruitComponent(): DangerFruitComponent {
        let element = this._pool.get()

        if (!element) {
            element = instantiate(this._dangerFruitPrefabs[Math.floor(Math.random() * (this._dangerFruitPrefabs.length - 1))])
        }

        const component = element.getComponent(DangerFruitComponent)

        return component
    }

    public putFruit(node: Node) {
        if (!node) return

        node.scale = Vec3.ONE

        this._pool.put(node)
    }

    public clear() {
        GlobalEvent.off('DANGER_FRUIT_PUT', this.putFruit, this)
        this._pool.clear()
    }
}