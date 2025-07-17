
import Header from '../layout/header/page'
import IntroPage from '../components/intro/page'
import WorkingPage from '../components/working/page'
import PromotionPage from '../components/promotion/page'
import ProductPage from '../components/product/page'
import FooterPage from '../layout/footer/page'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <IntroPage />
      <div className='mx-10'>
        <WorkingPage />
        <PromotionPage />
        <ProductPage />
      </div>
      <FooterPage />
    </div>
  );
}
