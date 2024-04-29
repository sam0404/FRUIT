import { CCFloat, Camera, Component, EventTouch, Input, UITransform, Vec3, _decorator, input, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerComponent')
export class PlayerComponent extends Component {
    @property(CCFloat)
    private speed: number = 200

    @property(UITransform)
    readonly size: UITransform

    @property(Camera)
    private camera: Camera

    private leftBorderPosition: number
    private rightBorderPosition: number
    private middle: number
    private halfSize: number
    private uiTransform: UITransform

    private isMove: boolean = false
    private touchPosition: number

    private minPosition: Vec3
    private maxPosition: Vec3

    protected start() {
        const screen = view.getVisibleSize()

        this.middle = screen.width / 2
        this.leftBorderPosition = -this.middle
        this.rightBorderPosition = this.middle

        this.uiTransform = this.node.getComponent(UITransform)
        this.halfSize = this.uiTransform.width / 2

        const { y, z } = this.node.position
        this.minPosition = new Vec3(this.leftBorderPosition + this.halfSize, y, z)
        this.maxPosition = new Vec3(this.rightBorderPosition - this.halfSize, y, z)

        input.on(Input.EventType.TOUCH_START, this.mouseClickStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.mouseClickMove, this);
        input.on(Input.EventType.TOUCH_END, this.mouseClickEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.mouseClickEnd, this);
    }

    public move(deltaTime: number) {
        if (!this.isMove) return

        let speed = this.speed

        if (this.node.position.x + this.halfSize > this.rightBorderPosition) {
            this.node.position = this.maxPosition

            return
        }

        if (this.node.position.x - this.halfSize < this.leftBorderPosition) {
            this.node.position = this.minPosition

            return
        }


        if (this.touchPosition < this.node.position.clone().x) {
            speed = -this.speed
        }

        if (Math.abs(this.touchPosition - this.node.position.clone().x) < 35 ||
            this.node.position.x <= this.minPosition.x && this.touchPosition < this.leftBorderPosition + this.halfSize ||
            this.node.position.x >= this.maxPosition.x && this.touchPosition > this.rightBorderPosition - this.halfSize
        ) {
            speed = 0
        }

        let newPosition = this.node.position.clone()
        newPosition.x += speed * deltaTime
        this.node.position = newPosition
    }

    private mouseClickStart(event: EventTouch) {
        this.isMove = true
        this.touchPosition = this.camera.screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0)).x - this.middle
    }

    private mouseClickMove(event: EventTouch) {
        if (!this.camera) return

        this.touchPosition = this.camera.screenToWorld(new Vec3(event.getLocationX(), event.getLocationY(), 0)).x - this.middle
    }

    private mouseClickEnd(event: EventTouch) {
        this.isMove = false
    }
}