import { _decorator, error, Node, Tween, tween, Vec3 } from 'cc';
import { FruitComponent } from '../fruits/fruit/component/FruitComponent';
import { GlobalEvent } from '../utils/event/GlobalEvent';
import { IGameEntityMovement } from './interface/IGameEntityMovement';

const { ccclass } = _decorator;

const MIN_SCREEN_POSITION = -1280 //  SCREEN(1080) plus offset (200)

@ccclass('TweenMovement')
export class TweenMovement implements IGameEntityMovement {
    private _node: Node
    private _listPoints: Vec3[] = []

    constructor(node: Node, listPoints?: Vec3[] | null) {
        this._node = node

        if (listPoints) {
            this._listPoints = listPoints
        }
        else {
            this.generateRoute(node.worldPosition)
        }
    }

    public onMove(): void {
        if (!this._node) {
            throw error("Node is don't found!")
        }

        tween(this._node)
            .to(0.5, { worldPosition: this._listPoints[0] }, { easing: 'backOut' })
            .to(0.4, { worldPosition: this._listPoints[1] }, { easing: 'linear' })
            .to(0.32, { worldPosition: this._listPoints[2] }, { easing: 'backOut' })
            .to(0.35, { worldPosition: this._listPoints[3] }, { easing: 'backIn' })
            .to(0.46, { worldPosition: this._listPoints[4] }, { easing: 'backInOut' })
            .to(0.6, { worldPosition: this._listPoints[5] }, { easing: 'linear' })
            .call(() => {
                this.onStop()

                const fruitComponent = this._node.getComponent(FruitComponent)
                if (fruitComponent) {
                    GlobalEvent.emit("FRUIT_FALLED", fruitComponent.fruitType)
                }

                GlobalEvent.emit('FRUIT_PUT', this._node)
            })
            .start()
    }

    public onStop(): void {
        Tween.stopAllByTarget(this._node)
    }

    private generateRoute(startPosition: Vec3) {
        const quantityPoints = 6

        const widthStep = 280
        const heightStep = 420

        const { x, y } = startPosition

        this._listPoints[0] = new Vec3(x - Math.floor(Math.random() * widthStep), y - Math.floor(Math.random() * heightStep), 0)

        for (let i = 1; i < quantityPoints; i++) {
            let step = 1

            if (i % 2 == 0) {
                step = -1
            }
            const { x, y } = this._listPoints[i - 1]

            this._listPoints[i] = new Vec3(x + step * Math.floor(Math.random() * widthStep), y - Math.floor(Math.random() * heightStep), 0)
        }

        if (this._listPoints[quantityPoints - 1].y >= MIN_SCREEN_POSITION) {
            this._listPoints[quantityPoints - 1].y = MIN_SCREEN_POSITION
        }
    }
}