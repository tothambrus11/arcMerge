import {canvas as p} from "./drawer";

export class Arc {
    color: number;

    constructor(public start: number, public end: number, private r: number=1, color?: number) {
        this.normalize();
        this.color = color === undefined ? Math.random() * 100 +180 : color;
    }

    draw(r: number) {
        p.stroke(this.color, 100, 100);
        p.strokeWeight(3);
        p.strokeCap(p.ROUND);
        p.arc(0, 0, r * this.r, r * this.r, this.start, this.end);
    }

    normalize(){
        if(this.start<0){
            this.start += p.TWO_PI *Math.ceil(-this.start / p.TWO_PI)
        }
        if(this.end<0){
            this.end += p.TWO_PI *Math.ceil(-this.end / p.TWO_PI)
        }

        this.start %= Math.PI*2;
        this.end %= Math.PI*2;

    }

    copy() {
        return new Arc(this.start, this.end, this.r, this.color);
    }
}
