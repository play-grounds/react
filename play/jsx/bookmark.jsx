const defaultUri = 'https://i.redd.it/gwctsj9lbs731.jpg'
var subjectUpdate = {}

// init
var subject = getQueryStringParam('uri') || defaultUri

function setSubject(s) {
  subject = s
  subjectUpdate.callback(s)
}

class Bookmark extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recalls : subject
    }
  }

  componentDidMount(){
    if (subjectUpdate) {
      subjectUpdate.callback = (data) => {
        this.setState({recalls : data})
      }
    }
  }

  render() {
    var target = subject
    console.log('target', target)
    return (
      <div><img src={this.state.recalls} /></div>
    )
  }
}

function Main(props) {
    return (
    <section className="section">
      <AddressBar subject={subject} updater={setSubject}>
      <Bookmark />
      </AddressBar>
    </section>
  );
}

function App() {
  return (
    <div>

      <NavbarSolid className="is-link" title="Bookmark" sourceCode="https://github.com/play-grounds/react/blob/gh-pages/play/bookmark.html"></NavbarSolid>      
      
      <Main>
      </Main>

    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

