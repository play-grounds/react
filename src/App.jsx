import React, { Component } from 'react'
import Literal from './components/Literal.jsx'
import NamedNode from './components/NamedNode.jsx'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <h1> Hello, World! </h1>
        <NamedNode value='https://www.scrolller.com/media/20f58d.jpg' />
      </div>
    )
  }
}

export default App
