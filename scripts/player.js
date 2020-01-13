class Player {
    static speed = 15;
    static rotSpeed = 1 * Math.PI / 180;
    static startAngle = 0;

    constructor(x, y, brain, species, id) {
        this.gen;
        this.id = id;

        this.size = 20;


        this.pos = new Vektor(x, y);

        this.angle = Player.startAngle;


        this.dead = false;

        this.rayLength = this.size * 6;

        this.fitness;

        this.speed = Player.speed;
        this.rotSpeed = Player.rotSpeed;

        this.index = 0;

        this.lastMovement;

        //VORNE, RECHTS, LINKS, UNTEN
        this.lookVectors = [0, -45 * Math.PI / 180, 45 * Math.PI / 180, -90 * Math.PI / 180, 90 * Math.PI / 180];
        this.vectorDistance = [0, 0, 0, 0, 0];
        this.combinedD = 1;

        if (species == null) {
            //this.species = random(0, 5);
            this.species = 0;
        } else {
            this.species = species;
        }



        if (brain) {
            this.nn = brain;
            this.species = species;
        } else {

            switch (this.species) {
                /* case 0:
                    this.nn = new neuralNetwork(5, 10, 3); //yellow
                    break;
                case 1:
                    this.nn = new neuralNetwork(5, 20, 3);//red
                    break;
                case 2:
                    this.nn = new neuralNetwork(5, 10, 10, 3);//green
                    break; */
                case 0:
                    this.nn = new neuralNetwork(5, 12, 3);//blue
                    break;
                /* case 4:
                    this.nn = new neuralNetwork(5, 20, 20, 3);//orange
                    break; */
            }
        }
        this.color = ("crimson");
    }




    show() {
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle);
        rect(-this.size / 2, -this.size / 2, this.size, this.color);
        ctx.resetTransform();
    }


    think() {
        let inputs = [];
        inputs.push(
            this.vectorDistance[0],
            this.vectorDistance[1],
            this.vectorDistance[2],
            this.vectorDistance[3],
            this.vectorDistance[4],
        );

        let output = this.nn.predict(inputs);

        let index = output.indexOf(Math.max(...output));
        switch (index) {
            case 0:
                this.pos.x += this.speed * Math.cos(this.angle)
                this.pos.y += this.speed * Math.sin(this.angle)
                this.lastMovement = counter;
                break;
            case 1:
                this.angle -= this.rotSpeed;
                break;
            case 2:
                this.angle += this.rotSpeed;
                break;
        }
    }

    move(key) {
        switch (key) {
            case "w":
                this.pos.x += this.speed * Math.cos(this.angle)
                this.pos.y += this.speed * Math.sin(this.angle)
                break;
            case "a":
                this.angle -= this.rotSpeed;
                break;
            case "d":
                this.angle += this.rotSpeed;
                break;
        }
    }

    update() {
        let temp = this.checkCollision();
        if (temp == 1) {
            this.die();
            return;
        } else if (temp == 2) {
            this.index = route.length;
            return;
        }
        this.look();
    }

    die() {
        //   this.fitness = this.fitness * this.fitness;
        if (this.dead != true) {
            if (laden == true) {

                const newBrain = p[0].nn.copy();

                p[0].nn.dispose();

                p = [new Player(startPos.x, startPos.y, newBrain, p[0].species, 0)];
                nextGeneration();
                return;
            }
            this.dead = true;
            if (!finished)
                savedPlayers.push(p.splice(p.indexOf(this), 1)[0]);

        }
    }

    checkCollision() {
        let s = this.size / 2;
        for (let wand of wände) {

            //Oben rechts -> unten links
            let a = this.pos.x + s;
            let b = this.pos.y - s;
            let c = -this.size;
            let d = this.size;

            const e = wand.a.x;
            const f = wand.a.y;
            const g = wand.vek.x;
            const h = wand.vek.y;


            let u = (c * (f - b) + d * (a - e)) / (g * d - h * c);
            let t = (e + u * g - a) / c;
            if (c == 0) {
                t = t = (f + u * h - b) / d;
            }

            if (t > 0 && t < 1 && u > 0 && u < 1) {
                return 1;

            }
            //Oben links -> unten rechts
            a = this.pos.x - s;
            b = this.pos.y - s;
            c = this.size;
            d = this.size;
            u = (c * (f - b) + d * (a - e)) / (g * d - h * c);
            t = (e + u * g - a) / c;
            if (c == 0) {
                t = t = (f + u * h - b) / d;
            }

            if (t > 0 && t < 1 && u > 0 && u < 1) {
                return 1;

            }

        }
        if (ziel) {
            //Oben rechts -> unten links
            let a = this.pos.x + s;
            let b = this.pos.y - s;
            let c = -this.size;
            let d = this.size;

            let e = ziel.x - s;
            let f = ziel.y - s;
            let g = this.size;
            let h = this.size;


            let u = (c * (f - b) + d * (a - e)) / (g * d - h * c);
            let t = (e + u * g - a) / c;
            if (c == 0) {
                t = t = (f + u * h - b) / d;
            }

            if (t > 0 && t < 1 && u > 0 && u < 1) {
                return 2;

            }
            //Oben links -> unten rechts
            a = this.pos.x - s;
            b = this.pos.y - s;
            c = this.size;
            d = this.size;

            e = ziel.x + s;
            f = ziel.y - s;
            g = -this.size;
            h = this.size;

            u = (c * (f - b) + d * (a - e)) / (g * d - h * c);
            t = (e + u * g - a) / c;
            if (c == 0) {
                t = t = (f + u * h - b) / d;
            }

            if (t > 0 && t < 1 && u > 0 && u < 1) {
                return 2;


            }
        }
    }

    look() {
        for (let i = 0; i < 5; i++) {
            let min = canvas.width;
            for (let wand of wände) {


                //RAY IN DER MITTE
                let a = this.pos.x;
                let b = this.pos.y;
                let c = Math.cos(this.angle + this.lookVectors[i]);
                let d = Math.sin(this.angle + this.lookVectors[i]);

                const e = wand.a.x;
                const f = wand.a.y;
                const g = wand.vek.x;
                const h = wand.vek.y;



                let u = (c * (f - b) + d * (a - e)) / (g * d - h * c);
                let t = (e + u * g - a) / c;
                if (Math.floor(c) == 0) {
                    t = t = (f + u * h - b) / d;
                }

                if (t > 0 && u > 0 && u < 1) {

                    if (t < min) {
                        min = t - 10;
                    }

                }

                if (i == 0) {
                    //RAY RECHTS
                    a = this.pos.x + this.size / 2;
                    b = this.pos.y;
                    c = Math.cos(this.angle + this.lookVectors[i]);
                    d = Math.sin(this.angle + this.lookVectors[i]);

                    u = (c * (f - b) + d * (a - e)) / (g * d - h * c);
                    t = (e + u * g - a) / c;
                    if (Math.floor(c) == 0) {
                        t = t = (f + u * h - b) / d;
                    }

                    if (t > 0 && u > 0 && u < 1) {

                        if (t < min) {
                            min = t - 10;
                        }

                    }

                    //RAY LINKS
                    a = this.pos.x - this.size / 2;
                    b = this.pos.y;
                    c = Math.cos(this.angle + this.lookVectors[i]);
                    d = Math.sin(this.angle + this.lookVectors[i]);

                    u = (c * (f - b) + d * (a - e)) / (g * d - h * c);
                    t = (e + u * g - a) / c;
                    if (Math.floor(c) == 0) {
                        t = t = (f + u * h - b) / d;
                    }

                    if (t > 0 && u > 0 && u < 1) {

                        if (t < min) {
                            min = t - 10;
                        }

                    }

                }
            }
            this.vectorDistance[i] = min / canvas.width;
        }

        this.combinedD = 0;
        for (let i = 0; i < 5; i++) {
            this.combinedD += this.vectorDistance[i];
        }
        this.combinedD = this.combinedD / 3;
    }



    calcFitness() {




        //DISTANZ ZUM ZIEL
        let d;
        let min = Infinity;

        for (let x of route) {
            d = heuristic(this.pos, x) - this.size / 2;
            if (d < min) {
                min = d;
                this.index = route.indexOf(x);
            }
        }
        if (laden != true && (counter - this.lastMovement > 125 || (counter >= counterLimit / 6 && this.index < 2))) {
            this.die();
            return;
        }
        if (heuristic(this.pos, ziel) - this.size / 2 < 20) {
            this.index = route.length;
            this.die();
            let distance = 0;


            distance = route.length - this.index;

            distance = map(distance, 0, route.length, 1, 0);


            //let zeit = map(counter, 0, counterLimit, 0.2, 0);
            this.fitness = distance;
            return;
        }




        let distance = 0;


        distance = route.length - this.index;

        distance = map(distance, 0, route.length, 1, 0);


        //let zeit = map(counter, 0, counterLimit, 0.2, 0);
        this.fitness = distance;

    }
}