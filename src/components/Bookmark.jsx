//REMOVE import React from 'react'
//REMOVE import Media from './Media.jsx'

var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

class Bookmark extends React.Component {
  constructor (props) {
    super(props)
    let media = this.isMedia()
    this.state = { 'media' : media, 'subject' : props.subject }
  }

  componentDidMount() {
    if (this.state.media === false) {
      console.log('fetch bookmark')
      UI.fetcher.load(subject).then(response => {
        let s = UI.store.sym(this.props.subject)
        let p = UI.store.sym('http://www.w3.org/2002/01/bookmark#recalls')
        let o = null
        let w = UI.store.sym(subject.split('#')[0])
        let recalls = UI.store.any(s, p, o, w)
        this.setState('subject' : recalls)
      })
    }
  }
  
  isMedia() {
    // TODO better test for linked data
    if (this.props.subject.match(/#/)) {
      return false
    } else {
      return true
    }
  }

  render () {
    if (this.state.media) {
      return (
        <Media href={this.state.subject} />
      )  
    } else {
      return (
        <Media href={this.state.subject} />
      )        
    }
  }
}

//REMOVE export default Bookmark
