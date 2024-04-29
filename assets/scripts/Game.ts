import { _decorator, AudioSource, CCFloat, Component, Node, Prefab, sys } from 'cc';
import { SimpleBonusManager } from './bonus/bonus_manager/SimpleBonusManager';
import { IBonusManager } from './bonus/interface/IBonusManager';
import { FruitManager } from './fruits/FruitManager';
import { PlayerComponent } from './player/components/PlayerComponent';
import { Player } from './player/Player';
import { UIComponent } from './ui/components/UIComponent';
import { Heart } from './ui/Heart';
import { Score } from './ui/Score';
import { Timer } from './ui/Timer';
const { ccclass, property } = _decorator;

const SCREEN_WIDTH = 700
const KOEFF_FRUIT = 3
const KOEFF_FOR_DANGER = 7

@ccclass('Game')
export class Game extends Component {
    @property(CCFloat)
    private timerForGame: number

    @property(CCFloat)
    private playerHearts: number

    @property(AudioSource)
    private audioSource: AudioSource

    @property(Node)
    readonly spawnPoint: Node
    @property([Prefab])
    private fruits: Prefab[] = []
    @property([Prefab])
    private dangerFruits: Prefab[] = []

    // UI
    @property(UIComponent)
    readonly uiComponent: UIComponent

    // PLAYER
    @property(PlayerComponent)
    readonly playerComponent: PlayerComponent

    private _intervalId: ReturnType<typeof setInterval> | null = null;

    private _isGameOver: boolean = false
    private _timeForGenerateFruit: number
    private _timeForGenerateDangerFruit: number

    private _score: Score | null
    private _timer: Timer | null
    private _hearts: Heart | null

    private _fruitManager: FruitManager | null
    private _bonusManager: IBonusManager | null
    private _player: Player | null

    protected onLoad() {
        this._player = new Player(this.playerHearts)
        this._bonusManager = new SimpleBonusManager()

        if (this.uiComponent) {
            const { scoreLabel, timerLabel, lifePrefab, lifeContainer } = this.uiComponent

            this._score = new Score(scoreLabel)
            this._timer = new Timer(timerLabel, this.timerForGame)
            this._hearts = new Heart(lifePrefab, lifeContainer, this._player.lifes)
        }

        this._fruitManager = new FruitManager(this.fruits, this.dangerFruits, this.spawnPoint, this.uiComponent?.textPrefab)

        this._timeForGenerateFruit = Math.random() * KOEFF_FRUIT
        this._timeForGenerateDangerFruit = Math.random() * KOEFF_FOR_DANGER

        this._intervalId = setInterval(this.secondPassed.bind(this), 1000)
    }

    protected update(dt: number): void {
        if (this._isGameOver) return
        if (this._player.lifes <= 0) return

        this.playerComponent.move(dt)

        this._timeForGenerateFruit -= dt
        this._timeForGenerateDangerFruit -= dt

        if (this._timeForGenerateFruit <= 0) {
            this._timeForGenerateFruit = Math.random() * KOEFF_FRUIT
            this.createFruite()
        }
        if (this._timeForGenerateDangerFruit <= 0) {
            this._timeForGenerateDangerFruit = Math.random() * KOEFF_FOR_DANGER
            this.createFruite(true)
        }

        this._fruitManager.contactTracking(this.playerComponent, this._player, this._bonusManager)
    }

    private createFruite(isDanger: boolean = false) {
        let width = SCREEN_WIDTH

        if (sys.isMobile) {
            width = 0.9 * screen.width / 2
        }

        if (isDanger) {
            this._fruitManager.createDangerFruite(width, this.audioSource)
        } else {
            this._fruitManager.createFruite(width, this.audioSource)
        }
    }

    private secondPassed() {
        this.timerForGame--

        this._timer.change(this.timerForGame)

        if (this.timerForGame <= 0 || this._player.lifes <= 0) {
            this.gameOver()
        }
    }

    private gameOver() {
        if (this.uiComponent?.gameOver) {
            this.uiComponent.gameOver.active = true
        }

        this._isGameOver = true
        this._fruitManager.stopAllFruit()

        clearInterval(this._intervalId);
        this._intervalId = null;
    }

    // clear
    protected onDestroy(): void {
        clearInterval(this._intervalId);

        this._hearts.clear()
        this._score?.clear()
        this._timer?.clear()

        this._fruitManager?.clear()
        this._bonusManager?.clear()
    }
}