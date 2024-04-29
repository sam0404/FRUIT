import { Animation, AudioClip, Component, Enum, UITransform, _decorator } from 'cc';
import { FruitName } from '../../../enum/FruitName';
import { GlobalEvent } from '../../../utils/event/GlobalEvent';
const { ccclass, property } = _decorator;

@ccclass('DangerFruitComponent')
export class DangerFruitComponent extends Component {
    @property(AudioClip)
    readonly clip: AudioClip

    @property(Animation)
    readonly animation: Animation

    @property(UITransform)
    readonly size: UITransform

    @property({ type: Enum(FruitName) })
    readonly fruitType: FruitName = FruitName.DANGER


    // ANIMATION
    private onEndAnimation() {
        GlobalEvent.emit('DANGER_FRUIT_PUT', this.node)
    }
}


