// components/Form.js
import { useState } from 'react';
import styles from '../styles/Home.module.css';

const Form = ({ onSubmit, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) { // Ensure input is not empty
      onSubmit(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
      />
      <button className={styles.button} type="submit">Submit</button>
    </form>
  );
};

export default Form;
