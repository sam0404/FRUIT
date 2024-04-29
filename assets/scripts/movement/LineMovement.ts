import { _decorator, Node } from 'cc';
import { FruitComponent } from '../fruits/fruit/component/FruitComponent';
import { GlobalEvent } from '../utils/event/GlobalEvent';
import { IGameEntityMovement } from './interface/IGameEntityMovement';

const { ccclass } = _decorator;

const MIN_SCREEN_POSITION = -1280 // SCREEN(1080) plus offset (200)
@ccclass('LineMovement')
export class LineMovement implements IGameEntityMovement {
    private _node: Node
    private _isMove: boolean = false
    private _speed: number

    private intervalId: ReturnType<typeof setInterval> | null = null;

    constructor(node: Node, speed: number) {
        this._node = node
        this._speed = speed

        this.intervalId = setInterval(this.move.bind(this), 1 / speed)
    }

    public onMove(): void {
        this._isMove = true
    }

    public onStop(): void {
        this._isMove = false
        clearInterval(this.intervalId);
    }

    private move() {
        if (!this._isMove) return

        let newPosition = this._node.position.clone()
        newPosition.y -= this._speed
        this._node.position = newPosition

        if (this._node.position.y <= MIN_SCREEN_POSITION) {
            this.onStop()

            const fruitComponent = this._node.getComponent(FruitComponent)
            if (fruitComponent) {
                GlobalEvent.emit("FRUIT_FALLED", fruitComponent.fruitType)
            }

            GlobalEvent.emit('FRUIT_PUT', this._node)
        }
    }
}