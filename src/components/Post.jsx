//REMOVE import React from 'react'
//REMOVE import Media from './Media.jsx'

var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)


function PostItem(props) {
  const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
  const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v|mkv)($|\?)/i
  const IMAGE_EXTENSIONS = /\.(png|gif|bmp|svg|jpeg|jpg)($|\?)/i
  const URL = /http/i


  if (props.content.match(IMAGE_EXTENSIONS)) {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>{props.id + 1}.&nbsp;</td>
              <td><a target="_blank" href={props.content}>{props.content}</a> <a target="_blank" href={props.subject}><img height="10" width="10" src="./image/External.svg" /></a></td>
            </tr>
            <tr>
            <td></td>
              <td><sup>{moment.utc(props.created).fromNow()} by <a href={props.maker} target="_blank" style={{ color : 'inherit' }}>{props.maker}</a></sup></td>
            </tr>
            <tr>
            <td></td>
              <td><img src={props.content} /></td>

            </tr>

          </tbody>
        </table>

        </div>)
  } else if (props.content.match(VIDEO_EXTENSIONS)) {
    return (
      <div>{props.id + 1}. <video controls autoplay='true' loop src={props.content} /></div>)
  } else if (props.content.match(AUDIO_EXTENSIONS)) {
    return (
      <div>{props.id + 1}. <video controls autoplay='true' loop src={props.content} /></div>)
    } else if (props.content.match(URL)) {
      return (
        <div>
          <table>
            <tbody>
              <tr>
                <td>{props.id + 1}.&nbsp;</td>
                <td><a target="_blank" href={props.content}>{props.content}</a> <a target="_blank" href={props.subject}><img height="10" width="10" src="./image/External.svg" /></a></td>
              </tr>
              <tr>
                <td></td>
                <td><sup>{moment.utc(props.created).fromNow()} by <a href={props.maker} target="_blank" style={{ color : 'inherit' }}>{props.maker}</a></sup></td>
              </tr>
  
            </tbody>
          </table>
  
        </div>
      )
      } else {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>{props.id + 1}.&nbsp;</td>
              <td>{props.content} <a target="_blank" href={props.subject}><img height="10" width="10" src="./image/External.svg" /></a></td>
            </tr>
            <tr>
              <td></td>
              <td><sup>{moment.utc(props.created).fromNow()} by <a href={props.maker} target="_blank" style={{ color : 'inherit' }}>{props.maker}</a></sup></td>
            </tr>

          </tbody>
        </table>

      </div>
    )
  }
}

function getTypeFromSubject(subject) {
  console.log('getTypeFromSubject', 'subject');
  
  let s = UI.store.sym(subject)
  let p = UI.store.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')
  let o = null
  let w = UI.store.sym(subject.split('#')[0])
  let type = UI.store.any(s, p)
  if (type) {
    return type.value
  } else {
    return null
  }
}

function getPostFromSubject(subject) {
  console.log('###getPostFromSubject', subject);
  
  let s = UI.store.sym(subject)
  let p = UI.store.sym('http://rdfs.org/sioc/ns#content')
  let o = null
  let w = UI.store.sym(subject.split('#')[0])
  let content = UI.store.any(s, p, o, w)
  s = UI.store.sym(subject)
  p = UI.store.sym('http://purl.org/dc/terms/creator')
  o = null
  w = UI.store.sym(subject.split('#')[0])
  let maker = UI.store.any(s, p, o, w)
  s = UI.store.sym(subject)
  p = UI.store.sym('http://purl.org/dc/terms/created')
  o = null
  w = UI.store.sym(subject.split('#')[0])
  let created = UI.store.any(s, p, o, w)

  let post = { 'content': content.value, 'maker' : maker.value, 'created' : created.value, 'subject' : subject }
  return post
}

class Post extends React.Component {
  constructor(props) {
    super(props)
    let media = this.isMedia(props.subject)
    this.state = { 'media': media, 'subject': props.subject, post: [{ 'content': '' }] }
  }

  fetchPost(subject, force) {
    force = !! force
    console.log('fetch post', subject, 'force', force)
    // hack to force fetcher
    //UI.store = $rdf.graph()
    //UI.fetcher = new $rdf.Fetcher(UI.store)    
    UI.fetcher.load(subject, {force : true} ).then(response => {
      var type = getTypeFromSubject(subject)
      var bm = []
      console.log('type', type);

      if (!type || type == 'http://www.w3.org/ns/iana/media-types/text/turtle#Resource') {
        let s = UI.store.sym(subject)
        let p = UI.store.sym('http://purl.org/dc/terms/references')
        let subjects = UI.store.statementsMatching(s, p)
        console.log('###subjects', subjects)
        for (let subject of subjects) {
          bm.push(getPostFromSubject(subject.object.value))
        }

        bm = bm.sort( function(a,b) { 
          return (b.created < a.created) ? -1 : ((b.created > a.created) ? 1 : 0);
        } )

        this.setState({ 'post': bm })

      } else {
        bm.push(getPostFromSubject(subject))

        this.setState({ 'post': bm })
      }
    }, err => {
      console.log(err)
    })
  }

  getUpdatesVia (doc) {
    var linkHeaders = UI.store.fetcher.getHeader(doc, 'updates-via')
    console.log('linkHeaders', linkHeaders, 'doc', doc)
    if (!linkHeaders || !linkHeaders.length) return null
    return linkHeaders[0].trim()
  }

  setRefreshHandler(subject, handler) {
    var self = this
    var wss = this.getUpdatesVia(subject)
    let w = new WebSocket(wss)
    w.onmessage = function (m) {
      let data = m.data      
      if (data.match(/pub .*/)) {
        // hack for now
        self.refresh()
      }
    }
    w.onopen = function () {
      w.send('sub ' + subject)
    }  
  }

  refresh() {
    this.fetchPost(this.state.subject, true)
  }

  componentDidMount() {
    let subject = this.state.subject
    if (this.isMedia(subject) === false) {
      this.fetchPost(subject)
    }
    if (subject) {
      console.log('init subject', subject)
      setTimeout(() => {
        this.setRefreshHandler (subject, this.refresh)         
      }, 1000);
    }
  }

  componentWillReceiveProps(props) {
    let subject = props.subject
    if (this.isMedia(subject) === false) {
      this.fetchPost(subject)
    }
  }

  isMedia(subject) {
    // TODO better test for linked data
    let isMedia = false
    if (subject.match(/.ttl/) || subject.match('#this') ) {
      isMedia = false
    } else {
      isMedia = true
    }
    return isMedia
  }

  render() {
    let med = this.isMedia(this.props.subject)
    console.log('subject', this.props.subject, med);

    if (med === true) {
      return (
        <Media href={this.props.subject} />
      )
    } else {
      console.log('posts', this.state.post)
      const listItems = this.state.post.map((b, i) =>
        <div>
          <PostItem key={i} id={i} content={b.content} maker={b.maker} created={b.created} subject={b.subject}/>
        </div>
      )

      return (
        <div>{listItems}</div>
      )
    }
  }
}
//REMOVE export default Post
