

function Body(props) {
  return (
  <div>

    <h1 id="welcome" className="title">
      Play apps!
    </h1>


  </div>
);
}

function Li (props) {
  return (
    <div className="index">
      <a href={props.href}>{props.text}</a>
    </div>
  )
}


function App() {
  let apps = [
  { "uri" : "bookmark.html", "title" :  "Bookmarks" }, 
  { "uri" : "brain.html", "title" :  "Brain Wallet" }, 
  { "uri" : "friends.html", "title" :  "Friends in RDF" }, 
  { "uri" : "solid.html", "title" :  "Solid App" }, 
  { "uri" : "rdflib.html", "title" :  "Test RDFLib" }, 
  { "uri" : "tipjar.html", "title" :  "Tipjars" }, 
  { "uri" : "localStorage.html", "title" :  "Local Storage" }, 
  { "uri" : "bookmarklet.html", "title" :  "Bookmarklets" }, 
  { "uri" : "solid-auth-client.html", "title" :  "Solid Auth Client" }, 
  { "uri" : "wallet.html", "title" :  "Wallet" }, 
  { "uri" : "credit.html", "title" :  "Credit" }, 
  { "uri" : "outstated.html", "title" :  "Outstated Counter" }, 
  { "uri" : "counter.html", "title" :  "Counter App" }, 
  { "uri" : "seed.html", "title" :  "Seed App" }, 
  { "uri" : "inbox.html", "title" :  "Inbox App" }, 
  { "uri" : "patch.html", "title" :  "Patch App" }, 
  { "uri" : "put.html", "title" :  "Put App" }, 
  { "uri" : "person.html", "title" :  "Profile App" }, 
  { "uri" : "container.html", "title" :  "Container App" }, 
  { "uri" : "timeline.html", "title" :  "Timeline App" }, 
  { "uri" : "dashboard.html", "title" :  "Dashboard App" }, 
  { "uri" : "acl.html", "title" :  "ACL App" }
  ]

  var appList = apps.map((app) => {
    return <Li href={app.uri} text={app.title} />
  })

  return (
  <div>
    <NavbarSolidLogin
       className="is-link" 
       title="Play Apps" 
       sourceCode="https://github.com/play-grounds/react/blob/gh-pages/play/index.html"/>
    <section className="section">
      <Body/>
      <hr/>
      Play apps is a set of playground apps to test out various functionality.
      <br/>
      Click on a link below to try out one of our apps.
      <hr/>
      {appList}
    <hr/>
    </section>

  </div>
);
}

ReactDOM.render(
<App />,
document.getElementById('root')
);

