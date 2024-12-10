from flask import Flask, request, jsonify
from flask_cors import CORS
import tink
from tink import daead
from tink import cleartext_keyset_handle

app = Flask(__name__)
CORS(app) 
# Initialize Tink with DAEAD
daead.register()

# AES-SIV key
keyset_json = """{
  "primaryKeyId": 3225071859,
  "key": [{
      "keyData": {
          "typeUrl": "type.googleapis.com/google.crypto.tink.AesSivKey",
          "value": "EkA2XrDtbNBxXTEjKyeJa5xNig+ppYaofenKVQXKns4ePi+LoCG1h8f1tUnusngGeqYQlecTwaUeZgYJ4dJ290BJ",
          "keyMaterialType": "SYMMETRIC"
      },
      "status": "ENABLED",
      "keyId": 3225071859,
      "outputPrefixType": "TINK"
  }]
}"""

# Create the keyset handle using JsonKeysetReader
keyset_handle = cleartext_keyset_handle.read(tink.JsonKeysetReader(keyset_json))
# Use DeterministicAead instead of Aead for AES-SIV
daead_primitive = keyset_handle.primitive(daead.DeterministicAead)

@app.route('/')
def index():
    return "Hello, World this is the ENCODE SERVER change!"


@app.route('/encode', methods=['POST'])
def encode():
    try:
        data = request.get_json()
        hashed_password = data['hashed_password'].encode('utf-8')

        # Encode the hash with AES-SIV using DeterministicAead
        encoded_hash = daead_primitive.encrypt_deterministically(hashed_password, b'')

        return jsonify({"encoded_hash": encoded_hash.hex()})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)  # Run the server
