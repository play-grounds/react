// main
const store = $rdf.graph()
const fetcher = new $rdf.Fetcher(store)
const updater = new $rdf.UpdateManager(store)
var subject = 'https://melvincarvalho.com/#me'


function getQueryStringParam(param) {
  var url = window.location.toString();
  url.match(/\?(.+)$/);
  var params = RegExp.$1;
  params = params.split("&");
  var queryStringList = {};
  for (var i = 0; i < params.length; i++) {
    var tmp = params[i].split("=");
    queryStringList[tmp[0]] = unescape(tmp[1]);
  }
  return queryStringList[param];
}


function NamedNodeSet(props) {
  var nodes = props.nodes;
  if (nodes) {
    var nodeSet = nodes.map((node) => {
      return <NamedNode node={node.object}></NamedNode>
    })
    return (
      <ul>{nodeSet}</ul>
    );
  } else {
    return <div>Empty</div>
  }
}

class FriendSet extends React.Component {
  constructor(props) {
    super(props)

    var defaultUri = "https://melvincarvalho.com/#me"
    var uri = getQueryStringParam("uri") || defaultUri
    this.state = { uri: uri, triples: this.triples }
    this.handleChange = this.handleChange.bind(this)

  }

  componentDidMount() {

    fetcher.load(this.state.uri).then(response => {
      this.triples = store.statementsMatching(store.sym(this.state.uri), store.sym("http://xmlns.com/foaf/0.1/knows"), null, store.sym(this.state.uri.split('#')[0]))
      for (var i = 0; i < this.triples.length; i++) {
        var triple = this.triples[i]
        console.log('object', triple.object);
      }
      this.setState({ triples: this.triples })
    }, err => {
      console.log(err);
    });
  }

  handleChange(e) {
    this.setState({ uri: e.target.value })
    console.log("this.state.uri", this.state.uri)
    fetcher.load(this.state.uri).then(response => {
      this.triples = store.statementsMatching(store.sym(this.state.uri), null, null, store.sym(this.state.uri.split('#')[0]))
      for (var i = 0; i < this.triples.length; i++) {
        var triple = this.triples[i]
        console.log('object', triple.object.value);
      }
      this.setState({ triples: this.triples })
    }, err => {
      console.log(err);
    });

  }


  render() {
    return <NamedNodeSet nodes={this.state.triples} />
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




