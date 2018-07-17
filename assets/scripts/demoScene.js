// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var httpHelper = {};
httpHelper.get = function(url, callback){
    var request = cc.loader.getXMLHttpRequest();
    console.log("Status: Send Get Request to " + url);
    request.open("GET", url, true);

    request.onreadystatechange = function () {
        if (request.readyState == 4 && (request.status >= 200 && request.status <= 207)) {
            var httpStatus = request.statusText;
            var response = request.responseText;
            console.log("Status: Got GET response! " + httpStatus);
            callback(true, request);
        }else{
            callback(false, request);
        }
    };
    request.send();
};

cc.Class({
    extends: cc.Component,

    properties: {
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        placeDisplay: {
            default: null,
            type: cc.Label
        },
        startButton: {
            default: null,
            type: cc.Button
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

    // onLoad () {},

    showPlace (data) {
        if (data) {
            this.placeDisplay.string = 'Place: ' + data.place;
        } else {
            this.placeDisplay.string = 'Place: 0';
        }        
    },

    clearHistory () {
        let userId = cc.sys.localStorage.getItem('userId')
        var url = 'http://localhost:3000/users/history?id=' + userId
        httpHelper.get(url, (isSuccess, res) => {
            cc.log('response', res.response)        
        })
    },

    start () {     
        let score = cc.sys.localStorage.getItem('score') || '0'
        let userId = cc.sys.localStorage.getItem('userId')
        // var url = 'http://localhost:3000/users?id=' + userId
        // httpHelper.get(url, (isSuccess, res) => {
        //     cc.log('response', res.response)
        //     if (res.response) {
        //         let data = JSON.parse(res.response)
        //         this.showPlace(data.data)
        //     }
        
        // })
        this.scoreDisplay.string = 'Score: ' + score
    },

    // update (dt) {},
});
