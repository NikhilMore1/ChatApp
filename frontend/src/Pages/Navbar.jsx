import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import user from '../images/user.svg';
function Navbars() {
    const name = localStorage.getItem('name');
    const Image = localStorage.getItem('image');
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home" style={{fontWeight: 'bold', fontStyle: 'italic'}}>CHAT-APP</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#home">About</Nav.Link>
            <Nav.Link href="#home">Services</Nav.Link>
            <Nav.Link href="#home">Contact</Nav.Link>
          </Nav>
          <Nav className="ms-auto">  {/* Align this section to the right */}
            <Nav.Link href="#profile">
                <img src={Image} alt="image" style={{width:'50px',height:'30px'}}/>
                {name||'Profile'}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbars;
