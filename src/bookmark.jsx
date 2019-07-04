import React from 'react'
import ReactDOM from 'react-dom'
import NavbarSolid from './components/bulma/Navbar.jsx'
import AddressBar from './components/AddressBar.jsx'
import Media from './components/Media.jsx'
import Bookmark from './components/Bookmark.jsx'

// init
const defaultUri = 'https://i.redd.it/gwctsj9lbs731.jpg'
var subject = getQueryStringParam('uri') || defaultUri

function Main (props) {
  return (
    <section className='section'>
      <AddressBar subject={subject}>
        <Bookmark />
      </AddressBar>
    </section>
  )
}

function App () {
  return (
    <div>

      <NavbarSolid
        className='is-link'
        title='Bookmark'
        sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/bookmark.html' />

      <Main />

    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
