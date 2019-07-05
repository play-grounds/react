// main
const store = $rdf.graph()
const fetcher = new $rdf.Fetcher(store)
const updater = new $rdf.UpdateManager(store)
var subject = 'https://melvincarvalho.com/#me'

class FriendSet extends React.Component {
  constructor(props) {
    super(props)

    var defaultUri = "https://melvincarvalho.com/#me"
    var subject = getQueryStringParam("uri") || defaultUri
    this.state = { subject : subject }

  }

  componentDidMount() {
    console.log('mounted');

    fetcher.load(this.props.subject).then(response => {

    let s = store.sym(this.props.subject)
    let p = store.sym("http://xmlns.com/foaf/0.1/knows")
    let o = null
    let w = store.sym(this.props.subject.split('#')[0])
    let quads = store.statementsMatching(s,p,o,w)
    this.setState({ quads: quads })

  }, err => {
    console.log(err)
  })
  }

  componentWillReceiveProps(props, current_state) {
    
    console.log('received', props);
    
    fetcher.load(props.subject).then(response => {

      let s = store.sym(this.props.subject)
      let p = store.sym("http://xmlns.com/foaf/0.1/knows")
      let o = null
      let w = store.sym(this.props.subject.split('#')[0])
      let quads = store.statementsMatching(s,p,o,w)
      this.setState({ quads: quads })

      console.log('quads', quads, subject, this.props.subject);
      
    }, err => {
      console.log(err)
    })
  
  }


  render() {

    return (
      <div>
        {this.props.subject}
        <hr/>
        <NamedNodeSet nodes={this.state.quads} subject={this.props.subject} />
      </div>
    )
  }
}


function Body(props) {
  return (
    <div>

      <div>
        <section className="section">
          <Addressbar subject={subject}>
          <FriendSet />
          </Addressbar> 
        </section>

      </div>

    </div>
  );
}


function App() {
  return (
    <div>
      <NavbarSolid className="is-link" title="Friends App" sourceCode="https://github.com/play-grounds/react/blob/gh-pages/play/friends.html/" />
      <Body />

    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);




