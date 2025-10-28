from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

PORT = os.getenv("PORT")

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return f"Server is running on Port {PORT}"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=PORT)
