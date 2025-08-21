# Example Flask Backend for Body Type Classification
# This file shows how to integrate the bodytype_model.h5 with your frontend

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load the model once when the server starts
model = None

def load_model():
    global model
    try:
        model = tf.keras.models.load_model('bodytype_model.h5')
        print("Model loaded successfully!")
    except Exception as e:
        print(f"Error loading model: {e}")

def preprocess_image(image_data):
    """
    Preprocess the uploaded image for the model
    Adjust these parameters based on your model's requirements
    """
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize to model's expected input size (adjust as needed)
        image = image.resize((224, 224))  # Common input size
        
        # Convert to array and normalize
        image_array = np.array(image) / 255.0
        
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        return None

@app.route('/api/classify', methods=['POST'])
def classify_body_type():
    """
    API endpoint to classify body type from uploaded image
    """
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Preprocess the image
        processed_image = preprocess_image(data['image'])
        
        if processed_image is None:
            return jsonify({'error': 'Failed to process image'}), 400
        
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Make prediction
        predictions = model.predict(processed_image)
        
        # Assuming the model outputs probabilities for [Ectomorph, Mesomorph, Endomorph]
        body_types = ['Ectomorph', 'Mesomorph', 'Endomorph']
        
        # Get the predicted class and confidence
        predicted_class = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class] * 100)
        
        result = {
            'body_type': body_types[predicted_class],
            'confidence': round(confidence, 1),
            'probabilities': {
                'Ectomorph': round(float(predictions[0][0] * 100), 1),
                'Mesomorph': round(float(predictions[0][1] * 100), 1),
                'Endomorph': round(float(predictions[0][2] * 100), 1)
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        print(f"Error during classification: {e}")
        return jsonify({'error': 'Classification failed'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    # Load the model on startup
    load_model()
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)

# To integrate with your frontend, update the handleImageUpload function:
"""
const handleImageUpload = async (file: File) => {
  setIsProcessing(true);
  
  try {
    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result as string;
      
      // Send to backend
      const response = await fetch('http://localhost:5000/api/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setResult({
          bodyType: result.body_type,
          confidence: result.confidence
        });
        
        toast({
          title: "Analysis Complete!",
          description: `Your body type has been identified as ${result.body_type} with ${result.confidence}% confidence.`,
        });
      } else {
        throw new Error(result.error || 'Classification failed');
      }
    };
    
    reader.readAsDataURL(file);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to analyze image. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsProcessing(false);
  }
};
"""