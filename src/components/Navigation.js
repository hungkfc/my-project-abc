import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from 'react-bootstrap';

function Navigation() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <div>
            <Navbar bg="primary" data-bs-theme="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="/home">CRMS-CrafmanShịp</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/author">Author</Nav.Link>
                            <Nav.Link as={NavLink} to="/book">Book</Nav.Link>
                        </Nav>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Signed in as: <a href="#">{'user_name'}</a>
                            </Navbar.Text>
                            &nbsp;&nbsp;
                            <Button
                                variant="outline-light"
                                size="sm"
                                onClick={handleLogout}
                            >
                                Log out
                            </Button>
                        </Navbar.Collapse>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}
export default Navigation;