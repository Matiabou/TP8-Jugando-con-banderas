import styles from '../styles/Home.module.css';

const Help = ({ onHelp }) => {
  return (
    <div>
      <button className={styles.button} onClick={onHelp}>Get Help</button>
    </div>
  );
};

export default Help;
