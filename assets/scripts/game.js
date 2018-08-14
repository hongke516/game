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
        stonePoint: null,
        total: 0,
        sunNum: 0,
        stoneNum: 0,
        totalStar: 0,
        clinet: null,
        mousePosX: 0,
        mousePosY: 0,
        stoneDisplay: {
            default: null,
            type: cc.Label
        },
        sunDisplay: {
            default: null,
            type: cc.Label
        },
        numberDisplay: {
            default: null,
            type: cc.Label
        },
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
        },
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        qiuPrefab: {
            default: null,
            type: cc.Prefab
        },
        sunPrefab: {
            default: null,
            type: cc.Prefab
        },
        stonePrefab: {
            default: null,
            type: cc.Prefab
        },
        fireStonePrefab: {
            default: null,
            type: cc.Prefab
        },
        myDapao: {
            default: null,
            type: cc.Node
        },
        myGuo: {
            default: null,
            type: cc.Node
        },
        zhuozi: {
            default: null,
            type: cc.Node
        },
        cao: {
            default: null,
            type: cc.Node
        },
        opponent: {
            default: null,
            type: cc.Node
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
    gainSun: function () {
        this.sunNum += 1;
        // 更新 scoreDisplay Label 的文字
        this.sunDisplay.string = this.sunNum.toString();
        // this.sendMsg({
        //     action: 'gainScore',
        //     id: this.id,
        //     score: this.score
        // })
    },
    gainStone: function () {
        this.stoneNum += 1;
        // 更新 scoreDisplay Label 的文字
        this.stoneDisplay.string = this.stoneNum.toString();
        // this.sendMsg({
        //     action: 'gainScore',
        //     id: this.id,
        //     score: this.score
        // })
    },
    gainLife: function () {
        this.life += 1;
        // 更新 scoreDisplay Label 的文字
        this.lifeDisplay1.string = 'Life: ' + this.life.toString();
        this.sendMsg({
            action: 'gainLife',
            id: this.id,
            score: this.life
        })
    },
    fireQiu() {
        // cc.log('fireQiu')
        var qiu = cc.instantiate(this.qiuPrefab);
        this.totalStar++;
        qiu.getComponent('qiu').game = this
        this.node.addChild(qiu);
    },
    getRandomPosition2(fireStone) {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = 0;
        var maxY = this.opponent.height / 2
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = this.opponent.width / 2
        randX = cc.randomMinus1To1() * maxX
        randY = cc.randomMinus1To1() * maxY + this.opponent.y
        // 返回星星坐标
        return cc.p(randX, randY);
    },
    getAngle() {
        let homePoint = cc.p(this.myDapao.x, this.myDapao.y)
        let x = homePoint.x - this.stonePoint.x
        let y = homePoint.y - this.stonePoint.y
        let tan = x / y
        let A = Math.atan(tan) * 180 / Math.PI
        return A
    },
    dapaoChange (callback) {
        // 旋转角度
        self = this
        let A = this.getAngle()
        let jumpAction = cc.rotateTo(0.5, A)
        let jumpActionBack = cc.rotateTo(0.5, 0)
        let finish = cc.callFunc(callback, self)
        let seq = cc.sequence(jumpAction, finish, jumpActionBack)
        this.myDapao.runAction(seq)
    },
    fireStone() {
        // cc.log('fireQiu')
        var fireStone = cc.instantiate(this.fireStonePrefab)
        fireStone.getComponent('fireStone').game = this
        this.stonePoint = this.getRandomPosition2(fireStone)
        this.dapaoChange(()=>{
            this.node.addChild(fireStone)
        })
    },
    addSun() {
        // cc.log('addSun')
        var sun = cc.instantiate(this.sunPrefab);
        sun.getComponent('sun').game = this
        this.node.addChild(sun);
        sun.setPosition(this.getNewRandomPosition(sun));
    },
    addStar() {
        // cc.log('addSushi')
        var star = cc.instantiate(this.starPrefab);
        this.totalStar++;
        star.getComponent('star').game = this
        this.node.addChild(star);
        // sushi.setPosition(this.getNewSushiPosition());
        star.setPosition(this.getNewRandomPosition(star));
        // var dorpAction = cc.moveTo(this.timeStep, cc.p(sushi.x, -cc.winSize.height / 2 - 50));
        // sushi.runAction(dorpAction);
        // this.sushiList.push(sushi)
    },
    addSushi() {
        // cc.log('addSushi')
        var sushi = cc.instantiate(this.sushiPrefab);
        this.total++;
        sushi.getComponent('sushi').game = this
        this.node.addChild(sushi);
        // sushi.setPosition(this.getNewSushiPosition());
        sushi.setPosition(this.getNewRandomPosition(sushi));
        // var dorpAction = cc.moveTo(this.timeStep, cc.p(sushi.x, -cc.winSize.height / 2 - 50));
        // sushi.runAction(dorpAction);
        // this.sushiList.push(sushi)
    },
    addStone() {
        // cc.log('addSushi')
        var stone = cc.instantiate(this.stonePrefab);
        stone.getComponent('stone').game = this
        this.node.addChild(stone);
        // sushi.setPosition(this.getNewSushiPosition());
        stone.setPosition(this.getNewRandomPosition(stone));
        // var dorpAction = cc.moveTo(this.timeStep, cc.p(sushi.x, -cc.winSize.height / 2 - 50));
        // sushi.runAction(dorpAction);
        // this.sushiList.push(sushi)
    },
    getNewSushiPosition() {
        var y = cc.winSize.height / 2 - 50;
        var x = cc.winSize.width / 2 - cc.winSize.width * cc.random0To1();
        // console.log('x, y:', x, y, cc.winSize.width)
        return cc.p(x, y);
    },
    getNewRandomPosition: function (sushi) {
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = 0;
        var maxY = this.zhuozi.y - 100;
        // 根据屏幕宽度，随机得到一个星星 x 坐标
        var maxX = cc.winSize.width / 2 - sushi.width/2;
        randX = cc.randomMinus1To1() * maxX;
        randY = cc.randomMinus1To1() * maxY;
        // 返回星星坐标
        return cc.p(randX, randY);
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

    readyAction (num, callback) {
        let self = this;
        // var goNumber = cc.Label();
        // this.node.addChild(goNumber);
        // goNumber.setPosition(0, 0);
        console.log('test', num)
        // 放大效果
        // let scaleAction = cc.scaleTo(1, 8);
        // self.numberDisplay.string = num > 0 ? num + '' : 'Go';
        // self.numberDisplay.node.setScale(1);
        // self.numberDisplay.node.runAction(scaleAction);

        // 闪烁效果
        let blinkAction = cc.blink(1, 1);
        self.numberDisplay.string = num > 0 ? num + '' : 'Go';
        self.numberDisplay.node.runAction(blinkAction);
        if (num >= 0){
            setTimeout(function(){
                self.readyAction(--num)
            }, 1000)
        }else{
            console.log('schedule', num)
            self.numberDisplay.string = '';
            self.numberDisplay.node.setScale(1);
            // self.addSushi();
            // self.addStar();
            // self.fireQiu();
            let onMouseMove = (event) => {
                self.mousePosX = event._x;
                self.mousePosY = event._y;
                // cc.log('game move....', event._x, event._y)
            }
            self.node.on('mousemove', onMouseMove, this.node)
            self.schedule(self.addStone, 1.5, 16 * 1024, 0.8);
            self.schedule(self.addSun, 1, 16 * 1024, 1);
        }
        
    },

    addMove (callback) {
        
        this.node.on('mousemove', callback, this.node)
    },

    start() {
        this.readyAction(3);
        // this.schedule(this.addSushi, 0.5, 16 * 1024, 0.2);
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
        // this.removeSushi()
    }
});
