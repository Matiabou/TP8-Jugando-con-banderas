// components/Game.js
import { useState, useEffect, useRef } from 'react';
import Timer from './Timer';
import Help from './Help';
import Form from './Form';
import styles from '../styles/Home.module.css';

const Game = () => {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timer, setTimer] = useState(15);
  const [help, setHelp] = useState('');

  // Ref to keep track of the remaining time
  const timerRef = useRef(timer);

  // Update the timerRef when timer state changes
  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
      const data = await res.json();
      setCountries(data.data);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (countries.length) {
      pickRandomCountry();
    }
  }, [countries]);

  const pickRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    setCurrentCountry(countries[randomIndex]);
    setIsTimerActive(true);
    setTimer(15); // Reset timer for each new question
  };

  const handleAnswer = (answer) => {
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCountryName = currentCountry.name.trim().toLowerCase();

    if (normalizedAnswer === normalizedCountryName) {
      // Use the current timer value from timerRef
      setScore(prevScore => prevScore + timerRef.current); 
    } else {
      setScore(prevScore => prevScore - 5); // Deduct 5 points on incorrect answer
    }
    pickRandomCountry();
  };

  const handleHelp = () => {
    setHelp(currentCountry.name.slice(0, 1)); // Example
    setTimer(prevTimer => {
      const newTimer = Math.max(prevTimer - 2, 0); // Ensure it doesn't go below 0
      timerRef.current = newTimer; // Update the ref
      return newTimer;
    });
  };

  const handleNameSubmit = (name) => {
    setPlayerName(name.trim());
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ name: name.trim(), score });
    localStorage.setItem('scores', JSON.stringify(scores));
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    setScore(prevScore => prevScore - 5); // Deduct 5 points if time runs out
    pickRandomCountry();
  };

  return (
    <div className={styles.gameContainer}>
      <h1>Guess the Country</h1>
      {playerName ? (
        <>
          <img src={currentCountry?.flag} alt={currentCountry?.name} className={styles.flagImage} />
          <p>Score: {score}</p>
          <Timer
            isActive={isTimerActive}
            timer={timer}
            onTimeUp={handleTimeUp}
          />
          <Help onHelp={handleHelp} />
          <Form onSubmit={handleAnswer} placeholder="Type your answer" />
        </>
      ) : (
        <Form onSubmit={handleNameSubmit} placeholder="Enter your name" />
      )}
    </div>
  );
};

export default Game;
