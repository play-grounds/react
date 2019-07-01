
function NavbarAbout (props) {
  return <div className='navbar-item has-dropdown is-hoverable'>
    <Navbar.List title="About">
      <Navbar.List.Item href='index.html'>Up</Navbar.List.Item>
      <hr />
      <Navbar.List.Item href=''>Source</Navbar.List.Item>
      <hr />
      <Navbar.List.Item href=''>Help</Navbar.List.Item>
    </Navbar.List>
  </div>
}

function NavbarListItem ({href, ...props}) {
  return (
    <a href={href} className='navbar-item'>
    {props.children}
    </a>    
  )
}

function NavbarList ({title, ...props}) {
  return (
    <span>
    <a className='navbar-link'>
      {title}
    </a>

    <div className='navbar-dropdown'>
      {props.children}
    </div>
    </span>
  )
}

function Navbar ({title, ...props}) {
  function toggleNav () {
    var nav = document.querySelector('.navbar-menu')
    if (nav.className === 'navbar-menu') {
      nav.className = 'navbar-menu is-active'
    } else {
      nav.className = 'navbar-menu'
    }
  }

  return <nav className={'navbar ' + props.className} role='navigation' aria-label='main navigation'>
    <div className='navbar-brand'>

      <Navbar.List.Item href='#'>{title}</Navbar.List.Item>

      <a role='button' className='navbar-burger burger' aria-label='menu' aria-expanded='false' data-target='navbarBasicExample' onClick={toggleNav}>
        <span aria-hidden='true' />
        <span aria-hidden='true' />
        <span aria-hidden='true' />
      </a>
    </div>

    <div id='navbarBasicExample' className='navbar-menu'>
      <div className='navbar-start'>
        <Navbar.About />
      </div>

      {props.children}

      <div className='navbar-end' />
    </div>
  </nav>
}

Navbar.About = NavbarAbout
Navbar.List = NavbarList
Navbar.List.Item = NavbarListItem

