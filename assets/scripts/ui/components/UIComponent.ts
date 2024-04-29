import { Component, Label, Node, Prefab, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIComponent')
export class UIComponent extends Component {
    @property(Label)
    readonly scoreLabel: Label

    @property(Label)
    readonly timerLabel: Label

    // LIFE
    @property(Prefab)
    readonly lifePrefab: Prefab

    @property(Node)
    readonly lifeContainer: Node

    // TEXT
    @property(Prefab)
    readonly textPrefab: Prefab

    // GAME OVER
    @property(Node)
    readonly gameOver: Node
}