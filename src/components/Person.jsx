//REMOVE import React from 'react'
//REMOVE import Media from './Media.jsx'

var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

const SIOC = $rdf.Namespace("http://rdfs.org/sioc/ns#")
const DCT = $rdf.Namespace('http://purl.org/dc/terms/')
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/')


function getVal(subject, predicate) {

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

function getTypeFromSubject(subject) {
  return getVal(subject, RDF('type'))
}

function getProfileFromSubject(subject) {
  var profile = {}
  profile.type = getVal(subject, RDF('type'))
  profile.name = getVal(subject, FOAF('name'))
  profile.nick = getVal(subject, FOAF('nick'))
  profile.img = getVal(subject, FOAF('img'))
  profile.image = getVal(subject, FOAF('image'))
  profile.depiction = getVal(subject, FOAF('depiction'))
  profile.subject = subject
  return profile
}

function getNameFromSubject(subject) {
  let profile = getProfileFromSubject(subject)
  let name = profile.name || profile.nick || subject
  return name
}

function getAvatarFromSubject(subject) {
  let profile = getProfileFromSubject(subject)
  let avatar = profile.img || profile.image || profile.depiction
  return avatar
}

class Person extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 'subject': props.subject }
  }

  fetchProfile(subject) {
    console.log('fetchProfile', subject);
    if (!subject) return
    if (subject.match(/reddit.com.*this$/)) return
  
    UI.fetcher.load(subject ).then(response => {
      console.log('fetched', subject)
      this.setState({ 'profile' : getProfileFromSubject(subject) })
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
    this.fetchProfile(this.state.subject)
  }

  componentDidMount() {
    let subject = this.state.subject
    this.fetchProfile(subject)
  }

  componentWillReceiveProps(props) {
    let subject = props.subject

    this.fetchProfile(subject)
  }

  render() {
    let name = this.state.profile ? this.state.profile.name : 'has no name'
    console.log('this.state.profile', this.state.profile)
    return (
        <div>
          {name}
        </div>
    )
  }
}
//REMOVE export default Person
