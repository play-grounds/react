// main
var UI = {}
UI.store = $rdf.graph()
UI.store.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

class ACL extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {}

  render () {
    return (
      <div>
        <ul>ACL</ul>
      </div>
    )
  }
}

function Body (props) {
  var aclpub = `@prefix   acl:  <http://www.w3.org/ns/auth/acl#>.
  @prefix  foaf:  <http://xmlns.com/foaf/0.1/>.
  
  <#authorization2>
      a               acl:Authorization;
      acl:agentClass  foaf:Agent;                               # everyone
      acl:mode        acl:Read;                                 # has Read-only access
      acl:accessTo    <https://alice.databox.me/profile/card>.  # to the public profile`
  return (
    <div>
      <div>
        <section className='section'>
          <label>Public</label>
          <pre>{aclpub}</pre>
        </section>
      </div>
    </div>
  )
}

function App () {
  return (
    <div>
      <NavbarSolidLogin
        className='is-link'
        title='ACL App'
        sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/acl.html/'
      />
      <Body />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
