import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useVerifyEmailMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const EmailVerificationScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('pending');
  
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const verificationAttempted = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (verificationAttempted.current) {
        console.log('Verification already attempted, skipping...');
        return;
      }
    
      verificationAttempted.current = true;
      console.log('Starting email verification for token:', token);
    
      try {
        const response = await verifyEmail(token).unwrap();
        console.log('Verification successful:', response);
        setVerificationStatus('success');
        setTimeout(() => navigate('/login'), 3000);
      } catch (err) {
        console.error('Verification failed:', err);
        setVerificationStatus('error');
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token, verifyEmail, navigate]);

  if (isLoading) {
    return (
      <FormContainer>
        <Loader />
        <p className="text-center">Verifying your email...</p>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      {verificationStatus === 'success' && (
        <Alert variant="success">
          <Alert.Heading>Email Verified Successfully!</Alert.Heading>
          <p>Your email has been verified. You will be redirected to the login page shortly.</p>
          <Button variant="success" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </Alert>
      )}
      
      {verificationStatus === 'error' && (
        <Alert variant="danger">
          <Alert.Heading>Email Verification Failed</Alert.Heading>
          <p>The verification link is invalid or has expired. Please try registering again or contact support.</p>
          <Button variant="primary" onClick={() => navigate('/register')}>
            Register Again
          </Button>
        </Alert>
      )}
    </FormContainer>
  );
};

export default EmailVerificationScreen;