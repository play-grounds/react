import React, { Component } from 'react'
import NavbarSolid from './components/bulma/Navbar.jsx'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <NavbarSolid className="is-link" title="Tmp" sourceCode="https://github.com/play-grounds/react/blob/gh-pages/play/tmp.html"></NavbarSolid> 
      </div>
    )
  }
}


export default App
