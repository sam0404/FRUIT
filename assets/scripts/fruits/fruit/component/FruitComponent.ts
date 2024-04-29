import { _decorator, Animation, AudioClip, Component, Enum, UITransform } from 'cc';
import { FruitName } from '../../../enum/FruitName';
import { GlobalEvent } from '../../../utils/event/GlobalEvent';

const { ccclass, property } = _decorator;

@ccclass('FruitComponent')
export class FruitComponent extends Component {
    @property(AudioClip)
    readonly clip: AudioClip

    @property(Animation)
    readonly animation: Animation

    @property(UITransform)
    readonly size: UITransform

    @property({ type: Enum(FruitName) })
    readonly fruitType: FruitName = FruitName.BANANA


    // ANIMATION
    private onEndAnimation() {
        GlobalEvent.emit('FRUIT_PUT', this.node)
    }
}
