import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import user from '../images/user.svg';

function WelcomeNav() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home" style={{ fontWeight: 'bold', fontStyle: 'italic',fontSize:'30px' }}>
          CHAT-APP
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" style={{ fontWeight: 'bold',fontStyle:'italic' ,fontSize:'20px',marginLeft:'10px'}}>Home</Nav.Link>
          </Nav>
          {/* Group Contact and Profile together */}
          <Nav className="ms-auto d-flex align-items-center">
          <Nav.Link href="#home" className="me-5" style={{ fontWeight: 'bold',fontStyle:'italic' ,fontSize:'20px'}}>About</Nav.Link>
          <Nav.Link href="#home" className="me-5" style={{ fontWeight: 'bold',fontStyle:'italic' ,fontSize:'20px'}}>Services</Nav.Link>
            <Nav.Link href="#contact" className="me-3" style={{ fontWeight: 'bold',fontStyle:'italic' ,fontSize:'20px'}}>Contact</Nav.Link>
            <Nav.Link href="#profile" style={{fontWeight: 'bold',fontStyle:'italic',fontSize:'20px' }}>
              <img src={user} alt="Profile" style={{ width: '50px', height: '30px'}} />
             Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default WelcomeNav;
