const defaultUri = 'https://i.redd.it/gwctsj9lbs731.jpg'

// init
var subject = getQueryStringParam('uri') || defaultUri

class Bookmark extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    let recalls = this.props.subject
    let contentType = 'image'
    if (recalls.match(/.jpg$/)) {
      return (
        <div><img src={recalls} /></div>)
    } else if (recalls.match(/.webm$/)) {
      return (
        <div><video autoplay='true' loop src={recalls} /></div>)
    } else if (recalls.match(/.mp3$/)) {
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
