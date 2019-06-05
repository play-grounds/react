function hamburgerHelper() {
    document.querySelector(".navbar-burger").addEventListener("click", toggleNav);

    function toggleNav() {
      var nav = document.querySelector(".navbar-menu");
      if (nav.className == "navbar-menu") {
        nav.className = "navbar-menu is-active";
      } else {
        nav.className = "navbar-menu";
      }
    }
  }

function MenuAbout (props) { return <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link">
          About
        </a>        

        <div className="navbar-dropdown">

          <a className="navbar-item">
              Source
          </a>

          <hr />

          <a target="_blank" href="">
            Help
          </a>

        </div>
      </div>
}

class Menu extends React.Component {
constructor(props) {
  super(props)
  this.title = props.title || 'Welcome'
  this.className = props.className || 'is-link'

  // init
  this.className = 'navbar ' + this.className
}

componentDidMount() {
  hamburgerHelper()
}


  render() {
    return <nav className={this.className} role="navigation" aria-label="main navigation">
  <div className="navbar-brand">

    <a id="add" className="navbar-item" href="#">
      {this.title}
    </a>

    <a role="button" className="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" className="navbar-menu">
    <div className="navbar-start">
      <MenuAbout/>
    </div>

    <div className="navbar-end">
    </div>
  </div>
</nav>

  }
}