import React, { useState } from "react";
import "./App.css";

function App() {
  const teams = [
    "Chennai Super Kings",
    "Delhi Capitals",
    "Gujarat Titans",
    "Kolkata Knight Riders",
    "Lucknow Super Giants",
    "Mumbai Indians",
    "Punjab Kings",
    "Rajasthan Royals",
    "Royal Challengers Bangalore",
    "Sunrisers Hyderabad",
  ];

  const cities = [
    "Arun Jaitley Stadium, Delhi",
    "Barabati Stadium, Cuttack",
    "Brabourne Stadium, Mumbai",
    "Buffalo Park, East London",
    "De Beers Diamond Oval, Kimberley",
    "Dr DY Patil Sports Academy, Mumbai",
    "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
    "Dubai International Cricket Stadium",
    "Eden Gardens, Kolkata",
    "Himachal Pradesh Cricket Association Stadium",
    "Holkar Cricket Stadium, Indore",
    "JSCA International Stadium Complex, Ranchi",
    "Kingsmead, Durban",
    "M Chinnaswamy Stadium, Bangalore",
    "MA Chidambaram Stadium, Chepauk, Chennai",
    "Maharashtra Cricket Association Stadium, Pune",
    "Narendra Modi Stadium, Ahmedabad",
    "New Wanderers Stadium, Johannesburg",
    "Newlands, Cape Town",
    "OUTsurance Oval, Bloemfontein",
    "Punjab Cricket Association IS Bindra Stadium, Mohali",
    "Punjab Cricket Association Stadium, Mohali",
    "Rajiv Gandhi International Stadium, Uppal",
    "Rajiv Gandhi International Stadium, Uppal, Hyderabad",
    "Sawai Mansingh Stadium, Jaipur",
    "Shaheed Veer Narayan Singh International Stadium, Raipur",
    "Sharjah Cricket Stadium, Sharjah",
    "Sheikh Zayed Stadium, Abu Dhabi",
    "St George's Park, Port Elizabeth",
    "SuperSport Park, Centurion",
    "Vidarbha Cricket Association Stadium, Jamtha, Nagpur",
    "Wankhede Stadium, Mumbai",
  ];

  const [battingTeam, setBattingTeam] = useState("");
  const [bowlingTeam, setBowlingTeam] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [overs, setOvers] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [prediction, setPrediction] = useState(false);
  const [battingProb, setBattingProb] = useState(0);
  const [bowlingProb, setBowlingProb] = useState(0);
  const [error, setError] = useState("");

  const predictProbability = () => {
    if (!battingTeam || !bowlingTeam || !selectedVenue) {
      setError("Please fill in all the fields");
      return;
    } else if (target > 350) {
      setError("Invalid target");
      return;
    } else if (
      overs < 0 ||
      overs > 20 ||
      overs % 1 !== 0 ||
      (overs % 1 === 0 && overs % 1 > 0.6)
    ) {
      setError("Invalid overs");
      return;
    } else if (wickets < 0 || wickets > 9) {
      setError("Invalid wickets");
      return;
    }
    else{
      setError("");
    }

    const runsreq = target - score;
    const ballsleft = 120 - (Math.floor(overs) + (overs % 1) * 10);
    const wicketsLeft = 10 - wickets;
    const crr = score / overs;
    const rrr = (runsreq * 6) / ballsleft;

    const data = {
      Venue: selectedVenue,
      batting_team: battingTeam,
      bowling_team: bowlingTeam,
      target: target,
      runsreq: runsreq,
      ballsleft: ballsleft,
      wicketsLeft: wicketsLeft,
      crr: crr,
      rrr: rrr,
    };

    fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setBattingProb(data.bat);
        setBowlingProb(data.bowl);
        setPrediction(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="App">
      <h1>IPL Win Predictor</h1>
      <div className="container-out">
        <div className="container-in">
          <label>Batting Team</label>
          <select
            value={battingTeam}
            onChange={(e) => setBattingTeam(e.target.value)}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <label>First Innings</label>
          <input
            type="number"
            onChange={(e) => setTarget(parseInt(e.target.value) + 1)}
          />
          <label>Wickets</label>
          <input type="number" />
          <label>Venue</label>
          <select
            value={selectedVenue}
            onChange={(e) => setSelectedVenue(e.target.value)}
          >
            <option value="">Select Venue</option>
            {cities.map((Venue) => (
              <option key={Venue} value={Venue}>
                {Venue}
              </option>
            ))}
          </select>
        </div>
        <div className="container-in">
          <label>Bowling Team</label>
          <select
            value={bowlingTeam}
            onChange={(e) => setBowlingTeam(e.target.value)}
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <label>Second Innings</label>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
          />
          <label>Wickets</label>
          <input
            type="number"
            value={wickets}
            onChange={(e) => setWickets(parseInt(e.target.value))}
          />
          <label>Overs completed</label>
          <input
            type="number"
            value={overs}
            onChange={(e) => setOvers(parseInt(e.target.value))}
          />
        </div>
      </div>
      <button onClick={predictProbability}>Predict Probability</button>
      {error && <h3 className="error">{error}</h3>}
      {prediction && (
        <>
          <h2>
            {battingTeam} - {Math.round(battingProb * 100)}%
          </h2>
          <h2>
            {bowlingTeam} - {Math.round(bowlingProb * 100)}%
          </h2>
        </>
      )}
    </div>
  );
}

export default App;
