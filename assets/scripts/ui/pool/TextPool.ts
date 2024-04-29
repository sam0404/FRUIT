import { _decorator, instantiate, Label, Node, NodePool, Prefab, UIOpacity, Vec3 } from 'cc';
import { GlobalEvent } from '../../utils/event/GlobalEvent';
const { ccclass, } = _decorator;

const SIZE = 10

@ccclass('TextPool')
export class TextPool {
    private _textPrefab: Prefab | null
    private _pool: NodePool | null

    constructor(textPrefab: Prefab) {
        this._textPrefab = textPrefab

        this._pool = new NodePool()
        for (let i = 0; i < SIZE; i++) {
            this._pool.put(instantiate(this._textPrefab))
        }

        GlobalEvent.on('TEXT_PUT', this.putText, this)
    }

    public getText(): Label {
        let element = this._pool.get()

        if (!element) {
            element = instantiate(instantiate(this._textPrefab))
        }

        const label = element.getComponent(Label)

        return label
    }

    public putText(node: Node) {
        if (!node) return

        node.position = Vec3.ZERO

        let opacity = node.getComponent(UIOpacity)
        if (opacity) {
            opacity.opacity = 255
        }

        this._pool.put(node)
    }

    public clear() {
        GlobalEvent.off('TEXT_PUT', this.putText, this)
        this._pool.clear()
    }
}