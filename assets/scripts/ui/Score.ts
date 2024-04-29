import { Label, _decorator } from 'cc';
import { GlobalEvent } from '../utils/event/GlobalEvent';
const { ccclass } = _decorator;

@ccclass('Score')
export class Score {
    private _score: number
    private _label: Label | null

    constructor(label: Label) {
        this._label = label
        this._score = 0
        this.init()

        GlobalEvent.on('SCORE_CHANGED', this.change, this)
    }

    private init() {
        this._label.string = this._score.toString()
    }

    private change(value: number) {
        this._score += value
        this._label.string = this._score.toString()
    }

    public clear() {
        GlobalEvent.off('SCORE_CHANGED', this.change, this)
        this._label = null
        this._score = 0
    }
}