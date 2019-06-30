
function MenuAbout (props) {
  return <div className='navbar-item has-dropdown is-hoverable'>
    <a className='navbar-link'>
      About
    </a>

    <div className='navbar-dropdown'>
      <a href="index.html" className='navbar-item'>
        Up
      </a>
      <hr />
      <a className='navbar-item' target='_blank' href=''>
        Source
      </a>
      <hr />
      <a className='navbar-item' target='_blank' href=''>
        Help
      </a>
    </div>
  </div>
}

function Menu (props) {
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

      <a id='add' className='navbar-item' href='#'>
        {props.title}
      </a>

      <a role='button' className='navbar-burger burger' aria-label='menu' aria-expanded='false' data-target='navbarBasicExample' onClick={toggleNav}>
        <span aria-hidden='true' />
        <span aria-hidden='true' />
        <span aria-hidden='true' />
      </a>
    </div>

    <div id='navbarBasicExample' className='navbar-menu'>
      <div className='navbar-start'>
        <Menu.About />
      </div>

      {props.children}

      <div className='navbar-end' />
    </div>
  </nav>
}

Menu.About = MenuAbout

