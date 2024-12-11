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

    # Generate salt and hash password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # Send hash for encoding
    response = requests.post('http://encode:5000/encode', 
        json={'hashed_password': hashed_password.decode('utf-8')})
    
    if response.status_code == 200:
        encoded_hash = response.json()['encoded_hash']
        
        # Store both salt and encoded hash
        user_data = {
            "username": username,
            "salt": salt.decode('utf-8'),  # Store the salt
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
        # Read stored data
        with open('users.json', 'r') as f:
            stored_data = json.load(f)
        
        # Use stored salt to hash login password
        stored_salt = stored_data['salt'].encode('utf-8')
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), stored_salt)
        
        # Send for encoding
        response = requests.post('http://encode:5000/encode', 
            json={'hashed_password': hashed_password.decode('utf-8')})
            
        if response.status_code == 200:
            login_encoded_hash = response.json()['encoded_hash']
            
            if username == stored_data['username'] and login_encoded_hash == stored_data['encoded_hash']:
                return jsonify({"success": True, "username": username})
            else:
                return jsonify({"message": "Invalid credentials"}), 401
        else:
            return jsonify({"message": "Encoding failed"}), 500
            
    except FileNotFoundError:
        return jsonify({"message": "No registered users"}), 401
    except Exception as e:
        return jsonify({"message": "Server error", "error": str(e)}), 500
    data = request.get_json()
    username = data['username']
    password = data['password']

    try:
        # Read stored data from JSON
        with open('users.json', 'r') as f:
            stored_data = json.load(f)
            
        # Get stored encoded hash for comparison
        stored_username = stored_data['username']
        stored_encoded_hash = stored_data['encoded_hash']
            
        # Hash and encode the provided password
        salt = bcrypt.gensalt()  # We'll use this salt for the test password
        test_hash = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        # Send to encode service - use port 5000 to match registration
        response = requests.post('http://encode:5000/encode', 
            json={'hashed_password': test_hash.decode('utf-8')})
            
        if response.status_code == 200:
            login_encoded_hash = response.json()['encoded_hash']
            
            print("Comparing:")
            print("Stored:", stored_encoded_hash)
            print("Login:", login_encoded_hash)
            
            # Compare username and encoded hash
            if username == stored_username and login_encoded_hash == stored_encoded_hash:
                return jsonify({"success": True, "username": username})
            else:
                return jsonify({"message": "Invalid credentials"}), 401
        else:
            return jsonify({"message": "Encoding failed"}), 500
            
    except FileNotFoundError:
        return jsonify({"message": "No registered users"}), 401
    except Exception as e:
        print("Error:", str(e))  # Debug print
        return jsonify({"message": "Server error", "error": str(e)}), 500
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Run the server