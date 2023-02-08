//将变量存到一个数组里面
const AC_GAME_OBJECTS = [];

//将此基类export出去
export class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);
        this.timedelta = 0;
        this.has_called_start = false;

    }     

    //只执行一次
    start() {

    }

    //每一帧执行一次，除了第一帧
    update() {
        
    }

    //删除前执行
    on_destory(){


    }

    destory() {
        this.on_destory();
        //将当前对象从此类中删除，用in遍历下标
        for(let i in AC_GAME_OBJECTS){
            const obj = AC_GAME_OBJECTS[i];
            if(obj === this){
                AC_GAME_OBJECTS.splice(i);
                break;
            }
        }
    }

    
}

//上一次执行的时刻
let last_timestamp; 
//传入当前执行的时刻
const step = timestamp => {
    //用of遍历值
    for (let obj of AC_GAME_OBJECTS){
        //如果未执行过start函数则执行
        if(!obj.has_called_start){
            obj.has_called_start = true;
            obj.start();
        }
        else{
            //当前时刻减去上一次执行时刻
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(step);
}

requestAnimationFrame(step);