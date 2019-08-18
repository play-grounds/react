var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      message: '',
      request:
        new URLSearchParams(document.location.search).get('request') || 'abcd',
      uri:
        new URLSearchParams(document.location.search).get('uri') ||
        'https://localhost:8080/v1/getinfo'
    }
    this.changeRequest = this.changeRequest.bind(this)
    this.changeUri = this.changeUri.bind(this)
    this.send = this.send.bind(this)

    solid.auth.trackSession(session => {
      if (!session) {
        this.setState({ message: 'The user is not logged in' })
      } else {
        if (session.webId) {
          this.setState({ message: `The user is ${session.webId}` })
          this.getProfile(session.webId)
        }
      }
    })
  }

  getProfile (profile) {
    console.log('fetching', profile)
    UI.fetcher.load(profile, { force: true }).then(response => {
      let s = UI.store.sym(profile)
      let p = UI.store.sym('http://www.w3.org/ns/solid/terms#publicTypeIndex')
      let o = null
      let w = UI.store.sym(profile.split('#')[0])
      let uri = UI.store.any(s, p, o, w)
      // this.setState({'uri' : uri.value})
    })
  }

  send () {
    console.log('sending', this.state)
    solid.auth.fetch(this.state.uri, {
      body: 'request=' + this.state.request,
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      method: 'POST'
    })
  }

  changeRequest (event) {
    this.setState({ request: event.target.value })
  }

  changeUri (event) {
    this.setState({ uri: event.target.value })
  }

  async popupLogin (event) {
    login('https://solid.community/common/popup.html')
  }

  render () {
    let href = window.location.href.split('?')[0]
    href += '?uri=' + encodeURIComponent(this.state.uri)
    // href += '&#request=' + encodeURIComponent(this.state.request)
    history.pushState({}, 'App', href)

    return (
      <div>
        <NavbarSolidLogin
          className='is-link'
          title='Lightning Network'
          sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/lightning.html'
        />
        <section className='section'>
          <h2>Lightning Network</h2>
          <hr />
          {this.state.message}
          <hr />
          Server URI : <br />
          <input
            style={{ width: '95%' }}
            onChange={this.changeUri}
            value={this.state.uri}
          />
          <a href={this.state.uri} target='_blank'>
            {' '}
            <img height='10' width='10' src='./image/External.svg' />
          </a>{' '}
          <hr />
          Payment Request or Destination URI :
          <br />
          <br />
          <textarea
            style={{ width: '95%' }}
            value={this.state.request}
            onChange={this.changeRequest}
          />
          <hr />
          Command : <br />
          fetch("{this.state.uri}",{' '}
          {"{ mode : 'no-cors', headers : { 'Content-Type', 'application/x-www-form-urlencoded' }, body : 'request=" +
            this.state.request +
            "', 'method' : 'POST' } "}{' '}
          )
          <hr />
          Curl : <br />
          curl{' '}
          {"-X POST  -H  'Content-Type : application/x-www-form-urlencoded' --data 'request=" +
            this.state.request +
            "'  "}{' '}
          '{this.state.uri}'
          <hr />
          <div className='buttons'>
            <button
              className='button is-success'
              onClick={this.send}
              target='_blank'
            >
              Pay!
            </button>
          </div>
          <hr />
        </section>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
