import React from 'react'
import ReactDOM from 'react-dom'
import NavbarSolid from './components/bulma/Navbar.jsx'

class App extends React.Component {
  render () {
    return (
      <div className='App'>
        <NavbarSolid className="is-link" title="Tmp" sourceCode="https://github.com/play-grounds/react/blob/gh-pages/play/tmp.html"></NavbarSolid> 
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
