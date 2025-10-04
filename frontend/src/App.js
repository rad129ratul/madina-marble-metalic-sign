import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { logout } from './slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        const expirationTime = localStorage.getItem('expirationTime');
        if (expirationTime) {
            const currentTime = new Date().getTime();
            if (currentTime > expirationTime) {
                dispatch(logout());
            }
        }
    }, [dispatch]);

    // Clear any payment-related data from localStorage on app initialization
    useEffect(() => {
        const paymentRelatedKeys = [
            'paymentMethod',
            'paymentResult',
            'paymentStatus',
            'transactionId'
        ];
        
        paymentRelatedKeys.forEach(key => {
            if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
            }
        });
    }, []);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <>
            <ToastContainer 
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme}
                toastClassName="order-request-toast"
            />
            <Header toggleTheme={toggleTheme} theme={theme} />
            <main className='py-3'>
                <Container>
                    <Outlet />
                </Container>
            </main>
            <Footer />
        </>
    );
};

export default App;