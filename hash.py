from flask import Flask, request, jsonify
import bcrypt
import requests
from flask_cors import CORS
import json 

app = Flask(__name__)
CORS(app) 

@app.route('/')
def index():
    return "Hello, World this is the HASH serveur!"


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # Hacher le mot de passe avec bcrypt
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # Envoyer le hash au serveur encode pour l'encodage AES-SIV (encode is 5002 listening)
    response = requests.post('http://encode:5000/encode', json={'hashed_password': hashed_password.decode('utf-8')})
    if response.status_code == 200:
        encoded_hash = response.json()['encoded_hash']

        # Save to JSON file
        user_data = {
            "username": username,
            "encoded_hash": encoded_hash
        }
        
        with open('users.json', 'w') as f:
            json.dump(user_data, f)
            
        return jsonify(user_data)
    else:
        return jsonify({"message": "Error during encoding"}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    try:
        # Read stored data from JSON
        with open('users.json', 'r') as f:
            stored_data = json.load(f)
            
        # Hash and encode the provided password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        response = requests.post('http://encode:5002/encode', 
            json={'hashed_password': hashed_password.decode('utf-8')})
            
        if response.status_code == 200:
            login_encoded_hash = response.json()['encoded_hash']
            
            # Compare with stored hash
            if username == stored_data['username'] and login_encoded_hash == stored_data['encoded_hash']:
                return jsonify({"success": True, "username": username})
            else:
                return jsonify({"message": "Invalid credentials"}), 401
        else:
            return jsonify({"message": "Encoding failed"}), 500
            
    except FileNotFoundError:
        return jsonify({"message": "No registered users"}), 401
    except Exception as e:
        return jsonify({"message": "Server error"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Run the server