const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let wände = [];
let updateInterval;

let ziel;

const populationTotal = 100;
let p = [];
let cycles = 1;

let savedPlayers = [];


let counter = 0;

let wandAnfang;

let generation = 1;
let highestFit = 0;
let bestSoFar;

let rand = canvas.getBoundingClientRect();
let mouseX;
let mouseY;

let finished = false;
let laden = false;


let mutationRate = 2;

function start() {

    tf.setBackend("cpu");
    drawWalls();
    if (laden == false) {


        for (let i = 0; i < populationTotal; i++) {
            p[i] = new Player(canvas.width / 2, canvas.height - 15);
            p[i].show();
        }

        document.addEventListener("keydown", move);



        // requestAnimationFrame(update);
        setInterval(update, 1);
    } else {
        setInterval(Lupdate, 1);
    }
}


function update() {

    for (let c = 0; c < cycles; c++) {
        if (p.length == 0) {
            nextGeneration();
        }

        for (let player of p) {


            let inputs = [];
            inputs.push(
                player.vectorDistance[0],
                player.vectorDistance[1],
                player.vectorDistance[2],
                /* player.pos.x / canvas.height,
                player.pos.y / canvas.height,
                ziel.x / canvas.height,
                ziel.y / canvas.height */);

            player.nn.predict(inputs, player);

            player.calcFitness();
         //  player.fitness = counter / 1000;
            player.update();


        }
        counter++;
        if (counter >= 1000) {
            counter = 0;
            while (p.length > 0) {
                //  p[0].fitness *= 0.7;
                savedPlayers.push(p.splice(0, 1)[0]);
            }

            nextGeneration();
            //requestAnimationFrame(update);
        }
    }
    /* p[0].look();
    p[0].update(); */
    if (!finished && p.length > 0) {
        clear("black");

        for (let wand of wände) {
            wand.show();
        }

        if (wandAnfang) {
            drawWand();
        }


        if (ziel) {
            rect(ziel.x - 10, ziel.y - 10, 20, "red");
        }
        // requestAnimationFrame(update);
    }
}
function Lupdate() {
    let player = p;

    if(player.dead == true) {
        player.pos.set(canvas.width / 2, canvas.height - 15);
        player.dead = false;
    }

    let inputs = [];
    inputs.push(
        player.vectorDistance[0],
        player.vectorDistance[1],
        player.vectorDistance[2],
        player.fitness,
        player.combinedD,
        player.vel.x,
        player.vel.y
    );

    player.nn.predict(inputs, player);

    player.calcFitness();
    player.update();




    clear("black");

    for (let wand of wände) {
        wand.show();
    }

    if (wandAnfang) {
        drawWand();
    }


    if (ziel) {
        rect(ziel.x - 10, ziel.y - 10, 20, "red");
    }

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
        /* case 3:
            move("d", player);
            break; */
    }
    player.show();

}

function move(e, obj) {
    if (obj && obj.dead || finished) {
        return;
    }

    let button;

    if (e instanceof KeyboardEvent) {
        button = e.key;
        obj = p[0];
    } else {
        button = e;
    }

    let s = obj.speed;
    switch (button) {
        case "w":
            if (obj.vel.y != s)
                obj.vel.set(0, -s);
            break;
        case "s":
            if (obj.vel.y != -s)
                obj.vel.set(0, s);
            break;
        case "a":
            if (obj.vel.x != s)
                obj.vel.set(-s, 0);
            break;
        case "d":
            if (obj.vel.x = s)
                obj.vel.set(s, 0);
            break;


    }
}


onmousedown = e => {
    if (e.button == 0 && !finished) {
        wandAnfang = new Vektor(mouseX, mouseY);
    } else if (e.button == 2 && !finished) {
        ziel = new Vektor(mouseX, mouseY);
        start();
    }
}
onmouseup = e => {
    if (wandAnfang) {
        w = new Wand(wandAnfang.x, wandAnfang.y, mouseX, mouseY);
        w.show()
        wände.push(w);
        wandAnfang = null;
    }
}

onmousemove = e => {
    mouseX = e.clientX - rand.left;
    mouseY = e.clientY - rand.top;
}

function drawWand() {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(wandAnfang.x, wandAnfang.y);
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
}

function drawWalls(amount) {
    /*     wände = [];
        for (let i = 0; i < amount; i++) {
    
            let x = random(canvas.width);
            let y = random(canvas.height);
            let x2 = random(canvas.width);
            let y2 = random(canvas.height);
    
            let w;
    
            if (random(2) == 0) {
                w = new Wand(x, y, x, y2)
            } else {
                w = new Wand(x, y, x2, y)
            }
    
            w.show();
            wände.push(w);
        } */

    let oben = new Wand(0, 0, canvas.width, 0);
    let unten = new Wand(0, canvas.height, canvas.width, canvas.height);
    let rechts = new Wand(canvas.width, 0, canvas.width, canvas.height);
    let links = new Wand(0, 0, 0, canvas.height);

    wände.push(oben, unten, rechts, links);
}

async function lade() {
    laden = true;
    p = [];
    const loadModel = await tf.loadLayersModel('localstorage://bestBot');
    p = new Player(canvas.width / 2, canvas.height - 15, new neuralNetwork(loadModel, 7, 20, 20, 3));
}