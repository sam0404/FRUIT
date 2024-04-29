import { Label, _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('Timer')
export class Timer {
    private _time: number
    private _label: Label | null

    constructor(label: Label, time: number) {
        this._label = label
        this._time = 0

        this.change(time)
    }

    public change(time: number) {
        this._time = time
        this._label.string = this._time.toString()
    }

    public clear() {
        this._label = null
        this._time = 0
    }
}