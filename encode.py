from flask import Flask, request, jsonify
import tink
from tink import aead
from tink import cleartext_keyset_handle

app = Flask(__name__)

# Initialiser Tink
aead.register()

# Clé AES-SIV fournie
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

keyset_handle = cleartext_keyset_handle.read(tink.JsonKeysetReader(keyset_json))
aead_primitive = keyset_handle.primitive(aead.Aead)

@app.route('/encode', methods=['POST'])
def encode():
    data = request.get_json()
    hashed_password = data['hashed_password'].encode('utf-8')

    # Encoder le hash avec AES-SIV
    encoded_hash = aead_primitive.encrypt(hashed_password, b'')

    return jsonify({"encoded_hash": encoded_hash.hex()})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)