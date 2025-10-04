import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // WhatsApp number and message
  const whatsappNumber = "8801715760292"; // Using the first phone number from contact info
  const whatsappMessage = "Hello! I'm interested in your marble and metallic signs.";
  
  // Function to open WhatsApp chat
  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer>
      <Container>
        <Row className="py-4">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Madina Marble Metalic Sign</h5>
            <p className="mb-3">
              Providing quality marble and metallic signs.
            </p>
            <div className="d-flex">
              <a href="https://www.facebook.com/sma.khaleque.90" className="me-3 text-decoration-none" target="_blank" rel="noopener noreferrer" aria-label="Facebook Profile">
                <FaFacebook size={30} color="var(--primary)" />
              </a>
              <button 
                onClick={openWhatsApp}
                className="btn p-0 border-0 bg-transparent me-3"
                aria-label="Contact us on WhatsApp"
                style={{ color: '#25D366' }}
              >
                <FaWhatsapp size={30} />
              </button>
            </div>
          </Col>
          
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-secondary">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-decoration-none text-secondary">Cart</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5 className="mb-3">Contact Us</h5>
            <p className="mb-2">
              <a href="https://maps.app.goo.gl/mW6mKnSEfW2GhEhM8" target="_blank" rel="noopener noreferrer">
                Shop no.8, 11 Purana Paltan, Ibrahim Mansion (Ground Floor), Dhaka-1000
              </a>
            </p>
            <p className="mb-2">
              <a href="mailto:khalequesma@gmail.com" target="_blank" rel="noopener noreferrer">
                Email: khalequesma@gmail.com
              </a>
            </p>
            <p className="mb-2">
              <a href="tel:+8801715760292" target="_blank" rel="noopener noreferrer">
                Phone: +8801715760292
              </a>
            </p>
            <p>
              <a href="tel:+8801830999788" target="_blank" rel="noopener noreferrer">
                       +8801830999788
              </a>
            </p>
          </Col>
        </Row>
        
        <Row>
          <Col className="text-center py-3 border-top mt-4">
            <p className="mb-0">Madina Marble Metalic Sign &copy; {currentYear}. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;