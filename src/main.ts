import './style.css'
import {canvas} from "./drawer";
import {Arc} from "./arc";

const p = canvas;

function calcR(): number {
    return Math.min(window.innerWidth, window.innerHeight) * .6;
}

let r = calcR();

let vel: number[] = [];
let arcs: Arc[] = [];

generateArcs();

function mergeArcs(arcs: Arc[], negate = false, margin: number = 0): Arc[] {
    arcs = arcs.map(arc => arc.copy());

    if (margin != 0) {
        for (let arc of arcs) {
            arc.start -= margin;
            arc.end += margin;
            arc.normalize();
        }
    }

    let ends: number[] = []
    arcs.forEach(arc => {
        ends.push(arc.start);
        ends.push(arc.end);
    });
    let gapCount = ends.length;

    ends = ends.sort(); // todo store in sorted set
    let gapFilled = Array(gapCount).fill(negate); // fill with something that we will negate when we find something

    for (let arc of arcs) {
        let startIndex = ends.indexOf(arc.start);
        let endIndex = ends.indexOf(arc.end);

        let i = startIndex;
        while (i != endIndex) {
            gapFilled[i] = !negate;
            i++;
            i %= gapCount;
        }
    }

    let mergedArcs: Arc[] = [];

    let firstTrue: number | undefined;
    let si!: number;
    let i = 0;
    let wentAround = false;
    while (i !== firstTrue && (firstTrue !== undefined || !wentAround)) { // todo solve the case when there is no true or no false
        if (gapFilled[i] !== gapFilled[(i + 1) % gapCount]) {
            if (gapFilled[i]) { // i: end of interval
                if (firstTrue !== undefined) mergedArcs.push(new Arc(ends[si], ends[(i + 1) % gapCount], 1, 120))
            } else { // i+1: start of interval
                si = (i + 1) % gapCount;
                if (firstTrue === undefined) {
                    firstTrue = i;
                }
            }
        }
        i++;
        if (i == gapCount) {
            i = 0;
            wentAround = true;
        }
    }
    return mergedArcs;

}

function generateArcs() {
    arcs = Array(Math.floor(5 + Math.random() * 2))
        .fill(0)
        .map(_ => Math.random() * p.TWO_PI)
        .map(v => {
            return new Arc(v, v + 0.2 + Math.random() * p.TWO_PI * 0.2, 1.2 + Math.random() * 0.3)
        })
    vel = arcs.map(a => (Math.random() * 2 - 1) / 1000)
    //console.log(mergeArcs(arcs, true, p.TWO_PI/32));

}

canvas.draw = () => {
    p.background(0);
    p.translate(p.width / 2, p.height / 2);

    arcs.forEach((arc, i) => {
        arc.start += p.deltaTime * vel[i];
        arc.end += p.deltaTime * vel[i];
        arc.normalize()
    })

    p.fill(120, 100, 15);

    mergeArcs(arcs, true, p.TWO_PI / 32).forEach(arc => arc.draw(2 * p.sqrt((p.mouseX - p.width / 2) ** 2 + (p.mouseY - p.height / 2) ** 2)));

    p.noStroke();
    p.fill(0)
    p.circle(0, 0, 1.5 * p.sqrt((p.mouseX - p.width / 2) ** 2 + (p.mouseY - p.height / 2) ** 2))

    p.noFill();
    arcs.forEach(arc => arc.draw(r))
}

canvas.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    r = calcR();
}

canvas.mouseClicked = () => {
    generateArcs();
}
