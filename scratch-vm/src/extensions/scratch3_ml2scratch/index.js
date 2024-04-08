const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
const log = require('../../util/log');
const tf = require('@tensorflow/tfjs');
// const { SimpleLinearRegression } = require("ml-regression-simple-linear");
// import MultipleLinearRegression from "multiple-linear-regression";
// const MultipleLinearRegression = require("multiple-linear-regression");



class Scratch3ML2ScratchBlocks {
  constructor(runtime) {
    this.runtime = runtime;
    this.trainingData=[];
    this.targetData=[];
    this.model = null;
  }

  getInfo() {
    return {
      id: 'ml2scratch',
      name: 'ML2Scratch',
      blocks: [
        {
          opcode: 'configureModel',
          blockType: BlockType.COMMAND,
          text: 'Configure model with [NUM_INPUTS] Column 1: [INPUT_NAMES_1] and Column 2: [INPUT_NAMES_2] and Column 3: [INPUT_NAMES_3] and target [TARGET_NAME]',
          arguments: {
            NUM_INPUTS: {
              type: ArgumentType.NUMBER,
              defaultValue: 3
            },
            INPUT_NAMES_1: {
              type: ArgumentType.STRING,
              defaultValue: 'X'
            },
            INPUT_NAMES_2: {
              type: ArgumentType.STRING,
              defaultValue: 'Y'
            },
            INPUT_NAMES_3: {
              type: ArgumentType.STRING,
              defaultValue: 'Z'
            },
            TARGET_NAME: {
              type: ArgumentType.STRING,
              defaultValue: 'label'
            }
          }
        },
        {
          opcode: 'addTrainingData',
          blockType: BlockType.COMMAND,
          text: 'add training data coulmn1 [INPUT_VALUES_1] and coulmn2 [INPUT_VALUES_2] and coulmn3 [INPUT_VALUES_3] with target [TARGET_VALUE]',
          arguments: {
            INPUT_VALUES_1: {
              type: ArgumentType.STRING,
              defaultValue: "3"
            },
            INPUT_VALUES_2: {
              type: ArgumentType.STRING,
              defaultValue: "2"
            },
            INPUT_VALUES_3: {
              type: ArgumentType.STRING,
              defaultValue: "1"
            },
            TARGET_VALUE: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        },
        {
          opcode: 'trainModel',
          blockType: BlockType.COMMAND,
          text: 'train new machine learning model'
        },
        {
          opcode: 'predictTarget',
          blockType: BlockType.REPORTER,
          text: 'predict [TARGET_NAME] from coulmn1 [INPUT_VALUES_1] and coulmn2 [INPUT_VALUES_2] and coulmn3 [INPUT_VALUES_3]',
          arguments: {
            TARGET_NAME: {
              type: ArgumentType.STRING,
              defaultValue: 'label'
            },
            INPUT_VALUES_1: {
              type: ArgumentType.STRING,
              defaultValue: "3"
            },
            INPUT_VALUES_2: {
              type: ArgumentType.STRING,
              defaultValue: "2"
            },
            INPUT_VALUES_3: {
              type: ArgumentType.STRING,
              defaultValue: "1"
            }
          }
        },
        {
          opcode: 'isModelReady',
          blockType: BlockType.BOOLEAN,
          text: 'is the machine learning model ready to use?'
        }
      ]
    };
  }

  configureModel(args) {
    const numInputs = Cast.toNumber(args.NUM_INPUTS);
    const targetName = args.TARGET_NAME.trim();
    this.inputNames = [
      args.INPUT_NAMES_1,
      args.INPUT_NAMES_2,
      args.INPUT_NAMES_3
    ];

    if (numInputs !== this.inputNames.length) {
      throw new Error('Number of input names must match the specified number of inputs');
    }

    this.numInputs = numInputs;
    this.inputNames_1 = args.INPUT_NAMES_1;
    this.inputNames_2 = args.INPUT_NAMES_2;
    this.inputNames_3 = args.INPUT_NAMES_3;
    this.targetName = targetName; //

    // Update the existing blocks with the new input and target names
    // this.updateBlocks();
  }

  addTrainingData(args) {
    const inputValues = [
      args.INPUT_VALUES_1,
      args.INPUT_VALUES_2, 
      args.INPUT_VALUES_3,
    ];
  
    const targetValue = Cast.toNumber(args.TARGET_VALUE);
  
    if (inputValues.length !== this.numInputs) {
      throw new Error('Number of input values must match the specified number of inputs');
    }
  
    let dataPoint = [];
    let targetPoint = [];
    for (let i = 0; i < this.numInputs; i++) {
      dataPoint.push(Cast.toNumber(inputValues[i]));
      // dataPoint[this.inputNames[i]] = Cast.toNumber(inputValues[i]);

    }
    targetPoint.push(targetValue);
    this.trainingData.push(dataPoint);
    this.targetData.push(targetPoint);
    // this.trainingData.push(dataPoint);
    console.log('Training data:', this.trainingData,'Target data:',this.targetData);
  }
  

  
  async trainModel() {
    // Normalize the training data
    const xNormalized = this.normalizeData(this.trainingData);
    const yNormalized = this.normalizeData(this.targetData);
  
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 1, inputShape: [3] }));
    this.model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
  
    await this.model.fit(xNormalized, yNormalized, { epochs: 100 });
    return "model trained";
}

normalizeData(data) {
    const mean = tf.mean(data, 0);
    const std = tf.sqrt(tf.moments(data, 0).variance);
    return tf.div(tf.sub(data, mean), std);
}

predictTarget(args) {
    const inputValues = [
        Cast.toNumber(args.INPUT_VALUES_1),
        Cast.toNumber(args.INPUT_VALUES_2), 
        Cast.toNumber(args.INPUT_VALUES_3),
    ];

    if (inputValues.length !== this.numInputs) {
        throw new Error('Number of input values must match the specified number of inputs');
    }

    const x = tf.tensor2d([inputValues]);

    const normalizedInput = this.normalizeData(x);
    const predictionTensor = this.model.predict(normalizedInput);
    const predictedValue = predictionTensor.dataSync()[0];
    console.log(`Predicted value: ${predictedValue}`);

    return parseInt(predictedValue);
}


  isModelReady() {
    // Check if your machine learning model is ready to use
    // ...

    return isReady;
  }

  updateBlocks() {
    const inputNamesString = this.inputNames.join(', ');
    const inputValuesPlaceholder = Array(this.numInputs).fill('0').join(', ');

    this.runtime.updateBlockDefinition({
      opcode: 'addTrainingData',
      text: `add training data [INPUT_VALUES] with target [TARGET_VALUE]`,
      arguments: {
        INPUT_VALUES: {
          type: ArgumentType.STRING,
          defaultValue: inputValuesPlaceholder
        },
        TARGET_VALUE: {
          type: ArgumentType.NUMBER,
          defaultValue: 0
        }
      }
    });

    this.runtime.updateBlockDefinition({
      opcode: 'predictTarget',
      text: `predict [TARGET_NAME] from [INPUT_VALUES]`,
      arguments: {
        TARGET_NAME: {
          type: ArgumentType.STRING,
          defaultValue: this.targetName
        },
        INPUT_VALUES: {
          type: ArgumentType.STRING,
          defaultValue: inputValuesPlaceholder
        }
      }
    });
  }
}

exports.blockClass = Scratch3ML2ScratchBlocks;
module.exports = Scratch3ML2ScratchBlocks;