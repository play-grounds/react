//REMOVE import React from 'react'
//REMOVE import Media from './Media.jsx'

var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)


function BookmarkItem(props) {
  const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
  const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v|mkv)($|\?)/i
  const IMAGE_EXTENSIONS = /\.(png|gif|bmp|svg|jpeg|jpg)($|\?)/i


  if (props.recalls.match(IMAGE_EXTENSIONS)) {
    return (
      <div><a target="_blank" href={props.recalls}>{props.title}</a>
      <br/>
      <img src={props.recalls} /></div>)
  } else if (props.recalls.match(VIDEO_EXTENSIONS)) {
    return (
      <div><video controls autoplay='true' loop src={props.recalls} /></div>)
  } else if (props.recalls.match(AUDIO_EXTENSIONS)) {
    return (
      <div><video controls autoplay='true' loop src={props.recalls} /></div>)
  } else {
    return (
      <a target="_blank" href={props.recalls}>{props.title}</a>
    )
  }
}

function getTypeFromSubject(subject) {
  let s = UI.store.sym(subject)
  let p = UI.store.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
  let o = null
  let w = UI.store.sym(subject.split('#')[0])
  let type = UI.store.any(s, p, o, w)
  if (type) {
    return type.value
  } else {
    return null
  }
}

class Bookmark extends React.Component {
  constructor (props) {
    super(props)
    let media = this.isMedia(props.subject)
    this.state = { 'media' : media, 'subject' : props.subject, 'title' : '', bookmark : [ { 'recalls' : '', 'title' : '' } ] }
  }

  fetchBookmark (subject) {
    console.log('fetch bookmark', subject)
    UI.fetcher.load(subject).then(response => {
      var type = getTypeFromSubject(subject)
      var bm = []
      console.log('type', type);
      
      if (!type) {
        let s = UI.store.sym(subject)
        let p = UI.store.sym('http://purl.org/dc/terms/references')
        let subjects = UI.store.statementsMatching(s, p)
        for (let subject of subjects) {
          subject = subject.object.value
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
          let bookmark = { 'recalls' : recalls.value, 'title' : title.value }
          bm.push(bookmark)
        }

        this.setState({'bookmark' : bm })  

        console.log('bm', bm); 

      } else {
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
        let bookmark = [{ 'recalls' : recalls.value, 'title' : title.value }]
        this.setState({'recalls' : recalls.value, 'title' : title.value, 'bookmark' : bookmark })  
      }
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
    if (subject.match(/.ttl/)) {
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
      const listItems = this.state.bookmark.map((b) =>
      // Wrong! The key should have been specified here:
      <div>
        <BookmarkItem recalls={b.recalls} title={b.title} />
      </div>

      );

      return (
        <div>{listItems}</div>
      )        
    }
  }
}



//REMOVE export default Bookmark
