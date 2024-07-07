import numpy as np
import tensorflow as tf
from PIL import Image
import os
from flask import Flask, request, jsonify

# List of animal species in the correct order based on the provided images
species_names = [
    'woodpecker', 'leopard', 'chimpanzee', 'koala', 'antelope', 'tiger', 'butterfly', 'bat', 'gorilla', 'parrot',
    'wombat', 'jellyfish', 'beetle', 'hyena', 'bear', 'dragonfly', 'ox', 'cow', 'goldfish', 'bee',
    'hedgehog', 'goose', 'cockroach', 'hare', 'hummingbird', 'okapi', 'panda', 'sandpiper', 'hippopotamus', 'eagle',
    'goat', 'lobster', 'crab', 'elephant', 'oyster', 'flamingo', 'owl', 'donkey', 'dog', 'boar',
    'cat', 'coyote', 'porcupine', 'seahorse', 'horse', 'mouse', 'bison', 'hamster', 'shark', 'caterpillar',
    'raccoon', 'otter', 'kangaroo', 'wolf', 'deer', 'turtle', 'grasshopper', 'possum', 'hornbill', 'moth',
    'pig', 'snake', 'fly', 'reindeer', 'fox', 'lizard', 'crow', 'ladybug', 'whale', 'duck',
    'octopus', 'swan', 'squirrel', 'lion', 'orangutan', 'dolphin', 'squid', 'pelecaniformes', 'sheep', 'turkey',
    'pigeon', 'mosquito', 'badger', 'sparrow', 'seal', 'starfish', 'rat', 'penguin', 'zebra', 'rhinoceros'
]

# Function to load the TF Lite model
def load_model(model_path):
    print(f"Loading model from {model_path}")
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    print("Model loaded successfully")
    return interpreter

# Function to preprocess the image
def preprocess_image(image_path):
    img = Image.open(image_path).convert('RGB').resize((224, 224))  # Convert to RGB to ensure 3 channels
    img_array = np.array(img, dtype=np.uint8)  # Ensure the image is in uint8 format
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    return img_array

# Function to run inference
def run_inference(model_path, image_path):
    interpreter = load_model(model_path)
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    img_array = preprocess_image(image_path)

    print("Input tensor shape:", img_array.shape)
    print("Expected shape:", input_details[0]['shape'])
    print("Input tensor type:", img_array.dtype)
    print("Expected type:", input_details[0]['dtype'])

    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()

    output_data = interpreter.get_tensor(output_details[0]['index'])
    print("Raw Model output:", output_data)

    # Prepare detailed output
    detailed_output = []
    for index, score in enumerate(output_data[0]):
        detailed_output.append({
            "species": species_names[index],
            "class_index": index,
            "confidence_score": float(score)
        })
    
    # Find the highest confidence class
    max_score_index = np.argmax(output_data)
    result = {
        "predicted_species": species_names[max_score_index],
        "confidence_score": float(output_data[0][max_score_index]),
        "detailed_output": detailed_output
    }
    
    return result

# Set up the Flask server
app = Flask(__name__)

@app.route('/infer', methods=['POST'])
def infer():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        image_path = os.path.join('uploads', file.filename)
        file.save(image_path)
        
        model_path = "./model/model.tflite"
        result = run_inference(model_path, image_path)
        os.remove(image_path)  # Clean up the uploaded file
        
        return jsonify(result)

if __name__ == '__main__':
    os.makedirs('uploads', exist_ok=True)  # Ensure the uploads directory exists
    app.run(host='0.0.0.0', port=5003)
