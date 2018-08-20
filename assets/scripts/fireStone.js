// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        game: {
            default: null,
            serializable: false
        }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:
    finishAction() {
        this.node.destroy();
        this.game.cryOpponent()
        this.game.setOblood(-1)
    },
    // onLoad () {},
    getRandomPosition() {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = 0;
        var maxY = cc.winSize.height / 2 - this.node.width;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = cc.winSize.width / 2 - this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
        randY = cc.random0To1() * maxY;
        // 返回星星坐标
        return cc.p(randX, randY);
    },

    fire () {
        // let points = [cc.p(243, -338), cc.p(10, 10), cc.p(140, 30)];
        // let blinkAction = cc.bezierTo(2, points)
        // this.node.runAction(blinkAction);
        let self = this;
        let pos = this.game.stonePoint
        let finish = cc.callFunc(this.finishAction, this)
        let jumpAction = cc.jumpTo(2, pos, 100, 1)
        let seq = cc.sequence(jumpAction, finish)
        this.node.runAction(seq);
        // 投食动画
        // let dorpAction = cc.moveTo(2, cc.p(0, 0));
        // let scaleBigAction = cc.scaleTo(1, 2);
        // let scaleSmallAction = cc.scaleTo(1, 0.5);
        // let scaleActions = cc.sequence(scaleBigAction, scaleSmallAction)
        // let actions = cc.spawn(dorpAction, scaleActions)
        // this.node.runAction(actions);
    },

    start () {
        this.fire();
    },

    // update (dt) {},
});
