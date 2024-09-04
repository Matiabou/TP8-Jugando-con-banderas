// pages/index.js
import Head from 'next/head';
import Game from '../components/Game';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Guess the Country Flag</title>
        <meta name="description" content="Guess the country based on its flag!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Game />
      </main>

      <footer>
        <p>Powered by Next.js</p>
      </footer>
    </div>
  );
}
