import { _decorator } from 'cc';
import { IGameEntityAnimation } from '../../animation/interface/IGameEntityAnimation';
import { FruitName } from '../../enum/FruitName';
import { IGameEntityMovement } from '../../movement/interface/IGameEntityMovement';
import { IGameEntitySound } from '../../sound/interface/IGameEntitySound';
import { IGameEntity } from '../interface/IGameEntity';
const { ccclass } = _decorator;

@ccclass('DangerFruit')
export class DangerFruit implements IGameEntity {
    private _points: number
    private _speed: number
    private _fruitType: FruitName

    private _isCollected: boolean

    private _movement: IGameEntityMovement
    private _animation: IGameEntityAnimation
    private _audio: IGameEntitySound

    constructor(audio: IGameEntitySound, animation: IGameEntityAnimation, points: number, speed: number, fruitType: FruitName) {
        this._points = points
        this._speed = speed
        this._fruitType = fruitType

        this._audio = audio
        this._animation = animation
        this._isCollected = false
    }

    public get fruitType(): FruitName {
        return this._fruitType
    }

    public get points(): number {
        return this._points
    }

    public get speed(): number {
        return this._speed
    }

    public get isCollected(): boolean {
        return this._isCollected
    }

    public onCollect() {
        this._isCollected = true
    }

    public onMove(movement: IGameEntityMovement): void {
        this._movement = movement
        movement.onMove()
    }

    public onStop(): void {
        this._movement?.onStop()
    }

    public playCollectAnimation(): void {
        this._animation.play()
    }

    public playCollectSound(): void {
        this._audio.play()
    }

    public clear() {
        this._movement?.onStop()
    }
}


