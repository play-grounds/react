// REMOVE import React from 'react'
// REMOVE import Media from './Media.jsx'

// Structure
// Bookmark
//   Person

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

function BookmarkItem (props) {
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
              <td><sup style={{ color : 'rgb(136,136,136)' }}>{moment.utc(props.created).fromNow()} by <a href={props.maker} target='_blank' style={{ color: '#369' }}>{props.maker}</a></sup></td>
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
              <td><sup>{moment.utc(props.created).fromNow()} by <a href={props.maker} target='_blank' style={{ color: 'inherit' }}>{props.maker}</a></sup></td>
            </tr>

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
              <td><sup>{moment.utc(props.created).fromNow()} by <a style={{ color : '#369' }} href={props.maker} target='_blank' >{props.maker}</a></sup></td>
            </tr>

          </tbody>
        </table>

      </div>
    )
  }
}

function getTypeFromSubject (subject) {
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

function getProfileFromSubject (subject) {
  var profile = {}
  profile.type = getVal(subject, RDF('type'))
  profile.name = getVal(subject, FOAF('name'))
  profile.nick = getVal(subject, FOAF('nick'))
  profile.img = getVal(subject, FOAF('img'))
  profile.image = getVal(subject, FOAF('image'))
  profile.depiction = getVal(subject, FOAF('depiction'))
  profile.hasPhoto = getVal(subject, VCARD('hasPhoto'))
  profile.fn = getVal(subject, VCARD('fn'))
  profile.nickname = getVal(subject, VCARD('nickname'))
  profile.timeline = getVal(subject, SOLID('timeline'))
  profile.publicTypeIndex = getVal(subject, SOLID('publicTypeIndex'))
  profile.privateTypeIndex = getVal(subject, SOLID('privateTypeIndex'))
  profile.subject = subject
  return profile
}

function getBookmarkFromSubject (subject) {
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
  s = UI.store.sym(subject)
  p = UI.store.sym('http://xmlns.com/foaf/0.1/maker')
  o = null
  w = UI.store.sym(subject.split('#')[0])
  let maker = UI.store.any(s, p, o, w)
  s = UI.store.sym(subject)
  p = UI.store.sym('http://purl.org/dc/terms/created')
  o = null
  w = UI.store.sym(subject.split('#')[0])
  let created = UI.store.any(s, p, o, w)

  let bookmark = { 'recalls': recalls.value, 'title': title.value, 'maker': maker.value, 'created': created.value, 'subject': subject }
  return bookmark
}

function getVal (subject, predicate) {
  if (!subject || !predicate) return
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

class Bookmark extends React.Component {
  constructor (props) {
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

  fetchBookmark (subject, force) {
    force = !!force
    console.log('fetch bookmark', subject, 'force', force)
    UI.fetcher.load(subject, {force: force}).then(response => {
      var type = getTypeFromSubject(subject)
      var bm = []
      console.log('type', type)

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

  fetchPerson (uri) {
    if (!uri) return
    if (uri.match(/reddit.com.*this$/)) {
      let o = {}
      o[uri] = { name : uri.replace(/.*reddit.com.*user.(.*).this/, '$1') }
      this.setState(o)
      return
    }

    UI.fetcher.load(uri).then(response => {
      let profile = getProfileFromSubject(uri)

      console.log('profile', profile)
      let o = {}
      o[uri] = profile
      this.setState(o)
      console.log('state', this.state)
    })
  }

  getUpdatesVia (doc) {
    var linkHeaders = UI.store.fetcher.getHeader(doc, 'updates-via')
    console.log('linkHeaders', linkHeaders, 'doc', doc)
    if (!linkHeaders || !linkHeaders.length) return null
    return linkHeaders[0].trim()
  }

  setRefreshHandler (subject, handler) {
    var self = this
    var wss = this.getUpdatesVia(subject)
    console.log('wss', wss, 'subject', subject)
    let w = new WebSocket(wss)
    w.onmessage = function (m) {
      let data = m.data
      console.log('data', data)
      if (data.match(/pub .*/)) {
        console.log('refresh')
        // hack for now
        self.refresh()
      }
    }
    w.onopen = function () {
      w.send('sub ' + subject)
    }
  }

  refresh () {
    this.fetchBookmark(this.state.subject, true)
  }

  componentDidMount () {
    let subject = this.state.subject
    if (this.isMedia(subject) === false) {
      this.fetchBookmark(subject)
    }
    if (subject) {
      console.log('init subject', subject)
      setTimeout(() => {
        this.setRefreshHandler(subject, this.refresh)
      }, 1000)
    }
  }

  componentWillReceiveProps (props) {
    let subject = props.subject
    if (this.isMedia(subject) === false) {
      this.fetchBookmark(subject)
    }
  }

  isMedia (subject) {
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
    console.log('subject', this.props.subject, med)
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
