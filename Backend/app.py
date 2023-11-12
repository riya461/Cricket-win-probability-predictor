from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)
model = joblib.load('cricketpred.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    df = pd.DataFrame(data, index=[0])
    prediction = model.predict_proba(df)
    return jsonify({'bat': prediction[0][1], 'bowl': prediction[0][0]})

if __name__ == '__main__':
    app.run(debug=True)
