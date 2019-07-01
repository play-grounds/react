
function NavbarAbout (props) {
  return <div className='navbar-item has-dropdown is-hoverable'>
    <Navbar.List title="About">
      <Navbar.Item href='index.html'>Up</Navbar.Item>
      <hr />
      <Navbar.Item href=''>Source</Navbar.Item>
      <hr />
      <Navbar.Item href=''>Help</Navbar.Item>
    </Navbar.List>
  </div>
}

function NavbarItem ({href, ...props}) {
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

class NavbarBurger extends React.Component {
  constructor(props) {
    super(props)
  }

  toggleNav () {
    var nav = document.querySelector('.navbar-menu')
    if (nav.className === 'navbar-menu') {
      nav.className = 'navbar-menu is-active'
    } else {
      nav.className = 'navbar-menu'
    }
  }


  render() {
    return (
      <React.Fragment>
      <a role='button' className='navbar-burger burger' aria-label='menu' aria-expanded='false' data-target='navbarBasicExample' onClick={this.toggleNav}>
        <span aria-hidden='true' />
        <span aria-hidden='true' />
        <span aria-hidden='true' />
      </a>        
      </React.Fragment>
    )
  }
}

function Navbar ({title, ...props}) {

  return <nav className={'navbar ' + props.className} role='navigation' aria-label='main navigation'>
    <div className='navbar-brand'>

      <Navbar.Item href='#'>{title}</Navbar.Item>
      <Navbar.Burger/>

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
Navbar.Item = NavbarItem
Navbar.Burger = NavbarBurger


