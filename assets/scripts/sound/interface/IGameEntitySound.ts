import { AudioClip } from "cc"

export interface IGameEntitySound {
    setClip(clip: AudioClip): void
    play(): void
}