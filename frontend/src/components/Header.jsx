import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaMoon, FaSun, FaSearch } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';
import { resetCart } from '../slices/cartSlice';

const Header = ({ toggleTheme, theme }) => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            dispatch(resetCart());
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header>
            <Navbar expand='lg' collapseOnSelect className='navbar py-3 sticky-nav' fixed="top">
                <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Navbar.Brand as={Link} to='/' style={{ display: 'flex', alignItems: 'center', flex: '1' }}>
                        <img src={logo} alt='Madina Marble Metalic Sign' style={{ marginRight: '8px' }} />
                        <span>Madina Marble Metalic Sign</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' style={{ border: 'none', marginLeft: 'auto' }} />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto align-items-center'>
                            <SearchBox />
                            
                            <Nav.Link as={Link} to='/cart' className="d-flex align-items-center">
                                <FaShoppingCart className="me-1" /> 
                                <span>Cart</span>
                                {cartItems.length > 0 && (
                                    <Badge pill bg='success' className="ms-1">
                                        {cartItems.reduce((a, c) => a + c.qty, 0)}
                                    </Badge>
                                )}
                            </Nav.Link>
                            
                            {userInfo ? (
                                <NavDropdown 
                                    title={<><FaUser className="me-1" /> {userInfo.name}</>} 
                                    id='username'
                                    align="end"
                                >
                                    <NavDropdown.Item as={Link} to='/profile'>Profile</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav.Link as={Link} to='/login' className="d-flex align-items-center">
                                    <FaUser className="me-1" /> Sign In
                                </Nav.Link>
                            )}
                            
                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title='Admin' id='adminmenu' align="end">
                                    <NavDropdown.Item as={Link} to='/admin/productlist'>Products</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to='/admin/orderlist'>Orders</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to='/admin/userlist'>Users</NavDropdown.Item>
                                </NavDropdown>
                            )}
                            
                            <Nav.Link 
                                onClick={toggleTheme} 
                                className="theme-toggle d-flex align-items-center ms-2"
                            >
                                {theme === "light" ? <FaMoon className="me-1" /> : <FaSun className="me-1" />}
                                <span className="d-none d-md-inline">{theme === "light" ? "Dark" : "Light"}</span>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;