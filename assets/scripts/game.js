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
        id: null,
        sushiList: [],
        otherPlayers: [],
        timeStep: 4,
        life: 3,
        score: 0,
        total: 0,
        clinet: null,
        nameDisplay1: {
            default: null,
            type: cc.Label
        },
        lifeDisplay1: {
            default: null,
            type: cc.Label
        },
        scoreDisplay1: {
            default: null,
            type: cc.Label
        },
        nameDisplay2: {
            default: null,
            type: cc.Label
        },
        lifeDisplay2: {
            default: null,
            type: cc.Label
        },
        scoreDisplay2: {
            default: null,
            type: cc.Label
        },
        nameDisplay3: {
            default: null,
            type: cc.Label
        },
        lifeDisplay3: {
            default: null,
            type: cc.Label
        },
        scoreDisplay3: {
            default: null,
            type: cc.Label
        },
        scheduler: null,
        sushiPrefab: {
            default: null,
            type: cc.Prefab
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

    onLoad() {
        this.addSushi()
    },
    changeStep() {
        this.timeStep = 4 - Math.floor(this.total / 10)
        if (this.total >= 40) {
            this.timeStep = 0.9
        }
        // console.log('timestep:', this.timeStep)
    },
    dLife: function () {
        this.life -= 1;
        // 更新 scoreDisplay Label 的文字
        this.lifeDisplay1.string = 'Life: ' + this.life.toString();
        if (this.life === 0) {
            this.gameOver()
        }
    },
    gameOver() {
        cc.sys.localStorage.setItem('score', this.score)
        this.client.close()
        cc.director.loadScene('demo');
    },
    gainScore: function () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay1.string = 'Score: ' + this.score.toString();
        this.sendMsg({
            action: 'gainScore',
            id: this.id,
            score: this.score
        })
    },
    addSushi() {
        var sushi = cc.instantiate(this.sushiPrefab);
        this.total++;
        sushi.getComponent('sushi').game = this
        this.node.addChild(sushi);
        sushi.setPosition(this.getNewSushiPosition());
        var dorpAction = cc.moveTo(this.timeStep, cc.p(sushi.x, -cc.winSize.height / 2 - 50));
        sushi.runAction(dorpAction);
        this.sushiList.push(sushi)
    },
    getNewSushiPosition() {
        var y = cc.winSize.height / 2 - 50;
        var x = cc.winSize.width / 2 - cc.winSize.width * cc.random0To1();
        // console.log('x, y:', x, y, cc.winSize.width)
        return cc.p(x, y);
    },
    removeSushi() {
        //移除到屏幕底部的sushi
        for (var i = 0; i < this.sushiList.length; i++) {
            if (-cc.winSize.height / 2 + 50 >= this.sushiList[i].y || this.sushiList[i]._parent === null) {
                if (-cc.winSize.height / 2 + 50 >= this.sushiList[i].y) {
                    this.dLife()
                }
                this.changeStep()
                // cc.log("==============remove:" + i, this.sushiList);
                this.sushiList[i].removeFromParent();
                this.sushiList[i] = undefined;
                this.sushiList.splice(i, 1);
                i = i - 1;
            }
        }
    },

    showOtherPlayer(data) {
        if (this['nameDisplay2'].string === "") {
            this['nameDisplay2'].string = 'Name: ' + data.name.toString();
            this['lifeDisplay2'].string = 'life: ' + data.life.toString();
            this['scoreDisplay2'].string = 'Score: ' + data.score.toString();
            data.labelNum = 2
        } else {
            this['nameDisplay3'].string = 'Name: ' + data.name.toString();
            this['lifeDisplay3'].string = 'life: ' + data.life.toString();
            this['scoreDisplay3'].string = 'Score: ' + data.score.toString();
            data.labelNum = 3
        }
        this.otherPlayers.push(data)
    },

    clearOtherPlayer(){
        this.otherPlayers = []
        this['nameDisplay2'].string = ''
        this['lifeDisplay2'].string = ''
        this['scoreDisplay2'].string = ''
        this['nameDisplay3'].string = ''
        this['lifeDisplay3'].string = ''
        this['scoreDisplay3'].string = ''
    },

    showTypeOfPlayer(num, type, data) {
        let str = {
            name: 'Name: ',
            life: 'Life: ',
            score: 'Score: '
        }
        this[type + 'Display' + num].string = str[type] + data[type].toString();
    },

    sendMsg(jsonData) {
        if (this.client.readyState === this.client.OPEN) {
            this.client.send(JSON.stringify(jsonData));
        }
    },

    start() {
        this.schedule(this.addSushi, 0.5, 16 * 1024, 0.2);
        this.host = 'ws://localhost:3000/'
        this.client = new WebSocket(this.host, 'echo-protocol');

        this.client.onerror = function () {
            console.log('Connection Error');
        };
        var self = this;
        this.client.onopen = function () {
            console.log('WebSocket Client Connected');
            self.id = new Date().getTime()
            cc.sys.localStorage.setItem('userId', self.id)
            self.sendMsg({
                action: 'online',
                id: self.id
            })
        };

        this.client.onclose = function () {
            console.log('echo-protocol Client Closed');
        };

        this.client.onmessage = function (e) {
            console.log(555, e)
            if (typeof e.data === 'string') {
                console.log("Received: '" + e.data + "'");
                let data = JSON.parse(e.data)
                if (data.action === 'online') {
                    for (let i = 0; i < data.users.length; i++) {
                        if (data.users[i].id === self.id) {
                            self.showTypeOfPlayer(1, 'name', data.users[i])
                        } else {
                            self.clearOtherPlayer()
                            self.showOtherPlayer(data.users[i])
                        }
                    }

                } else if (data.action === 'offline') {
                    self.clearOtherPlayer()
                    for (let i = 0; i < data.users.length; i++) {
                        if (data.users[i].id === self.id) {
                            self.showTypeOfPlayer(1, 'name', data.users[i])
                        } else {
                            self.showOtherPlayer(data.users[i])
                        }
                    }
                } else if (data.action === 'gainScore') {
                    let player = self.otherPlayers.find(e => e.id === data.user.id)
                    if (player) {
                        let labelNum = player.labelNum
                        self.showTypeOfPlayer(labelNum, 'score', data.user)
                    }                    
                }
            }
        };
    },

    update(dt) {
        this.removeSushi()
    }
});
