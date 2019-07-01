import React, { Component } from 'react'
import Literal from './components/Literal.jsx'
import NamedNode from './components/NamedNode.jsx'
import NavbarSolid from './components/bulma/Navbar.jsx'
import Body from './components/Brain.jsx'


class App extends Component {
  render () {
    return (
      <div className='App'>
        <NavbarSolid title="Brain Wallet" className="is-link"/>
        <Body></Body>
      </div>
    )
  }
}

export default App
