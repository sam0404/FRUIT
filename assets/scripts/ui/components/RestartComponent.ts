import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass('RestartComponent')
export class RestartComponent extends Component {
    // EDITOR
    private onRestart() {
        director.loadScene("game")
    }
}