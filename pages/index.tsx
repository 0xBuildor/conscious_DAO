import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <>
      <Head>
        <title>🐢 Conscious Turtles</title>
        <meta name="description" content="Mint Page Conscious Turtles" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     <Navbar />
     <Hero />
    </>
  )
}
