import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Message from './Message';

const ShopGalleryCarousel = () => {
  const shopImages = [
    { id: 1, src: '/images/image1.jpg', alt: 'Shop View 1' },
    { id: 2, src: '/images/image2.jpg', alt: 'Shop View 2' },
    { id: 3, src: '/images/image3.jpg', alt: 'Shop View 3' },
    { id: 4, src: '/images/image4.jpg', alt: 'Shop View 4' },
    { id: 5, src: '/images/image5.jpg', alt: 'Shop View 5' },
  ];

  return (
    <Carousel pause='hover' className='bg-primary mb-4'>
      {shopImages.map((image) => (
        <Carousel.Item key={image.id}>
          <Image src={image.src} alt={image.alt} fluid />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ShopGalleryCarousel;