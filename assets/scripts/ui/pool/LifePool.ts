import { _decorator, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass } = _decorator;

const SIZE = 5

@ccclass('LifePool')
export class LifePool {
    private _lifePrefab: Prefab | null
    private _pool: NodePool | null

    constructor(lifePrefab: Prefab) {
        this._lifePrefab = lifePrefab

        this._pool = new NodePool()
        for (let i = 0; i < SIZE; i++) {
            this._pool.put(instantiate(this._lifePrefab))
        }
    }

    public getLife(): Node {
        let element = this._pool.get()

        if (!element) {
            element = instantiate(instantiate(this._lifePrefab))
        }

        return element
    }

    public putLife(node: Node) {
        if (!node) return

        this._pool.put(node)
    }

    public clear() {
        this._pool.clear()
    }
}