//Zeichnet einen Kreis
function circle(x, y, radius, c) {
    ctx.fillStyle = c;
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 360)
    ctx.fill();
}
//Zeichnet einen Quadrat
function rect(x, y, scale, c) {

    if (x instanceof Vektor) {
        ctx.fillStyle = scale;
        ctx.fillRect(x.x, x.y, y, y);
    } else {
        ctx.fillStyle = c;
        ctx.fillRect(x, y, scale, scale);
    }
}

//Zeichent das ganze Canvas mit der Farbe C neu
function clear(c) {
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function map(obj, min, max, gmin, gmax) {
    return (obj - min) / (max - min) * (gmax - gmin) + gmin;
}

//Zufällige Zahl zwischen min und max
function random(min = 0, max) {
    if (max) {
        return Math.floor(Math.random() * (max - min) + min);
    } else {
        max = min;
        min = 0;
        return Math.floor(Math.random() * (max - min) + min);
    }
}

//Zufälliger Float zwischen min und max
function randomF(min = 0, max) {
    if (max) {
        return (Math.random() * (max - min) + min);
    } else {
        max = min;
        min = 0;
        return (Math.random() * (max - min) + min);
    }
}

function randomGaussian() {
    var u = 0;
    var v = 0;
    while (u == 0) {
        u = Math.random();
    }
    while (v == 0) {
        v = Math.random();
    }

    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

}

//Funktion zum Berechnen des Index eines Grids, anhand der X und Y position
function index(x, y) {
    if (x < 0 || y < 0 || x > columns - 1 || y > rows - 1) {
        return -1;
    }
    return x + y * columns;
}

//Funktion zum deaktivieren eines Buttons
function disableButton(button, x) {
    document.getElementById(button).disabled = x;
}

function write(id,text) {
    document.getElementById(id).innerHTML = text;
}

//Berechnet die Distanz von a zu b
function heuristic(a, b) {
    return Math.hypot(b.x - a.x, b.y - a.y)
}


function abRunden(x) {
    return (Math.floor(x * 100)) / 100;
}
function aufRunden(x) {
    return (Math.ceil(x * 100)) / 100;
}

//Returned länge eines Vektors
function länge(vek) {
    return Math.sqrt(vek.x * vek.x + vek.y * vek.y);
}

//Guckt ob im Object Array ein Objekt bereits inhalten ist
function contains(array, obj) {
    for (let x of array) {
        if (JSON.stringify(x) == JSON.stringify(obj)) {
            return true;
        }
    }
    return false;
}



class Vektor {
    constructor(x, y) {
        this.vek = { x: x, y: y };
        this.x = x;
        this.y = y;
    }

    add(vek) {
        this.x += vek.x;
        this.y += vek.y;

        this.set(this.x, this.y);
    }
    addReturn(vek) {
        return new Vektor(this.x + vek.x, this.y + vek.y)
    }

    set(x, y) {
        if (x instanceof Vektor) {
            this.x = x.x;
            this.y = x.y;
            this.vek = x;
        } else {
            this.x = x;
            this.y = y;

            this.vek.x = this.x;
            this.vek.y = this.y;
        }
    }

    sub(x) {
        this.x -= x;
        this.y -= x;

        this.set(this.x, this.y);
    }
    dist() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

}