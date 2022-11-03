import { AppProps } from 'next/app'
import { globalStyles } from '../styles/global'
import logoImg from '../assets/logo.svg'
import Image from 'next/image';
import { Container, Header } from '../styles/pages/app';
import { CartProvider } from '../contexts/CartContext';

globalStyles();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Container>
        <Header>
          <Image src={logoImg} alt="logo" />
        </Header>
        <Component {...pageProps} />
      </Container>
    </CartProvider>
  )
}
