from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)
model = joblib.load('cricketpred.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    df = pd.DataFrame({
    'Venue': data['Venue'],
    'BattingTeam': data['BattingTeam'],
    'BowlingTeam': data['BowlingTeam'],
    'target': data['target'],
    'runs_req': data['runs_req'],
    'balls_left': data,
    'wickets_left': data['wickets_left'],
    'crr': data['crr'],
    'rrr': data['rrr']
})
    prediction = model.predict_proba(df)
    return jsonify({'bat': prediction[0][0], 'bowl': prediction[0][1]})

if __name__ == '__main__':
    app.run(debug=True)
