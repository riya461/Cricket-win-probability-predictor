from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)
model = joblib.load('cricketpred.pkl')


@app.route('/predict', methods=['GET', 'POST'])
def predict():
    data = request.get_json()
    venue = data['Venue']
    bat_team = data['batting_team']
    bowl_team = data['bowling_team']
    target = int(data['target'])
    runsreq = int(data['runsreq'])
    ballsleft = int(data['ballsleft'])
    wicketsleft = int(data['wicketsLeft'])
    crr = float(data['crr'])
    rrr = float(data['rrr'])
    print(venue, bat_team, bowl_team, target,
          runsreq, ballsleft, wicketsleft, crr, rrr)
    prediction = model.predict(
        [[venue, bat_team, bowl_team, target, runsreq, ballsleft, wicketsleft, crr, rrr]])
    return jsonify({'bat': prediction[0][0], 'bowl': prediction[0][1]})


if __name__ == '__main__':
    app.run(debug=True)
