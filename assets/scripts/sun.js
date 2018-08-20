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
        // 暂存 Game 对象的引用
        pickRadius: 100,
        isDeleted: false,
        startMove: false,
        atHome: false,
        timer: 0,
        starDuration: 0,
         // 星星产生后消失时间的随机范围
         maxStarDuration: 2,
         minStarDuration: 1,

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

    onAnimCompleted: function(num) {
        this.node.removeFromParent()
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        var self = this;
        function onMouseDown (event) {
            if (self.isDeleted) {
                return;
            }
            self.game.setMousePoint(event.currentTouch._point)
            self.isDeleted = true;
            self.startMove = true;
            // self.game.gainScore()
            self.node.stopAllActions();
            // self.createDisappearAction()
            // self.game.on('mousedown', onMouseMove, self)
        }
        function onMouseUp (event) {
            cc.log('up....') 
            self.timer = self.starDuration + 1;
            self.startMove = false;
        }
        // function onMouseMove (event) {
        //     let pos = self.node.convertToNodeSpace(cc.v2(event._x, event._y))
        //     self.node.setPosition(pos)
        //     cc.log('move....', event._x, event._y, pos)       
        // }
        // this.node.on('mousedown', onMouseDown, this.node)
        // this.node.on('mouseup', onMouseUp, this.node)
        this.node.on('touchstart', onMouseDown, this.node)
        this.node.on('touchend', onMouseUp, this.node)
        // 重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    finishAction() {
        this.node.destroy();
    },

    createDisappearAction : function() {
       //创建帧动画序列，名词形式
        if(this.atHome) {
            return;
        }
        this.atHome = true;
        this.game.gainSun()
        cc.log('createDisappearAction', this.atHome);

        let self = this;
        let finish = cc.callFunc(self.finishAction, self)
        let jumpAction = cc.blink(1, 3)
        let seq = cc.sequence(jumpAction, finish)
        this.node.runAction(seq);
    },

    getHomeDistance: function () {
        // 根据 home 节点位置判断距离
        let homePos = this.game.myGuo.getPosition();
        // 根据两点位置计算两点之间距离
        let dist = cc.pDistance(this.node.position, homePos);
        return dist;
    },

    start () {
 
    },

    update (dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        // cc.log('getHomeDistance', this.getHomeDistance())
        if (this.getHomeDistance() < this.pickRadius) {
            // 调用收集行为
            cc.log('pickRadius', this.pickRadius)
            this.createDisappearAction();
        }
        if (this.timer > this.starDuration) {
            // cc.log('destroy!')
            this.node.destroy();
        }
        // cc.log('this.startMove', this.startMove)
        if (!this.startMove){
               // 根据 Game 脚本中的计时器更新透明度
            var opacityRatio = 1 - this.timer/this.starDuration;
            var minOpacity = 50;
            this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
            this.timer += dt;  
        } else {
            if (this.atHome) {
                return
            }
            let self = this;
            this.node.opacity = 255;
            // cc.log('update', self.game.mousePosX, self.game.mousePosY)
            let worldPos = cc.v2(self.game.mousePosX - cc.winSize.width/2, self.game.mousePosY - cc.winSize.height/2)
            // cc.log('update pos', pos, worldPos)
            this.node.setPosition(worldPos)
        }     
    },
});
