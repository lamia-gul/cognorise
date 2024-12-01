// Load the MNIST dataset
async function loadMNISTData() {
    const mnist = require('@tensorflow/tfjs-data').mnist;
    const data = await mnist.load();
  
    const trainData = data.getTrainData();
    const testData = data.getTestData();
  
    return { trainData, testData };
  }
  
  // Create the model
  function createModel() {
    const model = tf.sequential();
  
    model.add(tf.layers.conv2d({
      inputShape: [28, 28, 1],
      filters: 32,
      kernelSize: 3,
      activation: 'relu',
    }));
  
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
    model.add(tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      activation: 'relu',
    }));
  
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
  
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });
  
    return model;
  }
  
  // Train the model
  async function trainModel(model, trainData) {
    const { images, labels } = trainData;
  
    return model.fit(images, labels, {
      epochs: 10,
      validationSplit: 0.2,
      batchSize: 64,
      callbacks: tf.callbacks.earlyStopping({ patience: 2 }),
    });
  }
  