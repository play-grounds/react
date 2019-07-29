//REMOVE import React from 'react'
//REMOVE import Media from './Media.jsx'

var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

class Bookmark extends React.Component {
  constructor (props) {
    super(props)
    let media = this.isMedia(props.subject)
    this.state = { 'media' : media, 'subject' : props.subject, 'title' : '' }
  }

  fetchBookmark (subject) {
    console.log('fetch bookmark', subject)
    UI.fetcher.load(subject).then(response => {
      let s = UI.store.sym(subject)
      let p = UI.store.sym('http://www.w3.org/2002/01/bookmark#recalls')
      let o = null
      let w = UI.store.sym(subject.split('#')[0])
      let recalls = UI.store.any(s, p, o, w)
      s = UI.store.sym(subject)
      p = UI.store.sym('http://purl.org/dc/terms/title')
      o = null
      w = UI.store.sym(subject.split('#')[0])
      let title = UI.store.any(s, p, o, w)
      console.log(recalls);
      
      this.setState({'recalls' : recalls.value, 'title' : title.value })
    }, err => {
      console.log(err)
    })
  }  

  componentDidMount() {
    let subject = this.state.subject
    if (this.isMedia(subject) === false) {
      this.fetchBookmark(subject)
    }
  }

  componentWillReceiveProps (props) {
    let subject = props.subject
    if (this.isMedia(subject) === false) {
      this.fetchBookmark(subject)
    }   
  }
  
  isMedia(subject) {
    // TODO better test for linked data
    let isMedia = false
    if (subject.match(/#/)) {
      isMedia = false
    } else {
      isMedia = true
    }
    return isMedia
  }

  render () {
    let med = this.isMedia(this.props.subject)
    console.log('subject', this.props.subject, med);
    
    if (med === true) {
      return (
        <Media href={this.props.subject} />
      )  
    } else {
      return (
        <a target="_blank" href={this.state.recalls}>{this.state.title}</a>
      )        
    }
  }
}

//REMOVE export default Bookmark
