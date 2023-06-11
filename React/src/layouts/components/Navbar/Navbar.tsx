import { useAuth } from "@/hooks/useAuth";
import { Nav, Navbar as BsNavbar, Button, NavDropdown } from 'react-bootstrap'
import { navItems } from '@/constants/Navbar.constant.ts';

export const Navbar = () => {
  const auth = useAuth();
  const pathName = window.location.pathname.slice(1);
  const activeNavDropdownName = navItems.find(item => {
      if (item.hrefs.length > 1) {
          const navItem = item.hrefs.find(href => href.url === pathName);
          return !!navItem;
      } else {
          return false;
      }
  })?.name ?? '';
  return (
      <BsNavbar collapseOnSelect expand="lg" variant="dark" className="tw-bg-green-dark tw-text-white px-3">
          <BsNavbar.Brand href="/">
              <Button className="tw-text-xl tw-font-black" variant='success'>Shine's BDR</Button>
          </BsNavbar.Brand>
          <BsNavbar.Toggle aria-controls="responsive-navbar-nav" />
          <BsNavbar.Collapse id="responsive-navbar-nav" className="tw-justify-between tw-font-bold tw-text-base">
              <Nav className="me-auto" defaultActiveKey={pathName}>
                  {navItems.map(item => {
                      if (item.hrefs.length > 1) {
                          return (
                              <NavDropdown key={item.name} title={item.name} id={`${item.name}-nav-dropdown`} active={activeNavDropdownName === item.name}>
                                  {item.hrefs.map(href => (<NavDropdown.Item key={href.url} href={`/${href.url}`} className={`${pathName === href.url ? 'active' : ''}`}>{href.name}</NavDropdown.Item>))}
                              </NavDropdown>
                          );
                      } else {
                          return (
                              <Nav.Link key={item.hrefs[0].url} href={`/${item.hrefs[0].url}`} className={`${pathName === item.hrefs[0].url ? 'active' : ''}`}>{item.hrefs[0].name}</Nav.Link>
                          );
                      }
                  })}
              </Nav>
              <Nav className="tw-flex tw-items-center">
                  <span>{auth.user?.name}</span>&nbsp;|
                  <Nav.Link eventKey={2} href="#" onClick={() => auth.logout()}>
                      Logout
                  </Nav.Link>
              </Nav>
          </BsNavbar.Collapse>
      </BsNavbar>
  )
}
