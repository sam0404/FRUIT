import { Node, NodePool, Prefab, Vec3, _decorator, instantiate } from 'cc';
import { GlobalEvent } from '../../../utils/event/GlobalEvent';
import { FruitComponent } from '../component/FruitComponent';
const { ccclass, } = _decorator;


@ccclass('FruitPool')
export class FruitPool {
    private _fruitPrefabs: Prefab[] | null
    private _pool: NodePool

    constructor(fruitPrefabs: Prefab[]) {
        this._fruitPrefabs = fruitPrefabs

        this._pool = new NodePool()
        for (let i = 0; i < this._fruitPrefabs.length; i++) {
            this._pool.put(instantiate(this._fruitPrefabs[i]))
        }

        GlobalEvent.on('FRUIT_PUT', this.putFruit, this)
    }

    public getFruitComponent(): FruitComponent {
        let element = this._pool.get()

        if (!element) {
            element = instantiate(this._fruitPrefabs[Math.floor(Math.random() * (this._fruitPrefabs.length - 1))])
        }

        const component = element.getComponent(FruitComponent)

        return component
    }

    public putFruit(node: Node) {
        if (!node) return

        node.scale = Vec3.ONE
        node.position = Vec3.ZERO

        this._pool.put(node)
    }

    public clear() {
        GlobalEvent.off('FRUIT_PUT', this.putFruit, this)
        this._pool.clear()
    }
}
