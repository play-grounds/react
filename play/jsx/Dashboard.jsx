// init
const defaultUri = 'https://melvincarvalho.com/#me'
var subject = getQueryStringParam('uri') || defaultUri

function Main (props) {
  return (
    <section className='section'>
      <AddressBar subject={subject}>
        <Dashboard />
      </AddressBar>
    </section>
  )
}

function App () {
  return (
    <div>

      <NavbarSolidLogin
        className='is-link'
        title='Dashboard'
        sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/dashboard.html' />

      <Main />

    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)