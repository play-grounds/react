// main
var UI = {}
UI.store = $rdf.graph()
UI.store.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

var subject = getQueryStringParam('uri') || 'https://melvincarvalho.com/#me'


function getWithDefault (subject, predicate, defaultValue) {
  const object = UI.store.any(subject, predicate)
  return object ? object.value : defaultValue
}


function Body (props) {
  function handleRemove() {

  }


  return (


      <div style={{ display : flex }}>
      <img src={'foar.img || person.svg'} width='50' height='50' style={{ margin : 'i' }} />
      <span style={{ flexGrow : 1, margin : 'auto 0' }} >'foaf.name | WebId' </span>
      <button style={{ margin : '5ps' }} onClick={this.handleRemove} >Remove</button>
      </div>    
  )
}

function getWithDefault (subject, predicate, defaultValue) {
  const object = kb.any(subject, predicate)
  return object ? object.value : defaultValue
}

class Person {
  constructor (element, webIdNode, handleRemove) {
    this.webIdNode = webIdNode
    this.element = element
    this.handleRemove = handleRemove
  }



  render () {
    const container = document.createElement('div')
    container.style.display = 'flex'
    // <div style={{ display : flex }}</div>

    // TODO: take a look at UI.widgets.setName
    const imgSrc = getWithDefault(this.webIdNode, ns.foaf('img'), iconBase + 'noun_15059.svg')
    const profileImg = document.createElement('img')
    profileImg.src = escape(imgSrc)
    profileImg.width = '50'
    profileImg.height = '50'
    profileImg.style.margin = '5px'
    // <img src={foar.img || person.svg} width='50' height='50' style={{ margin : 5px }} />

    // TODO: take a look at UI.widgets.setImage
    const name = getWithDefault(this.webIdNode, ns.foaf('name'), `[${this.webIdNode}]`)
    const nameSpan = document.createElement('span')
    nameSpan.innerHTML = escape(name)
    nameSpan.style.flexGrow = '1'
    nameSpan.style.margin = 'auto 0'
    // <span style={{ flexGrow : 1, margin : 'auto 0' }} >{ foaf.name | WebId }</span>

    const removeButton = document.createElement('button')
    removeButton.textContent = 'Remove'
    removeButton.addEventListener('click', event => this.handleRemove().catch(err => {
      console.error(err)
    }))
    removeButton.style.margin = '5px'
    // <button style={{ margin : 5ps }} onClick={this.handleRemove} >Remove</button>

    container.appendChild(profileImg)
    container.appendChild(nameSpan)
    container.appendChild(removeButton)
    // div style={{ display : flex }}
    //    <img src={foar.img || person.svg} width='50' height='50' style={{ margin : 5px }}
    //    <span style={{ flexGrow : 1, margin : 'auto 0' }} >{ foaf.name | WebId }</span>
    //    <button style={{ margin : 5ps }} onClick={this.handleRemove} >Remove</button>
    // </div>

    this.element.innerHTML = ''
    this.element.appendChild(container)
    return this
  }
}

class FriendSet extends React.Component {
  constructor (props) {
    super(props)

    this.state = { subject: subject }
  }

  fetchFriends (subject) {
    UI.store.fetcher.load(subject).then(response => {
      let s = UI.store.sym(subject)
      let p = UI.store.sym('http://xmlns.com/foaf/0.1/knows')
      let o = null
      let w = UI.store.sym(subject.split('#')[0])
      let quads = UI.store.statementsMatching(s, p, o, w)
      this.setState({ quads: quads })
    }, err => {
      console.log(err)
    })
  }

  componentDidMount () {
    this.fetchFriends(this.props.subject)
  }

  componentWillReceiveProps (props) {
    this.fetchFriends(props.subject)
  }

  render () {
    return (
      <div>
        <NamedNodeSet nodes={this.state.quads} subject={this.props.subject} />
      </div>
    )
  }
}

function Body (props) {
  return (
    <div>

      <div>
        <section className='section'>
          <Addressbar subject={subject}>
            <FriendSet />
          </Addressbar>
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
        title='Friends App'
        sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/friends.html/' />
      <Body />

    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
