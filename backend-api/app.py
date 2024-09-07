from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np

app = Flask(__name__)
CORS(app) #to enable CORS for all routes

#load trained model
model = tf.keras.models.load_model('model/')

@app.route('/predict', methods=['POST'])
def predict():
    #get data from POST
    data = request.json
    
    #preprocess input data
    input_data = preprocess(data)

    #run prediction
    prediction = model.predict(input_data)

    #process the prediction to return to user
    result = postprocess(prediction)

    return jsonify(result)

def preprocess(data):
    return preprocessed_data

def postprocess(prediction):
    return

if __name__ == '__main__':
    app.run(debug=True)