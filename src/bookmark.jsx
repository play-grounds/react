import React from 'react'
import ReactDOM from 'react-dom'
import NavbarSolid from './components/bulma/Navbar.jsx'
import AddressBar from './components/AddressBar.jsx'

const defaultUri = 'https://i.redd.it/gwctsj9lbs731.jpg'

// init
var subject = getQueryStringParam('uri') || defaultUri

class Bookmark extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {

    const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
    const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i

    let recalls = this.props.subject

    if (recalls.match(/.jpg$/)) {
      return (
        <div><img src={recalls} /></div>)
    } else if (recalls.match(VIDEO_EXTENSIONS)) {
      return (
        <div><video autoplay='true' loop src={recalls} /></div>)
    } else if (recalls.match(/AUDIO_EXTENSIONS/)) {
      return (
        <div><video autoplay='true' loop src={recalls} /></div>)
    } else if (recalls.match(/.webm$|.mp4$/)) {
      return (
        <div><video autoplay='true' loop src={recalls} /></div>)
    } else {
      return (
        <div><img src={recalls} /></div>)
    }
  }
}

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
