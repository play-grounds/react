import React from 'react'
import ReactDOM from 'react-dom'
import NavbarSolid from './components/bulma/Navbar.jsx'
import AddressBar from './components/AddressBar.jsx'

const defaultUri = 'https://i.redd.it/gwctsj9lbs731.jpg'
var subjectUpdate = {}

// init
var subject = getQueryStringParam('uri') || defaultUri

function setSubject(s) {
  subject = s
}

class Bookmark extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount(){
  }

  render() {
    let recalls = this.props.subject
    return (
      <div><img src={recalls} /></div>
    )
  }
}

function Main(props) {
    return (
    <section className="section">
      <AddressBar subject={subject}>
      <Bookmark />
      </AddressBar>
    </section>
  );
}

function App() {
  return (
    <div>

      <NavbarSolid 
        className="is-link" 
        title="Bookmark" 
        sourceCode="https://github.com/play-grounds/react/blob/gh-pages/play/bookmark.html">
      </NavbarSolid>      
      
      <Main>
      </Main>

    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

