import { AudioClip, AudioSource, _decorator, error } from 'cc';
import { IGameEntitySound } from './interface/IGameEntitySound';

const { ccclass } = _decorator;

@ccclass('BaseGameEntitySound')
export class BaseGameEntitySound implements IGameEntitySound {
    private _audio: AudioSource
    private _audioClip: AudioClip

    constructor(audio: AudioSource) {
        this._audio = audio
    }

    public setClip(audioClip: AudioClip) {
        this._audioClip = audioClip
    }

    public play(): void {
        if (!this._audio) {
            throw error("Audio component don't found!")
        }

        if (!this._audioClip) {
            throw error("Audio clip don't found!")
        }

        this._audio.clip = this._audioClip
        this._audio.play()
    }
}


