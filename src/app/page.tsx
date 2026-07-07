import Head from 'next/head';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Company Website</title>
        <meta name="description" content="Welcome to my app" />
      </Head>
      <h1>Welcome to Next.js!</h1>
    </Layout>
  );
}
