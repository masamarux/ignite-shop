import Image from 'next/image';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useKeenSlider } from 'keen-slider/react'
import { getPlaiceholder } from "plaiceholder";

import { stripe } from '../lib/stripe';
import { HomeContainer, Product } from '../styles/pages/home';

import 'keen-slider/keen-slider.min.css'
import Stripe from 'stripe';

interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    blurDataUrl: string
    price: string
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 2.7,
      spacing: 48
    }
    
  })
  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {
        products.map(product => (
          <Link key={product.id} href={`/product/${product.id}`} passHref legacyBehavior prefetch={false}>
            <Product className='keen-slider__slide'>
              <Image placeholder='blur' blurDataURL={product.blurDataUrl} src={product.imageUrl} width={520} height={480} alt="" />

              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        ))
      }

      
    </HomeContainer>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  });

  const products = response.data.map(async(product) => {
    const price = product.default_price as Stripe.Price;
    const { base64, img } = await getPlaiceholder(product.images[0]);

    return {
      id: product.id,
      name: product.name,
      imageUrl: img,
      blurDataUrl: base64,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price.unit_amount / 100)
    }
  });

  return {
    props: {
      products: await Promise.all(products),
    },
    revalidate: 60 * 60 * 2 // 2 hours
  }
}
