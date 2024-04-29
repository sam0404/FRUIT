import { Label, Node, UIOpacity, Vec3, _decorator, tween } from 'cc';
import { GlobalEvent } from '../utils/event/GlobalEvent';
const { ccclass } = _decorator;

@ccclass('PointText')
export class PointText {
    private _offsetVector: Vec3 = new Vec3(0, 150, 0)
    private _text: Label | null

    constructor(text: Label, position: Vec3, parent: Node, point: string, offset?: number) {
        this._text = text

        this._text.string = point
        this._text.node.setParent(parent)

        if (offset) {
            this._offsetVector.y += offset
        }

        this._text.node.setWorldPosition(position.add(this._offsetVector))

        let opacity = this._text.getComponent(UIOpacity)
        if (opacity) {
            tween(opacity)
                .to(0.8, { opacity: 0 }, { easing: 'backInOut' })
                .call(() => { GlobalEvent.emit('TEXT_PUT', this._text.node) })
                .start()
        }
    }
}