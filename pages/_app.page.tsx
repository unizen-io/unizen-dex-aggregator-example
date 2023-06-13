import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';

import '../styles/global.css';
const MyApp = ({
  Component,
  pageProps
}: AppProps): JSX.Element => {
  return (
    <>
      <Script
        async />
      <style
        jsx
        global>
      </style>
      <Head>
        <title>Unizen DEX Aggregator Example Project</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
