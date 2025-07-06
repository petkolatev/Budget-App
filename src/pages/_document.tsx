import { Html, Head, Main, NextScript } from "next/document";
import Navbar from './navbar';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <div className='navbar'>
          <Navbar />
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
