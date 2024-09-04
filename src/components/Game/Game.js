// components/Game.js
import { useEffect, useState } from 'react';
import axios from 'axios';
/*// pages/_app.js
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
*/
const Game = () => {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [name, setName] = useState('');
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    // Fetch the countries and their flags
    axios.get('https://countriesnow.space/api/v0.1/countries/flag/images')
      .then(response => {
        setCountries(response.data.data);
        getRandomCountry(response.data.data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    // Timer logic
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Handle timer end
          handleIncorrectGuess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const getRandomCountry = (countriesList) => {
    const randomIndex = Math.floor(Math.random() * countriesList.length);
    setCurrentCountry(countriesList[randomIndex]);
    setTimer(15); // Reset timer for new country
  };

  const handleGuess = (guess) => {
    if (guess === currentCountry.name) {
      setScore(score + 10);
    } else {
      handleIncorrectGuess();
    }
    getRandomCountry(countries);
  };

  const handleIncorrectGuess = () => {
    setScore(prev => Math.max(prev - 1, 0));
    setTimer(prev => prev + Math.floor(prev / 5)); // Bonus points for unused time
  };

  const handleNameSubmit = () => {
    if (name.trim()) {
      const newHighScore = { name, score };
      const storedScores = JSON.parse(localStorage.getItem('highScores')) || [];
      storedScores.push(newHighScore);
      localStorage.setItem('highScores', JSON.stringify(storedScores));
      setHighScores(storedScores);
    }
  };

  return (
    <div>
      <h1>Guess the Country</h1>
      {currentCountry && (
        <div>
          <img src={currentCountry.flag} alt={currentCountry.name} />
          <div>
            <button onClick={() => handleGuess('Country1')}>Country1</button>
            <button onClick={() => handleGuess('Country2')}>Country2</button>
            {/* Add more buttons or options here */}
          </div>
          <p>Score: {score}</p>
          <p>Timer: {timer}s</p>
        </div>
      )}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleNameSubmit}>Submit Name</button>
      <h2>High Scores</h2>
      <ul>
        {highScores.map((item, index) => (
          <li key={index}>{item.name}: {item.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default Game;
