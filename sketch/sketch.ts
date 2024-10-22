function setup() {
    let width = 1200;
    let height = 650;
    createCanvas(width, height);
}

function draw() {
    background(0);
    let fb = createGraphics(100,100);
    fb.fill(0,0,255);
    fb.rect(0,0,50,50);
    image(fb,0,0);
}