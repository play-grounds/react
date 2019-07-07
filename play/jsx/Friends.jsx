// main
var UI = {}
UI.store = $rdf.graph()
UI.store.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

var subject = new URLSearchParams(document.location.search).get('uri') 
|| 'https://melvincarvalho.com/#me'


function getWithDefault (subject, predicate, defaultValue) {
  
  const object = UI.store.any(subject, predicate)
  console.log('object', object);
  return object ? object.value : defaultValue
}

function fetchPerson (subject) {
  UI.store.fetcher.load(subject).then(response => {
  }, err => {
    console.log(err)
  })
}

function Person (props) {
  function handleRemove() {

  }

  var avatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGc+PGc+PGc+PGc+PHBhdGggZD0iTTQ3LjY4Niw1MC44MDloMC4zOTFjLTAuMTA4LTAuMDktMC4yMTMtMC4xNzMtMC4zMDctMC4yNzJjLTMuMDk5LTIuNzk5LTUuNDYzLTguMjM5LTUuNDYzLTEyLjYzNyAgICAgIGMwLTYuMjIyLDUuMDk0LTEwLjMxNSw5LjkxMS0xMC4zMTVjNC44MTMsMCw5LjY1MSw0LjQyOCw5LjY1MSwxMC42NDdjMCw0LjM5Ni0yLjYxNSw5LjY3MS01Ljg1MSwxMi4zNzQgICAgICBjMC42NjUsMi41MzYsNC4zMDYsMy4zNjYsMTEuODE1LDUuNDI1YzguMzQzLDIuMjksNi45MDcsNy45NTgsNi44ODIsMTEuNzY0SDI5LjY4NGMtMC4wMjYtMy44MDYtMi4wOTMtOS40NzQsNi4yNTEtMTEuNzY0ICAgICAgQzQzLjIzOCw1NC4wMjYsNDYuODc2LDUzLjE4NSw0Ny42ODYsNTAuODA5eiI+PC9wYXRoPjxwYXRoIGQ9Ik00OC4wNzcsNTAuODA5aC0wLjM5MWMwLjAzMi0wLjA5LDAuMDU3LTAuMTc3LDAuMDgzLTAuMjcyQzQ3Ljg2Myw1MC42MzYsNDcuOTY5LDUwLjcxOSw0OC4wNzcsNTAuODA5eiI+PC9wYXRoPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4=' 

  var name = props.name || props.value
  var img = props.image || avatar

  name = getWithDefault (UI.store.sym(props.subject), UI.store.sym('http://xmlns.com/foaf/0.1/name'), props.subject)

  img = getWithDefault (UI.store.sym(props.subject), UI.store.sym('http://xmlns.com/foaf/0.1/img'), avatar)


  UI.store.fetcher.load(UI.store.sym(props.subject)).then(response => {
    name = getWithDefault (UI.store.sym(props.subject), UI.store.sym('http://xmlns.com/foaf/0.1/knows'), props.subject)    
    img = getWithDefault (UI.store.sym(props.subject), UI.store.sym('http://xmlns.com/foaf/0.1/img'), avatar)    
  }, err => {
    console.log(err)
  })


  return (

      <div style={{ display : 'flex' }}>
      <img src={img} width='50' height='50' style={{ margin : 'i' }} />
      <a href={props.subject} target="_blank" style={{ flexGrow : 1, margin : 'auto 0' }} >{name}</a>
      <button style={{ margin : '5px' }} onClick={handleRemove} >Remove</button>
      </div>    
  )
}

class PersonClass {
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

class Group extends React.Component {
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

    if (this.state.quads) {
      var listItems = this.state.quads.map( (quad) => {

        
        return <Person subject={quad.object.value} name={quad.object.value} />

        
      } )  
      console.log('listItems', listItems);
    }

    return (
      <div>
        <ul>{listItems}</ul>
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
            <Group />
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
