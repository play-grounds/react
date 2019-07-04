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