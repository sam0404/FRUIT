import { AudioClip, AudioSource, Node, Prefab, Vec3, _decorator, sys } from 'cc';
import { BaseGameEntityAnimation } from '../animation/BaseGameEntityAnimation';
import { IBonusManager } from '../bonus/interface/IBonusManager';
import { FruitName } from '../enum/FruitName';
import { LineMovement } from '../movement/LineMovement';
import { TweenMovement } from '../movement/TweenMovement';
import { Player } from '../player/Player';
import { PlayerComponent } from '../player/components/PlayerComponent';
import { BaseGameEntitySound } from '../sound/BaseGameEntitySound';
import { IGameEntitySound } from '../sound/interface/IGameEntitySound';
import { PointText } from '../ui/PointText';
import { TextPool } from '../ui/pool/TextPool';
import { GlobalEvent } from '../utils/event/GlobalEvent';
import { DangerFruit } from './danger_fruit/DangerFruit';
import { DangerFruitComponent } from './danger_fruit/component/DangerFruitComponent';
import { DangerFruitPool } from './danger_fruit/pool/DangerFruitPool';
import { Fruit } from './fruit/Fruit';
import { FruitComponent } from './fruit/component/FruitComponent';
import { FruitPool } from './fruit/pool/FruitPool';
import { IGameEntity } from './interface/IGameEntity';


const { ccclass } = _decorator;

const MOBILE_SPEED = 3
const BROUSER_SPEED = 1

@ccclass('FruitManager')
export class FruitManager {
    private _fruitComponentList: { [key: string]: FruitComponent }
    private _dangerFruitComponentList: { [key: string]: DangerFruitComponent }

    private _fruitList: { [key: string]: IGameEntity }
    private _fruitCollectedList: { [key: string]: number } = {}

    private _fruitPool: FruitPool | null
    private _dangerFruitPool: DangerFruitPool | null
    private _pointTextPool: TextPool | null
    private _spawnPoint: Node


    constructor(fruitPrefabs: Prefab[], dangerFruitPrefab: Prefab[], spawnPoint: Node, pointTextPrefab: Prefab) {
        this._fruitComponentList = {}
        this._dangerFruitComponentList = {}
        this._fruitList = {}

        this._pointTextPool = new TextPool(pointTextPrefab)

        this._spawnPoint = spawnPoint

        this._fruitPool = new FruitPool(fruitPrefabs)
        this._dangerFruitPool = new DangerFruitPool(dangerFruitPrefab)

        GlobalEvent.on('FRUIT_PUT', this.updateFruitList, this)
        GlobalEvent.on('DANGER_FRUIT_PUT', this.updateDangerFruitList, this)
        GlobalEvent.on('FRUIT_FALLED', this.interruptSequence, this)
    }

    public createFruite(offset: number, audioSource: AudioSource) {
        const fruitComponent = this._fruitPool.getFruitComponent()
        if (!fruitComponent) return

        fruitComponent.node.setParent(this._spawnPoint)
        let rnd = Math.random()
        let direction = 1

        if (Math.ceil(rnd * 100) % 2 == 0) {
            direction = -1
        }
        fruitComponent.node.position = new Vec3(Math.floor(rnd * direction * offset), 0, 0)

        const sound = new BaseGameEntitySound(audioSource)
        const animation = new BaseGameEntityAnimation(fruitComponent.animation)
        let score = Math.floor(Math.random() * 500)

        let speed = BROUSER_SPEED
        if (sys.isMobile) {
            speed = MOBILE_SPEED
        }

        let fruit = new Fruit(sound, animation, score, speed, fruitComponent.fruitType)

        this._fruitComponentList[fruitComponent.node.uuid] = fruitComponent
        this._fruitList[fruitComponent.node.uuid] = fruit

        this.addMovement(fruit, fruitComponent.node, fruit.speed)
        this.addSound(sound, fruitComponent.clip)
    }

    public createDangerFruite(offset: number, audioSource: AudioSource) {
        const dangerFruitComponent = this._dangerFruitPool.getFruitComponent()

        dangerFruitComponent.node.setParent(this._spawnPoint)
        let rnd = Math.random()
        let direction = 1

        if (Math.ceil(rnd * 100) % 2 == 0) {
            direction = -1
        }
        dangerFruitComponent.node.position = new Vec3(Math.floor(rnd * direction * offset), 0, 0)


        const sound = new BaseGameEntitySound(audioSource)
        const animation = new BaseGameEntityAnimation(dangerFruitComponent.animation)

        let speed = BROUSER_SPEED
        if (sys.isMobile) {
            speed = MOBILE_SPEED
        }

        let fruit = new DangerFruit(sound, animation, 0, speed, dangerFruitComponent.fruitType)

        this._dangerFruitComponentList[dangerFruitComponent.node.uuid] = dangerFruitComponent
        this._fruitList[dangerFruitComponent.node.uuid] = fruit

        this.addMovement(fruit, dangerFruitComponent.node, fruit.speed)
        this.addSound(sound, dangerFruitComponent.clip)
    }

    public contactTracking(target: PlayerComponent, player: Player, bonusManager: IBonusManager) {
        const { width, height } = target.size

        for (let key in this._fruitComponentList) {
            const fruitComponent = this._fruitComponentList[key]
            const { worldPosition } = fruitComponent.node
            const { width: fruitWidth, height: fruitHeight } = fruitComponent.size

            this.contact(player, bonusManager, key, worldPosition, width, height, fruitWidth, fruitHeight, target)
        }

        for (let key in this._dangerFruitComponentList) {
            const fruitComponent = this._dangerFruitComponentList[key]
            const { worldPosition } = fruitComponent.node
            const { width: fruitWidth, height: fruitHeight } = fruitComponent.size

            this.contact(player, bonusManager, key, worldPosition, width, height, fruitWidth, fruitHeight, target, true)
        }
    }

    public stopAllFruit() {
        for (let key in this._fruitList) {
            const fruit = this._fruitList[key]
            fruit.onStop()
        }
    }

    private contact(player: Player, bonusManager: IBonusManager, key: string, worldPosition: Vec3, width: number, height: number, fruitWidth: number, fruitHeight: number, target: PlayerComponent, isDanger: boolean = false) {
        const fruit = this._fruitList[key]
        if (target.node.worldPosition.x - (width / 2) < worldPosition.x + fruitWidth / 2 && target.node.worldPosition.x + (width / 2) > worldPosition.x - fruitWidth / 2 &&
            target.node.worldPosition.y - (height / 2) < worldPosition.y + fruitHeight / 2 && target.node.worldPosition.y + (height / 2) > worldPosition.y - fruitWidth / 2 &&
            !fruit.isCollected) {

            GlobalEvent.emit('SCORE_CHANGED', fruit.points)
            if (isDanger) {
                player.removeLife(1)
            } else {
                if (this._fruitCollectedList[fruit.fruitType] == undefined) {
                    this._fruitCollectedList[fruit.fruitType] = 0
                }

                this._fruitCollectedList[fruit.fruitType] += 1

                const bonus = bonusManager.getBonus(fruit.fruitType, this._fruitCollectedList[fruit.fruitType])
                if (bonus.bonus > 0) {
                    new PointText(this._pointTextPool.getText(), worldPosition, target.node.parent, `${bonus.message}\n${bonus.bonus}`, 100)
                    GlobalEvent.emit('SCORE_CHANGED', bonus.bonus)
                }
            }

            new PointText(this._pointTextPool.getText(), worldPosition, target.node.parent, `+${fruit.points}`)

            fruit.onStop()
            fruit.playCollectAnimation()
            fruit.playCollectSound()
            fruit.onCollect()
        }
    }

    private interruptSequence(fruitType: FruitName) {
        this._fruitCollectedList[fruitType] = 0
    }

    private addMovement(fruit: IGameEntity, fruitNode: Node, speed: number) {
        const random = Math.ceil(Math.random() * 1000000) % 5

        let movement = null
        if (random % 2 == 0) {
            movement = new LineMovement(fruitNode, speed)
        } else {
            movement = new TweenMovement(fruitNode)
        }

        fruit.onMove(movement)
    }

    private addSound(sound: IGameEntitySound, clip: AudioClip) {
        sound.setClip(clip)
    }

    private updateFruitList(fruit: Node) {
        delete this._fruitComponentList[fruit.uuid]
        delete this._fruitList[fruit.uuid]
    }

    private updateDangerFruitList(fruit: Node) {
        delete this._dangerFruitComponentList[fruit.uuid]
        delete this._fruitList[fruit.uuid]
    }

    public clear() {
        GlobalEvent.off('FRUIT_PUT', this.updateFruitList, this)
        GlobalEvent.off('DANGER_FRUIT_PUT', this.updateDangerFruitList, this)
        GlobalEvent.off('FRUIT_FALLED', this.interruptSequence, this)

        this.stopAllFruit()

        this._fruitComponentList = {}
        this._fruitCollectedList = {}
        this._dangerFruitComponentList = {}
        this._fruitList = {}

        this._pointTextPool.clear()
        this._fruitPool.clear()
        this._dangerFruitPool.clear()
    }
}