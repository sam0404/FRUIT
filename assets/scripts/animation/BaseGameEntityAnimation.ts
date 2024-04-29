import { _decorator, Animation, error } from 'cc';
import { IGameEntityAnimation } from './interface/IGameEntityAnimation';

const { ccclass } = _decorator;

@ccclass('BaseGameEntityAnimation')
export class BaseGameEntityAnimation implements IGameEntityAnimation {
    private _isPlay: boolean = false
    private _animation: Animation

    constructor(animation: Animation) {
        this._animation = animation
    }

    public play(): void {
        if (!this._animation) {
            throw error("Animation component don't found!")
        }

        if (this._isPlay) {
            return
        }

        this._animation.play()
        this._isPlay = true
    }
}