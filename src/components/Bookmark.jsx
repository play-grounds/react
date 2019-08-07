// REMOVE import React from 'react' 

// Structure
// Bookmark
//   Person
// WebId
//   PublicTypeIndex
//     Bookmark instance
//       Bookmark File(s)

// init
var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

const SIOC = $rdf.Namespace('http://rdfs.org/sioc/ns#')
const DCT = $rdf.Namespace('http://purl.org/dc/terms/')
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/')
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#')
const SOLID = $rdf.Namespace('http://www.w3.org/ns/solid/terms#')
const BOOK = $rdf.Namespace('http://www.w3.org/2002/01/bookmark#')

// helpers
function getVal(uri, predicate) {
  if (!uri || !predicate) return
  let s = UI.store.sym(uri)
  let p = predicate
  let o = null
  let w = UI.store.sym(uri.split('#')[0])
  let content = UI.store.any(s, p, o, w)
  if (content) {
    return content.value
  } else {
    return undefined
  }
}

function getProfileFromSubject(subject) {
  function get(p) { return getVal(subject, p) }
  return {
    type: get(RDF('type')),
    name: get(FOAF('name')),
    nick: get(FOAF('nick')),
    img: get(FOAF('img')),
    image: get(FOAF('image')),
    depiction: get(FOAF('depiction')),
    hasPhoto: get(VCARD('hasPhoto')),
    fn: get(VCARD('fn')),
    nickname: get(VCARD('nickname')),
    timeline: get(SOLID('timeline')),
    publicTypeIndex: get(SOLID('publicTypeIndex')),
    privateTypeIndex: get(SOLID('privateTypeIndex')),
    subject: subject
  }
}

function getBookmarkFromSubject(subject) {
  function g(p) { return getVal(subject, p) }
  return {
    recalls: g(BOOK('recalls')) || 'lorem',
    title: g(DCT('title')) || 'lorem',
    maker: g(FOAF('maker')),
    created: g(DCT('created')),
    subject: subject
  }
}

function getTypeFromSubject(subject) {
  function g(p) { return getVal(subject, p) }
  return g(RDF('type'))
}

/** Bookmark Item
 * 
 * @param {} props 
 */
function BookmarkItem(props) {
  const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i
  const VIDEO_EXTENSIONS = /\.(mp4|og[gv]|webm|mov|m4v|mkv)($|\?)/i
  const IMAGE_EXTENSIONS = /\.(png|gif|bmp|svg|jpeg|jpg)($|\?)/i
  const URL = /http/i

  if (props.recalls.match(IMAGE_EXTENSIONS)) {
    return (
      <div className='box'>
        <table>
          <tbody>
            <tr>
              <td>{props.id + 1}.&nbsp;</td>
              <td><a target='_blank' href={props.recalls}>{props.title}</a> <a target='_blank' href={props.subject}><img height='10' width='10' src='./image/External.svg' /></a></td>
            </tr>
            <tr>
              <td />
              <td><sup style={{ color: 'rgb(136,136,136)' }}>{moment.utc(props.created).fromNow()} by <a href={props.maker} target='_blank' style={{ color: '#369' }}>{props.maker}</a></sup></td>
            </tr>
            <tr>
              <td />
              <td><img loading="lazy" src={props.recalls} /></td>

            </tr>

          </tbody>
        </table>

      </div>)
  } else if (props.recalls.match(VIDEO_EXTENSIONS)) {
    return (
      <div>{props.id + 1}. <video controls autoplay='true' loop src={props.recalls} /></div>)
  } else if (props.recalls.match(AUDIO_EXTENSIONS)) {
    return (
      <div>{props.id + 1}. <video controls autoplay='true' loop src={props.recalls} /></div>)
  } else if (props.recalls.match(URL)) {
    return (
      <div className='box'>
        <table>
          <tbody>
            <tr>
              <td>{props.id + 1}.&nbsp;</td>
              <td><a target='_blank' href={props.recalls}>{props.title}</a> <a target='_blank' href={props.subject}><img height='10' width='10' src='./image/External.svg' /></a></td>
            </tr>
            <tr>
              <td />
              <td><sup style={{ color: 'rgb(136,136,136)' }}>{moment.utc(props.created).fromNow()} by <a href={props.maker} target='_blank' style={{ color: '#369' }}>{props.maker}</a></sup></td>            </tr>

          </tbody>
        </table>

      </div>
    )
  } else {
    return (
      <div className='box'>
        <table>
          <tbody>
            <tr>
              <td>{props.id + 1}.&nbsp;</td>
              <td><a target='_blank' href={props.recalls}>{props.title}</a> <a target='_blank' href={props.subject}><img height='10' width='10' src='./image/External.svg' /></a></td>
            </tr>
            <tr>
              <td />
              <td><sup style={{ color: 'rgb(136,136,136)' }}>{moment.utc(props.created).fromNow()} by <a href={props.maker} target='_blank' style={{ color: '#369' }}>{props.maker}</a></sup></td>
            </tr>

          </tbody>
        </table>

      </div>
    )
  }
}

/** 
 *  Bookmark or set of bookmarks
 */
class Bookmark extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'subject': props.subject,
      bookmark: [{
        'recalls': '',
        'title': ''
      }],
      person: {}
    }
  }

  fetchBookmark(subject, force) {
    force = !!force
    UI.fetcher.load(subject, { force: force }).then(response => {
      var type = getTypeFromSubject(subject)
      var bm = []

      if (!type) {
        let s = UI.store.sym(subject)
        let p = UI.store.sym('http://purl.org/dc/terms/references')
        let subjects = UI.store.statementsMatching(s, p)
        for (let subject of subjects) {
          bm.push(getBookmarkFromSubject(subject.object.value))
        }

        bm = bm.sort(function (a, b) {
          return (b.created < a.created) ? -1 : ((b.created > a.created) ? 1 : 0)
        })
      } else {
        bm.push(getBookmarkFromSubject(subject))
      }

      for (const b of bm) {
        if (b.maker) {
          this.fetchPerson(b.maker)
        }
      }
      this.setState({ 'bookmark': bm })
    }, err => {
      console.log(err)
    })
  }

  fetchPerson(uri) {
    if (!uri) return
    if (uri.match(/reddit.com.*this$/)) {
      let o = {}
      o[uri] = { name: uri.replace(/.*reddit.com.*user.(.*).this/, '$1') }
      this.setState(o)
      return
    }

    UI.fetcher.load(uri).then(response => {
      let profile = getProfileFromSubject(uri)

      let o = {}
      o[uri] = profile
      this.setState(o)
    })
  }

  getUpdatesVia(doc) {
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
    this.fetchBookmark(this.state.subject, true)
  }

  componentDidMount() {
    let subject = this.state.subject
    if (this.isMedia(subject) === false) {
      this.fetchBookmark(subject)
    }
    if (subject) {
      setTimeout(() => {
        this.setRefreshHandler(subject, this.refresh)
      }, 1000)
    }
  }

  componentWillReceiveProps(props) {
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

  render() {
    let med = this.isMedia(this.props.subject)
    var self = this

    function getName(maker) {
      return self.state[maker] ? self.state[maker].name : maker
    }

    if (med === true) {
      return (
        <Media href={this.props.subject} />
      )
    } else {
      const listItems = this.state.bookmark.map((b, i) =>
        <div>
          <BookmarkItem key={i} id={i} recalls={b.recalls} title={b.title} maker={getName(b.maker)} created={b.created} subject={b.subject} />
        </div>
      )

      return (
        <div>{listItems}</div>
      )
    }
  }
}

// REMOVE export default Bookmark
