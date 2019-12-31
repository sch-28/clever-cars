const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let wände = [];
let updateInterval;

let ziel;

const populationTotal = 200;
let p = [];

let speedSlider = document.getElementById("speedSlider");
let cycles = 1;

let savedPlayers = [];


let counter = 0;
let counterLimit = 1200;

let wandAnfang;

let generation = 0;
let bestSoFar;

let rand = canvas.getBoundingClientRect();
let mouseX;
let mouseY;

let finished = false;

let stopGN = false;
let laden = false;

let startPos = new Vektor(canvas.width / 2, canvas.height - 15);
let lastPos;
let route = [];


let mutationRate = 1.2;
let mutationChance = 0.20;

let drawInterval;
let draw = false;
let drawCounter = 0;

function start() {

    tf.setBackend("cpu");
    // drawWalls();
    if (laden == false) {


        for (let i = 0; i < populationTotal; i++) {
            p[i] = new Player(startPos.x, startPos.y, null, null, i);
            p[i].show();
        }

        //setInterval(update, 1);
    } else {
        p[0].pos.set(startPos.x, startPos.y);
        p[0].angle = Player.startAngle;
        p[0].show();
    }
    requestAnimationFrame(update);
}


function update() {
    for (let n = 0; n < cycles; n++) {
        counter++;

        p.forEach(x => {
            x.think();
            x.update();
            x.calcFitness();
        });




        if (counter >= counterLimit) {
            while (p.length > 0) {
                if (laden == true) {
                    p[0].die();
                    break;
                }
                p.forEach(x => {
                    x.die();
                });

            }
            nextGeneration();
            counter = 0;
        } else if (p.length === 0) {
            nextGeneration();
        }

    }


    //DRAWING

    clear("white");

    p.forEach(x => {
        x.show();
    });

    for (let wand of wände) {
        wand.show();
    }

    /*     ctx.beginPath();
        for(let x of route) {
            ctx.lineTo(x.x,x.y);
            if(route.indexOf(x) == p[0].index) {
                rect(x.x-10,x.y-10,20,"green");
            }else {
            rect(x.x-10,x.y-10,20,"red");
        }}
        ctx.strokeStyle = "red";
        ctx.stroke();
     */
    if (wandAnfang) {
        drawWand();
    }


    if (ziel) {
        rect(ziel.x - 10, ziel.y - 10, 20, "crimson");
    }

    requestAnimationFrame(update);

}


function getOutput(out, player) {
    let index = out.indexOf(Math.max(...out));
    switch (index) {
        case 0:
            move("w", player);
            break;
        case 1:
            move("a", player);
            break;
        case 2:
            move("d", player);
            break;
    }
    player.show();

}
speedSlider.oninput = () => {
    cycles = speedSlider.value;
}


onmousedown = e => {
    if (e.button == 0 && wände.length == 0) {
        wandAnfang = new Vektor(mouseX, mouseY);
        draw = true;
        drawInterval = setInterval(drawWand, 1);
    }
}
createWall = () => {
    if (wandAnfang) {

        const vek = new Vektor(mouseX - wandAnfang.x, mouseY - wandAnfang.y);

        const normalVek = new Vektor(vek.x / vek.dist(), vek.y / vek.dist());


        if (wände.length == 0) {
            //Links
            let w = new Wand(wandAnfang.x - (-normalVek.y * 50), wandAnfang.y + (-normalVek.x * 50), mouseX - (-normalVek.y * 50), mouseY + (-normalVek.x * 50));
            w.show();
            wände.push(w);
            //rechts
            w = new Wand(wandAnfang.x + (-normalVek.y * 50), wandAnfang.y - (-normalVek.x * 50), mouseX + (-normalVek.y * 50), mouseY - (-normalVek.x * 50));
            w.show();
            wände.push(w);

        } else {
            let temp = wände[wände.length - 2];
            let w1 = new Wand(temp.b.x, temp.b.y, mouseX - (-normalVek.y * 50), mouseY + (-normalVek.x * 50));
            w1.show();

            temp = wände[wände.length - 1];
            w2 = new Wand(temp.b.x, temp.b.y, mouseX + (-normalVek.y * 50), mouseY - (-normalVek.x * 50));
            w2.show();
            wände.push(w1, w2);

        }
        wandAnfang = null;
        lastPos = new Vektor(mouseX, mouseY);
        route.push(lastPos);
    }
}

onmouseup = () => {
    if (draw)
        finishCourse();
}

onmousemove = (e) => {
    mouseX = e.clientX - rand.left;
    mouseY = e.clientY - rand.top;
    if (draw && (mouseX > canvas.width || mouseY > canvas.height || mouseX < 0 || mouseY < 0)) {
        finishCourse();
    }


    if (draw) {
        drawCounter++;
        if (drawCounter >= 15) {
            createWall();
            wandAnfang = new Vektor(lastPos.x, lastPos.y)
            drawCounter = 0;
        }
    }
}
function finishCourse() {
    draw = false;
    clearInterval(drawInterval);
    wandAnfang = null;


    let temp = wände[0];
    let temp2 = wände[1];
    let w1 = new Wand(temp.a.x, temp.a.y, temp2.a.x, temp2.a.y);
    w1.show();

    temp = w1.a.addReturn(new Vektor(w1.vek.x / 2, w1.vek.y / 2));
    temp.add(new Vektor(w1.vek.y / w1.vek.dist() * 30, w1.vek.x / w1.vek.dist() * -30));
    startPos.set(temp);

    Player.startAngle = -Math.atan2(w1.vek.x, w1.vek.y);

    temp = wände[wände.length - 2];
    temp2 = wände[wände.length - 1];

    let w2 = new Wand(temp.b.x, temp.b.y, temp2.b.x, temp2.b.y, true);
    w2.show();

    temp = w2.a.addReturn(new Vektor(w2.vek.x / 2, w2.vek.y / 2));
    temp.add(new Vektor(w2.vek.y / w1.vek.dist() * -30, w2.vek.x / w1.vek.dist() * 30));
    ziel = new Vektor(temp.x, temp.y);
    wände.push(w1, w2);
    start();
    /*        setInterval(movePlayer,1);
           p = new Player(startPos.x,startPos.y);
           document.addEventListener("keydown", e => {
            p.move(e.key);
            p.update();
            p.calcFitness();
            console.log(p.fitness);
        }); */

}

function movePlayer() {
    clear("white");
    for (let wand of wände) {
        wand.show();
    }
    for (let x of route) {
        rect(x.x - 10, x.y - 10, 20, "red");
    }
    p.show();
}




function drawWand() {
    clear("white");

    for (let wand of wände) {
        wand.show();
    }
}

function drawWalls(amount) {

    let oben = new Wand(0, 0, canvas.width, 0, true);
    let unten = new Wand(0, canvas.height, canvas.width, canvas.height, true);
    let rechts = new Wand(canvas.width, 0, canvas.width, canvas.height, true);
    let links = new Wand(0, 0, 0, canvas.height, true);

    wände.push(oben, unten, rechts, links);
}

async function lade() {
    laden = true;
    p = [];
    const loadModel = await tf.loadLayersModel('localstorage://Champ');
    const brain = JSON.parse(localStorage["champ1"]);
    const newBrain = new neuralNetwork(loadModel, brain.inputNodes, brain.hiddenNodes, brain.hiddenNodes2, brain.outputNodes);
    const species = localStorage["champSpecies"];
    p = [new Player(0, 0, newBrain, species, 0)];
}

async function speicher() {
    await p[0].nn.model.save("localstorage://Champ");
    localStorage["champ1"] = JSON.stringify(p[0].nn);
    localStorage["champSpecies"] = p[0].species;
}


function showBest() {
    if (laden == true) {
        laden = false;
        stopGN = false;
        document.getElementById("showBest").innerHTML = "Zeigen";
        bestSoFar.nn = p[0].nn.copy();
        p[0].nn.dispose();
        nextGeneration();

    } else {
        stopGN = true;
        document.getElementById("showBest").innerHTML = "Warte...";
    }
}
