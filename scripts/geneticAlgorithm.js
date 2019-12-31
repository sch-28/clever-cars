let sum;

function nextGeneration() {
    if (stopGN == false) {
        p = [];
        generation++;

        //highestFit = 0;
        //savedPlayers.forEach(a => highestFit += a.fitness);
        calcFit();



        for (let i = 1; i < Math.floor(populationTotal * 0.60); i++) {
            p[i] = pickPlayer(i);
        }
        for (let i = Math.floor(populationTotal * 0.60); i < Math.floor(populationTotal * 0.90); i++) {
            const clone = choosePlayer();
            const newBrain = clone.nn.copy();
            newBrain.mutate();
            p[i] = new Player(startPos.x, startPos.y, newBrain, clone.species, i);
        }


        savedPlayers.sort((a, b) => b.fitness - a.fitness);
        const champ = savedPlayers[0];

        p[0] = new Player(startPos.x, startPos.y, champ.nn.copy(), champ.species, 0);

        if(!bestSoFar || bestSoFar.fitness < champ.fitness*sum ) {
            if(!bestSoFar) {
                bestSoFar = new Player(startPos.x,startPos.y,champ.nn.copy(),champ.species,0);
                bestSoFar.fitness = champ.fitness*sum;
                bestSoFar.index = champ.index;
                bestSoFar.gen = generation;
            } else {
                bestSoFar.nn.dispose();
                bestSoFar = new Player(startPos.x,startPos.y,champ.nn.copy(),champ.species,0);
                bestSoFar.fitness = champ.fitness*sum;
                bestSoFar.index = champ.index;
                bestSoFar.gen = generation;
            }
        }

        write("stats",`Das beste Genom stammt aus der ${bestSoFar.gen}. Generation und hat die Strecke zu ${Math.round((bestSoFar.index/route.length)*100)}% abgeschlossen.`);

        for (let i = Math.floor(populationTotal * 0.90); i < populationTotal; i++) {
            const clone = champ;
            const newBrain = clone.nn.copy();
            newBrain.mutate();
            p[i] = new Player(startPos.x, startPos.y, newBrain, clone.species, i);
        }





        for (let player of savedPlayers) {
            player.nn.dispose();
        }
        savedPlayers = [];
        counter = 0;
        console.log(`Generation: ${Math.floor(generation)}||Fitness insgesamt: ${sum}, champ: ${champ.fitness}`);
        inputLabels.push("Gen: " + generation);
        inputData.push(sum);
        chart.update();
    } else {
        if(laden == true) {
            counter = 0;
            return;
        }
        p = [bestSoFar];
        laden = true;
        counter = 0;
        document.getElementById("showBest").innerHTML = "Genom weiterentwickeln";
    }
}

function pickPlayer(id) {

    let firstParent = choosePlayer();

    let secondParent = choosePlayer();

    /* let temp = 0;
    while (secondParent.species != firstParent.species) {
        secondParent = choosePlayer();
        temp++;
        if (temp > 1000) {
            secondParent = firstParent;
        }
    } */
    /*  console.log(`1: ${firstParent.species} 2:${secondParent.species}`)
     console.log(firstParent);
     console.log(secondParent); */
    const brain = firstParent.nn.merge(secondParent.nn);
    //const brain = firstParent.nn.copy();
    let child = new Player(startPos.x, startPos.y, brain, firstParent.species, id);
    child.nn.mutate();
    return child;
}

function choosePlayer() {
/* 
    let random1 = Math.random();
    let random2 = Math.random();

    let index = 0;
    while (random2 > 0) {
        index = random1;
        random2 -= linear(random1);
    }
    index = Math.round(map(index, 0, 1, 0, populationTotal - 1)); */


    /*     let index = 0;
        let r = 1;
        while (r > 0) {
            r = Math.random();
            r -= savedPlayers[index].fitness;
    
        } */
    // console.log(index);
 //   return savedPlayers[index];

        let index = 0;
        let r = Math.random();
        while (r > 0) {
          r = r - savedPlayers[index].fitness;
          index++;
        }
        index--;
    
        return savedPlayers[index];

}


function calcFit() {
     sum = 0;
    for (let player of savedPlayers) {
        sum += player.fitness
    }
    for (let player of savedPlayers) {
        player.fitness = player.fitness / sum;
    }

}


function linear(x) {
    return x * -1 + 1;
}