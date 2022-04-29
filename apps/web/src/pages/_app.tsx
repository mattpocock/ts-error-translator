import Head from 'next/head';
import '../global.css';
import '../twoslash-styles.css';

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
