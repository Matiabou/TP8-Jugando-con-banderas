import { useState, useEffect } from 'react';
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
  const [revealedLetters, setRevealedLetters] = useState('');
  
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
      const data = await res.json();
      setCountries(data.data);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (countries.length && playerName) { // Solo se inicia cuando el jugador ingresa el nombre
      pickRandomCountry();
    }
  }, [countries, playerName]);

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleTimeUp();
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const pickRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    const selectedCountry = countries[randomIndex];
    setCurrentCountry(selectedCountry);

    // Crear los guiones pero respetando los espacios en el nombre del país
    const formattedName = selectedCountry.name.replace(/[A-Za-z]/g, '-');
    setRevealedLetters(formattedName);

    // Resetear el temporizador
    setIsTimerActive(false);
    setTimer(15);

    // Activar el temporizador una vez que todo esté listo
    setTimeout(() => {
      setIsTimerActive(true);
    }, 100);
  };

  const handleAnswer = (answer) => {
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedCountryName = currentCountry.name.trim().toLowerCase();

    if (normalizedAnswer === normalizedCountryName) {
      setScore(prevScore => prevScore + timer); // Sumar puntos en base al tiempo restante
    } else {
      setScore(prevScore => prevScore - 5); // Restar puntos por respuesta incorrecta
    }

    pickRandomCountry(); // Elegir un nuevo país y reiniciar el temporizador
  };

  const handleHelp = () => {
    const countryName = currentCountry.name;

    // Obtener los índices de los guiones que aún no han sido reemplazados (ignorar los espacios)
    const unrevealedIndices = revealedLetters
      .split('')
      .map((char, index) => (char === '-' ? index : null))
      .filter((index) => index !== null);

    // Seleccionar un índice aleatorio de los guiones restantes
    if (unrevealedIndices.length > 0) {
      const randomIndex = Math.floor(Math.random() * unrevealedIndices.length);
      const letterIndex = unrevealedIndices[randomIndex];

      // Reemplazar el guion en esa posición con la letra correspondiente
      const newRevealedLetters = revealedLetters.split('');
      newRevealedLetters[letterIndex] = countryName[letterIndex];
      setRevealedLetters(newRevealedLetters.join(''));

      // Restar 2 segundos por cada letra revelada
      setTimer(prevTimer => Math.max(prevTimer - 2, 0));
    }
  };

  const handleNameSubmit = (name) => {
    setPlayerName(name.trim());
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push({ name: name.trim(), score });
    localStorage.setItem('scores', JSON.stringify(scores));
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    setScore(prevScore => prevScore - 5); // Restar puntos si se acaba el tiempo
    pickRandomCountry(); // Elegir un nuevo país
  };

  return (
    <div className={styles.gameContainer}>
      <h1>Guess the Country</h1>
      {playerName ? (
        <>
          <img src={currentCountry?.flag} alt={currentCountry?.name} className={styles.flagImage} />
          <p>Score: {score}</p>
          <p>Country: {revealedLetters}</p> {/* Mostrar las letras reveladas */}
          <Timer timer={timer} />
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
