const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const tf = require('@tensorflow/tfjs');

class Scratch3ML2ScratchBlocks {
  constructor(runtime) {
    this.inputNames_1 = "column1";
    this.inputNames_2 = "column2";
    this.inputNames_3 = "column3";
    this.targetName="Label";
    this.epochs= 200;
    this.batchSize=40;
    this.runtime = runtime;
    this.trainingData=[];
    this.targetData=[];
    this.mean=0;
    this.standardDeviation=0;

    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 50, inputShape: [3], activation: 'sigmoid', kernelInitializer: 'leCunNormal' }));
    this.model.add(tf.layers.dense({ units: 50, activation: 'sigmoid', kernelInitializer: 'leCunNormal' }));
    this.model.add(tf.layers.dense({ units: 1 }));

    // Compile the model
    this.model.compile({ optimizer: tf.train.sgd(0.01), loss: 'meanSquaredError' });
  }

  getInfo() {
    return {
      id: 'regressionengine',
      name: 'Regression Engine',
      blocks: [
        {
          opcode: 'configureModel',
          blockType: BlockType.COMMAND,
          text: 'configure model with [NUM_INPUTS] column 1:[INPUT_NAMES_1] and column 2:[INPUT_NAMES_2] and column 3:[INPUT_NAMES_3] and target:[TARGET_NAME]',
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
          opcode: 'addvanceinformation',
          blockType: BlockType.COMMAND,
          text: 'epochs:[NUM_EPOCHS] and batch size:[NUM_BATCH_SIZE]',
          arguments: {
            NUM_EPOCHS: {
              type: ArgumentType.NUMBER,
              defaultValue: this.epochs
            },
            NUM_BATCH_SIZE: {
              type: ArgumentType.STRING,
              defaultValue: this.batchSize
            },
          }
        },
        {
          opcode: 'addTrainingData',
          blockType: BlockType.COMMAND,
          text: `add training data ${this.inputNames_1}:[INPUT_VALUES_1] and ${this.inputNames_2}:[INPUT_VALUES_2] and ${this.inputNames_3}:[INPUT_VALUES_3] with target:${this.targetName}`,
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
          text: `predict ${this.targetName} from ${this.inputNames_1}:[INPUT_VALUES_1] and ${this.inputNames_2}:[INPUT_VALUES_2] and ${this.inputNames_3}:[INPUT_VALUES_3]`,
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
  }

  addvanceinformation(args){
    this.epochs = Cast.toNumber(args.NUM_EPOCHS);
    this.batchSize = Cast.toNumber(args.NUM_BATCH_SIZE);
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
    }

    targetPoint.push(targetValue);
    this.trainingData.push(dataPoint);
    this.targetData.push(targetPoint);
    console.log('Training data:', this.trainingData,'Target data:',this.targetData);
  }

  async trainModel() {
    // Normalize the training data
    const trainingDataTensor= tf.tensor2d(this.trainingData);
    const targetDataTensor = tf.tensor2d(this.targetData);

    this.mean = tf.mean(trainingDataTensor, 0);
    this.standardDeviation = trainingDataTensor
    .sub(this.mean)
    .square()
    .mean(0)
    .sqrt();

    const normalisedInputFeatures = trainingDataTensor
                    .sub(this.mean)
                    .div(this.standardDeviation);
  
    await this.model.fit(normalisedInputFeatures, targetDataTensor, { batchSize : this.batchSize,
      epochs : this.epochs,
      validationSplit : 0.2,});
    console.log("Model trained");
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

    const inputTensor = tf.tensor2d([ inputValues ]);
    const normalisedInputValues = inputTensor
                .sub(this.mean)
                .div(this.standardDeviation);
  
    const predictionTensor = this.model.predict(normalisedInputValues);
    const predictedValue = predictionTensor.dataSync()[0];
    console.log(`Predicted value: ${predictedValue}`);
  
    return predictedValue;
  }  
  

  isModelReady() {
    const isReady = this.model !== null;
    console.log(isReady);
    return isReady;
  }

}

exports.blockClass = Scratch3ML2ScratchBlocks;
module.exports = Scratch3ML2ScratchBlocks;