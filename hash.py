from flask import Flask, request, jsonify
import bcrypt
import requests

app = Flask(__name__)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # Hacher le mot de passe avec bcrypt
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

    # Envoyer le hash au serveur encode pour l'encodage AES-SIV
    response = requests.post('http://encode:5001/encode', json={'hashed_password': hashed_password.decode('utf-8')})
    if response.status_code == 200:
        encoded_hash = response.json()['encoded_hash']

        # Retourner le hash encodé
        return jsonify({"username": username, "encoded_hash": encoded_hash})
    else:
        return jsonify({"message": "Erreur lors de l'encodage"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)