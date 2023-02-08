//把基类导入
import { AcGameObject } from "./AcGameObject";
import { Wall } from "./Wall";

export class GameMap extends AcGameObject{
    //传入画布和画布的父元素，用来动态修改画布的长宽
    constructor(ctx, parent){
        super();


        this.ctx = ctx;
        this.parent = parent;
        this.L = 0;

        this.rows = 13;
        this.cols = 13;

        //内部墙的格子数量设为20
        this.inner_wall_counts = 20;
        this.walls = [];
    }

    //判断联通性，source和target
    check_connectivity(g, sx, sy, tx, ty) {
        if(sx == tx && sy == ty) return true;
        g[sx][sy] = true;
        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1]; 
        for(let i = 0; i < 4; i++){
            let x = sx + dx[i], y = sy + dy[i];
            if(!g[x][y] && this.check_connectivity(g, x, y , tx, ty)) return true;
        }
        return false;
    }

    create_walls() {
        const g = [];
        for(let r = 0; r < this.rows; r++){
            g[r] = [];
            for(let c = 0; c < this.cols; c++){
                g[r][c] = false;
            }
        }
        //为四周加上障碍物
        for(let r = 0; r < this.rows; r++){
            g[r][0] = g[r][this.cols - 1] = true;
        }

        for(let c = 0; c < this.cols; c++){
            g[0][c] = g[this.rows - 1][c] = true;
        }

        //创建随机障碍物
        for(let i = 0; i < this.inner_wall_counts; i++){
            for(let j = 0; j < 1000; j++){
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                //如果存在了，或者左下角和右上角起点被覆盖了就进入下一次循环
                if(g[r][c] || g[c][r]) continue;
                if(r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) continue;
                g[c][r] = g[r][c] = true;
                break;
            }
        }

        const copy_g = JSON.parse(JSON.stringify(g));

        if(!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;

        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                if(g[r][c]){
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
        return true;
    }

    start() {
        for(let i = 0; i< 100; i++) {
            if(this.create_walls()) 
            break;
        }
    }

    update() {
        this.update_size();
        this.render();
    }

    update_size() {
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    //渲染函数
    render() {
        //定义偶数格子颜色
        const color_even = "#A2D048";
        //定义奇数格子颜色
        const color_odd = "#AAD752";
        //画奇偶格子
        for(let r = 0; r < this.rows; r++){
            for(let c = 0; c < this.cols; c++){
                if((r + c) % 2 == 0){
                    this.ctx.fillStyle = color_even;
                }
                else{
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L);
            }
        }
    }
}
