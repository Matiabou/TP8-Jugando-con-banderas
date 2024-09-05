// components/Timer.js
import { useEffect, useState } from 'react';

const Timer = ({ isActive, timer, onTimeUp }) => {
  const [time, setTime] = useState(timer);

  useEffect(() => {
    if (isActive) {
      setTime(timer); // Reset time when the timer starts

      const interval = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            onTimeUp(); // Notify parent when time is up
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [isActive, timer, onTimeUp]);

  return (
    <div>
      <p>Time Left: {time}s</p>
    </div>
  );
};

export default Timer;
