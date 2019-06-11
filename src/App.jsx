import React, { Component } from 'react'
import Literal from './components/Literal.jsx'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <h1> Hello, World! </h1>
        <Literal value='liter' />
      </div>
    )
  }
}

export default App
