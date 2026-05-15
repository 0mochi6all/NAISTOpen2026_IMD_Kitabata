//クリックするごとに、アニメーションが割り当てられたflagが変化する
//0=手を振る、1=ジャンプ(笑顔)、2~5=指定した方向に歩く、6=棒立ち、7=戻る
var flag = 0;
var time = 0;
var turnanim = 0;
var movex = 0;
var movez = 0;

AFRAME.registerComponent('frame-animation', {
    init: function () {
        const el = this.el;

        this.frames = [
            '#icon1',
            '#icon2',
            '#icon3',
            '#icon4',
            '#icon5',
            '#icon6',
            '#icon7',
            '#icon8',
            '#icon9',
            '#icon10'
        ];
    
        this.currentFrame = 0;
        setInterval(() => {
            //flagによって表示する画像のリストが変わる
            if (flag == 0) {
                //icon3,4,5,4を順番に表示
                //他の行動から遷移するときは、icon3からスタート
                if(this.currentFrame == 2){
                    this.currentFrame = 3;
                }else if(this.currentFrame == 3){
                    if(turnanim == 0){
                        this.currentFrame = 4;
                        turnanim = 1;
                    }else{
                        this.currentFrame = 2;
                        turnanim = 0;
                    }
                }else if(this.currentFrame == 4){
                    this.currentFrame = 3;
                }else{
                    this.currentFrame = 2;
                }
            }else if(flag == 1){
                let nowPos = el.getAttribute('position');
                let x = nowPos.x;
                let y = 0;
                let z = nowPos.z;

                if((time%5)< 3){
                    y = (time%5)*0.2;
                }
                else{
                    y = (5-(time%5))*0.2;
                }
                const pos = `${x} ${y} ${z}`;

                this.currentFrame = 1;  //icon2を表示
                el.setAttribute("animation", {
                    property: "position",
                    to: pos,
                    dur: 200,
                    easing: "easeOutQuad"
                });
                if (time >= 25) {
                    flag = 6;
                    time = 0;
                }
            }else if(flag >= 2 && flag <= 5){
                let nowPos = el.getAttribute('position');
                let x = nowPos.x;
                let y = 0;
                let z = nowPos.z;
                let t = 0;

                //右か上に進むときはicon9→8→10→8→9、左か下に進むときはicon6→1→7→1→6を表示
                if(flag%3 == 2){
                    t = -1;   //左or下
                    if(this.currentFrame == 0){
                        if(turnanim == 0){
                            this.currentFrame = 6;
                            turnanim = 1;
                        }else{
                            this.currentFrame = 5;
                            turnanim = 0;
                        }
                    }else if(this.currentFrame == 5 || this.currentFrame == 6){
                        this.currentFrame = 0;
                    }else{
                        this.currentFrame = 5;
                    }
                }else{
                    t = 1;    //右or上
                    if(this.currentFrame == 7){
                        if(turnanim == 0){
                            this.currentFrame = 9;
                            turnanim = 1;
                        }else{
                            this.currentFrame = 8;
                            turnanim = 0;
                        }
                    }else if(this.currentFrame > 7){
                        this.currentFrame = 7;
                    }else{
                        this.currentFrame = 8;
                    }
                }

                //移動する座標の決定
                if(flag < 4){
                    x += t*0.1; 
                    movex += t;
                }else{
                    z -= t*0.1;
                    movez -= t;
                }

                const pos = `${x} ${y} ${z}`;

                el.setAttribute("animation", {
                    property: "position",
                    to: pos,
                    dur: 200,
                    easing: "easeOutQuad"
                });
                if (time >= 5) {
                    flag = 6;
                    time = 0;
                    turnanim = 0;
                }
            }else if(flag == 6){
                //icon1を表示
                this.currentFrame = 0;
                if(time >= 15) {
                    time = 0;
                    let nowPos = el.getAttribute('position');
                    //移動していたら、元の位置に戻るアニメーションを行う
                    if(nowPos.x != 0 || nowPos.z != 0){
                        el.setAttribute("animation", {
                            property: "position",
                            to: '0 0 0',
                            dur: Math.abs(movex) * 200 + Math.abs(movez) * 200,
                            easing: "easeOutQuad"
                        });
                        
                        if(movex < 0 || (movex == 0 && movez > 0)){
                            this.currentFrame = 8;
                        }
                        else{
                            this.currentFrame = 5;
                        }
                        flag = 7;
                    }
                    else{
                        flag = 0;
                    }
                }
            }else if(flag == 7){
                if(movex < 0 || (movex == 0 && movez > 0)){
                    if(this.currentFrame == 7){
                        if(turnanim == 0){
                            this.currentFrame = 9;
                            turnanim = 1;
                        }else{
                            this.currentFrame = 8;
                            turnanim = 0;
                        }
                    }else if(this.currentFrame > 7){
                        this.currentFrame = 7;
                    }else{
                        this.currentFrame = 8;
                    }
                    if(movex < 0){
                        movex++;
                    }else{
                        movez--;
                    }
                }else if(movex != 0 || movez != 0){
                    if(this.currentFrame == 0){
                        if(turnanim == 0){
                            this.currentFrame = 6;
                            turnanim = 1;
                        }else{
                            this.currentFrame = 5;
                            turnanim = 0;
                        }
                    }else if(this.currentFrame == 5 || this.currentFrame == 6){
                        this.currentFrame = 0;
                    }else{
                        this.currentFrame = 5;
                    }
                    if(movex > 0){
                        movex--;
                    }else{
                        movez++;
                    }
                }else{
                    flag = 0;
                    turnanim = 0;
                }
            }
            //ここまで、flagによる条件分岐

            time++;

            el.setAttribute(
                'material',
                'src',
                this.frames[this.currentFrame]
            );
        }, 200);

        el.addEventListener('click', function(evt) {
            //オブジェクトがクリックされたときの処理
            time = 0;
            if (flag == 0 || flag == 6) {
                flag = 1;
            }
        });

        left.addEventListener('click', function(goleft) {
            // 左ボタンがクリックされたときの処理
            time = 0;
            flag = 2;
        });
        right.addEventListener('click', function(goright) {
            // 右ボタンがクリックされたときの処理
            time = 0;
            flag = 3;
        });
        up.addEventListener('click', function(goup) {
            // 上ボタンがクリックされたときの処理
            time = 0;
            flag = 4;
        });
        down.addEventListener('click', function(godown) {
            // 下ボタンがクリックされたときの処理
            time = 0;
            flag = 5;
        });

    }
});