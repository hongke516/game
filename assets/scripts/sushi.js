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
        isDeleted: false,

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
            self.isDeleted = true;
            self.game.gainScore()
            self.node.stopAllActions();
            self.stop = true;
            self.createDisappearAction()
        }
        function onMouseUp (event) {
            cc.log('up....')       
        }
        this.node.on('mousedown', onMouseDown, this.node)
        this.node.on('mouseup', onMouseUp, this.node)
    },

    createDisappearAction : function() {
       //创建帧动画序列，名词形式
        var anim = this.getComponent(cc.Animation);
        anim.play('test');
    },

    start () {

    },

    update (dt) { 
    },
});
