//REMOVE import React from 'react'
//REMOVE import Media from './Media.jsx'

var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

const SIOC = $rdf.Namespace("http://rdfs.org/sioc/ns#")
const DCT = $rdf.Namespace('http://purl.org/dc/terms/')
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')

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
              <td><sup  style={{ color : '#ADB2BB' }}>{moment.utc(props.created).fromNow()} by <a href={props.maker} target="_blank" style={{ color : 'inherit' }}>{props.maker}</a></sup></td>
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
              <td><sup style={{ color : '#ADB2BB' }}>{moment.utc(props.created).fromNow()} by <a href={props.maker} target="_blank" style={{ color : 'inherit' }}>{props.maker}</a></sup></td>
            </tr>

          </tbody>
        </table>

      </div>
    )
  }
}

function getVal(subject, predicate) {
  let s = UI.store.sym(subject)
  let p = predicate
  let o = null
  let w = UI.store.sym(subject.split('#')[0])
  let content = UI.store.any(s, p, o, w)
  if (content) {
    return content.value
  } else {
    return undefined
  }
}

function getTypeFromSubject(subject) {
  return getVal(subject, RDF('type'))
}

function getPostFromSubject(subject) {
  
  let content = getVal(subject, SIOC('content'))
  let maker = getVal(subject, DCT('creator'))
  let created = getVal(subject, DCT('created'))

  let post = { 'content': content, 'maker' : maker, 'created' : created, 'subject' : subject }
  return post
}

class Post extends React.Component {
  constructor(props) {
    super(props)
    let media = this.isMedia(props.subject)
    this.state = { 'subject': props.subject, post: [{ 'content': '' }] }
  }

  fetchPost(subject, force) {
    force = !! force
    // hack to force fetcher
    UI.store = $rdf.graph()
    UI.fetcher = new $rdf.Fetcher(UI.store)    
    UI.fetcher.load(subject, {force : true} ).then(response => {
      var type = getTypeFromSubject(subject)
      var bm = []

      if (!type || type == 'http://www.w3.org/ns/iana/media-types/text/turtle#Resource') {
        let s = UI.store.sym(subject)
        let p = DCT('references')
        let subjects = UI.store.statementsMatching(s, p)
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

    if (med === true) {
      return (
        <Media href={this.props.subject} />
      )
    } else {
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
