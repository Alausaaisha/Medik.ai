from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import joblib
from PIL import Image
import base64
import io
import os
import cv2
from tensorflow.keras.applications.vgg16 import preprocess_input
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import bcrypt
from dotenv import load_dotenv
from historyData import history_data  # Import the static data
import re


# Load environment variables
load_dotenv()

# MongoDB connection
mongo_uri = os.getenv('MONGO_URI')
client = MongoClient(mongo_uri)

#select database and collection
db = client['medik_ai'] 
users_collection = db['users']
#history_collection = db['history']

app = Flask(__name__)
CORS(app) #to enable CORS for all routes

def get_model():
    global vgg16_model
    global rf_model
    #load VGG16 for feature extraction
    vgg16_model = tf.keras.models.load_model('../pcosDL-ML/vgg16_feature_extractor.h5')

    #load the Random Forest model for classification
    rf_model = joblib.load('../pcosDL-ML/random_forest_model.joblib')
    print("Model loaded!")

def preprocess(image):
    # Convert PIL image to a NumPy array
    image = np.array(image)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    
    # Convert to grayscale if the image has 3 channels (RGB)
    if len(image.shape) == 3 and image.shape[2] == 3:
        image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    
    # Apply CLAHE
    img_clahe = clahe.apply(image)
    
    # Resize to 224x224
    img_resized = cv2.resize(img_clahe, (224, 224))
    
    # Convert back to 3 channels by duplicating the grayscale values
    img_resized = cv2.cvtColor(img_resized, cv2.COLOR_GRAY2BGR)
    
    # Normalize using VGG16 preprocess_input
    img_preprocessed = preprocess_input(img_resized)
    
    return np.expand_dims(img_preprocessed, axis=0)  # Expand dimensions for model input

print("Loading model...")
get_model()

@app.route('/')
def home():
    return 'Welcome to the Home Page!'

# @app.route('/signup', methods=['POST'])
# def signup():
#     data = request.json
#     full_name = data.get('fullName')
#     email = data.get('email')
#     mobile_number = data.get('mobileNumber')
#     password = data.get('password')

#     if not full_name or not email or not password:
#         return jsonify({'error': 'Missing data'}), 400

#     # Check if the user already exists
#     existing_user = users_collection.find_one({'email': email})
#     if existing_user:
#         return jsonify({'error': 'User already exists'}), 400

#     # Hash the password
#     hashed_password = generate_password_hash(password)

#     # Create new user document
#     user_data = {
#         'fullName': full_name,
#         'email': email,
#         'mobileNumber': mobile_number,
#         'password': hashed_password
#     }
#     users_collection.insert_one(user_data)

#     return jsonify({'message': 'Signup successful'}), 201


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    
    # Extract the fields from the request
    full_name = data.get('fullName')
    email = data.get('email')
    mobile_number = data.get('mobileNumber')
    password = data.get('password')
    
    # Check for missing fields
    if not full_name or not email or not mobile_number or not password:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check for valid email format (using a simple regex)
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Check if the user already exists
    existing_user = users_collection.find_one({'email': email})
    if existing_user:
        return jsonify({'error': 'User with this email already exists'}), 400
    
    # Hash the password for secure storage
    hashed_password = generate_password_hash(password)
    
    # Create the new user document
    user_data = {
        'fullName': full_name,
        'email': email,
        'mobileNumber': mobile_number,
        'password': hashed_password
    }
    
    # Insert the user into the collection
    users_collection.insert_one(user_data)
    
    # Return a success message
    return jsonify({'message': 'Signup successful!'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Check if user exists
    user = users_collection.find_one({'email': email})
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 400

    # Verify the password
    if not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 400

    # Store user ID or session in frontend sessionStorage (simulated here)
    user_id = str(user['_id'])
    return jsonify({'message': 'Login successful', 'userId': user_id}), 200

# @app.route('/history', methods=['GET'])
# def get_history():
#     user_id = request.headers.get('Authorization')

#     if not user_id:
#         return jsonify({'error': 'Unauthorized'}), 401
    
#     # Fetch history data for the user
#     history = history_collection.find({'userId': user_id})
#     history_data = []
#     for record in history:
#         history_data.append({
#             'id': str(record['_id']),
#             'date': record['date'],
#             'patientName': record['patientName'],
#             'pcos': record['pcos'],
#             'downloadLink': record['downloadLink']
#         })

#     return jsonify({'history': history_data}), 200
    
@app.route('/history', methods=['GET'])
def get_history():
    # Return the static data as JSON
    return jsonify({'history': history_data})


@app.route('/predict', methods=['POST'])
def predict():
    # Ensure the request contains a file
    if 'image' not in request.files:
        print("No image in request")
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['image']

    # If user does not select a file, the browser submits an empty file without a filename.
    if file.filename == '':
        print("No selected file")
        return jsonify({"error": "No selected file"}), 400

    try:
        # Open and process the image file
        image = Image.open(file.stream)
        print("Image received and opened")
        #image = np.array(image)
        preprocessed_image = preprocess(image)

        # Feature extraction using VGG16
        features = vgg16_model.predict(preprocessed_image)

        # Flatten the features to make them compatible with RandomForest
        flattened_features = features.reshape(features.shape[0], -1)

        # Run classification using Random Forest
        prediction = rf_model.predict(flattened_features).tolist()

        # Process the prediction to return to the user
        response = postprocess(prediction)

        return jsonify(response)
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

# def postprocess(prediction):
#     result = "PCOS Positive" if prediction[0] == 1 else "PCOS Negative"
#     return {"prediction": result}

def postprocess(prediction):
    # Assuming the model outputs a single probability for the positive class
    probability_positive = prediction[0] * 100  # Convert to percentage
    probability_negative = (1 - prediction[0]) * 100  # The complement for negative class

    if prediction[0] > 0.5:  # If the probability for "PCOS Positive" is greater than 0.5
        result = "PCOS Positive"
        confidence = probability_positive
    else:
        result = "PCOS Negative"
        confidence = probability_negative

    return {
        "prediction": result,
        "confidence": f"{confidence:.2f}%"
    }

if __name__ == '__main__':
    app.run(debug=True)