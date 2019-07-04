// main
const store = $rdf.graph()
const fetcher = new $rdf.Fetcher(store)
const updater = new $rdf.UpdateManager(store)
var subject = 'https://melvincarvalho.com/#me'

class FriendSet extends React.Component {
  constructor(props) {
    super(props)

    var defaultUri = "https://melvincarvalho.com/#me"
    var uri = getQueryStringParam("uri") || defaultUri
    this.state = { uri : uri }
    this.handleChange = this.handleChange.bind(this)

  }

  componentDidMount() {

    fetcher.load(this.state.uri).then(response => {
      this.quads = store.statementsMatching(store.sym(this.state.uri), store.sym("http://xmlns.com/foaf/0.1/knows"), null, store.sym(this.state.uri.split('#')[0]))
      for (var i = 0; i < this.quads.length; i++) {
        var quad = this.quads[i]
        console.log('object', quad.object);
      }
      this.setState({ quads: this.quads })
    }, err => {
      console.log(err);
    });
  }

  handleChange(e) {
    this.setState({ uri: e.target.value })
    console.log("this.state.uri", this.state.uri)
    fetcher.load(this.state.uri).then(response => {
      this.quads = store.statementsMatching(store.sym(this.state.uri), null, null, store.sym(this.state.uri.split('#')[0]))
      for (var i = 0; i < this.quads.length; i++) {
        var triple = this.quads[i]
        console.log('object', triple.object.value);
      }
      this.setState({ quads: this.quads })
    }, err => {
      console.log(err);
    });

  }


  render() {
    return <NamedNodeSet nodes={this.state.quads} />
  }
}


function Body(props) {
  return (
    <div>

      <div>
        <section className="section">
          <AddressBar subject={subject}>
          <FriendSet />
          </AddressBar> 
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




