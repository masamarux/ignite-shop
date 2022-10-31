import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { getPlaiceholder } from 'plaiceholder';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { ImageContainer, SuccessContainer } from '../styles/pages/sucess';

interface SuccessProps {
  customerName: string
  product: {
    name: string,
    img: {
      src: string
      width: number
      height: number
      type: string
    }
    blurDataUrl: string, 
  }
}

export default function Success({customerName, product}: SuccessProps) {
  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>

        <meta name='robots' content='noindex'/>
      </Head>

      <SuccessContainer>
      <h1>Compra Efetuada!</h1>

      <ImageContainer>
        <Image src={product.img} blurDataURL={product.blurDataUrl} placeholder="blur" alt="" width={120} height={110}  />
      </ImageContainer>

      <p>
        Uhuul <strong>{customerName}</strong>, sua <strong>{product.name}</strong> já está a caminho da sua casa. 
      </p>

      <Link href="/">
        Voltar ao catálogo
      </Link>
    </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  if(!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const customerName = session.customer_details.name
  const product = session.line_items.data[0].price.product as Stripe.Product

  const { base64, img } = await getPlaiceholder(product.images[0]);

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        img,
        blurDataUrl: base64, 
      }
    }
  }
}
