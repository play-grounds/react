//REMOVE import React from 'react'
//REMOVE import Media from './Media.jsx'

var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

class Bookmark extends React.Component {
  constructor (props) {
    super(props)
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
    let media = this.isMedia()
    if (media) {
      return (
        <Media href={this.props.subject} />
      )  
    } else {
      return (
        <Media href={this.props.subject} />
      )        
    }
  }
}

//REMOVE export default Bookmark
