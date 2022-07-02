import p5 from "p5";


export const canvas = new p5((p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.HSB);
    }


}, document.getElementById("app") as any)
