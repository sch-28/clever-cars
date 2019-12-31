class neuralNetwork {
    constructor(a, b, c, d, e) {

        if (a instanceof tf.LayersModel) {
            this.model = a;
            this.inputNodes = b;
            this.hiddenNodes = c;
            if (e) {
                this.hiddenNodes2 = d;
                this.outputNodes = e;
            } else {
                this.outputNodes = d;
            }
        } else {

            this.inputNodes = a;
            this.hiddenNodes = b;
            if (d) {
                this.hiddenNodes2 = c;
                this.outputNodes = d;
            } else {
                this.outputNodes = c;
            }
            this.model = this.create();
        }
    }

    create() {
        return tf.tidy(() => {
            const inputLayer = tf.input({
                shape: [this.inputNodes]
            });

            const hiddenLayer = tf.layers.dense({
                units: this.hiddenNodes,
                activation: 'relu'
            });

            let hiddenLayer2;
            if (this.hiddenNodes2) {
                hiddenLayer2 = tf.layers.dense({
                    units: this.hiddenNodes2,
                    activation: 'relu'
                });
            }

            const hiddenLayer3 = tf.layers.dense({
                units: this.outputNodes,
                activation: 'softmax'
            });

            let output;
            if (this.hiddenNodes2) {
                output = hiddenLayer3.apply(hiddenLayer2.apply(hiddenLayer.apply(inputLayer)));
            } else {
                output = hiddenLayer3.apply(hiddenLayer.apply(inputLayer));
            }
            const model = tf.model({
                inputs: inputLayer,
                outputs: output
            });
            return model;
        });
    }

    copy() {
        return tf.tidy(() => {
            const modelCopy = this.create();
            const weights = this.model.getWeights();
            const weightCopies = [];
            for (let i = 0; i < weights.length; i++) {
                weightCopies[i] = weights[i].clone();
            }
            modelCopy.setWeights(weightCopies);
            tf.dispose(weightCopies);
            if (this.hiddenNodes2) {
                return new neuralNetwork(modelCopy, this.inputNodes, this.hiddenNodes, this.hiddenNodes2, this.outputNodes);
            } else {
                return new neuralNetwork(modelCopy, this.inputNodes, this.hiddenNodes, this.outputNodes);
            }
        });
    }

    predict(ten) {
        return tf.tidy(() => {
            const input = tf.tensor2d([ten]);
            const output = this.model.predict(input).dataSync();
            return output;
        });
    }

    merge(m) {
        return tf.tidy(() => {
            const weights = this.model.getWeights();
            const weights2 = m.model.getWeights();
            const weightsToAdd = [];
            for (let i = 0; i < weights.length; i++) {
                let tens = weights[i];
                let tens2 = weights2[i];
                let shape = weights[i].shape;
                let values = tens.dataSync().slice();
                let values2 = tens2.dataSync().slice();
                if (Math.random() < 0.5) {
                    values = values2;
                }


                /* for (let j = 0; j < values.length; j++) {
                    if (Math.random() < 0.5) {
                        values[j] = values2[j];
                    }
                } */
                let newTens = tf.tensor(values, shape);
                weightsToAdd[i] = newTens;
            }
            const model = this.create();
            model.setWeights(weightsToAdd);
            if (this.hiddenNodes2) {
                return new neuralNetwork(model, this.inputNodes, this.hiddenNodes, this.hiddenNodes2, this.outputNodes);
            } else {
                return new neuralNetwork(model, this.inputNodes, this.hiddenNodes, this.outputNodes);
            }

        });
    }


    mutate() {
        tf.tidy(() => {
            const weights = this.model.getWeights();
            const mutatedWeigths = [];
            for (let i = 0; i < weights.length; i++) {
                let tens = weights[i];
                let shape = weights[i].shape;
                let values = tens.dataSync().slice();
                for (let j = 0; j < values.length; j++) {
                    if (Math.random() < mutationChance) {
                        let w = values[j];
                        if (Math.random() < 0.1) {
                            values[j] = randomGaussian();
                        } else {
                            values[j] = w + randomGaussian();
                        }
                    }
                }
                // console.log(values);
                let newTens = tf.tensor(values, shape);
                mutatedWeigths[i] = newTens;
            }
            this.model.setWeights(mutatedWeigths);
        });
    }

    dispose() {
        this.model.dispose();
    }
}