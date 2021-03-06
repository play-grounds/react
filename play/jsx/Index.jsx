function Body (props) {
  return (
    <div>
      <h1 id='welcome' className='title'>
        App Gallery!
      </h1>
    </div>
  )
}

function Li (props) {
  return (
    <span
      style={{
        display: 'flex',
        height: '200px',
        flexGrow: '1'
      }}
      className='box'
    >
      <div className='card'>
        <div className='card-content'>
          <div className='media'>
            <div className='media-left'>
              <div className='media-content'>
                <p className='title is-5'>
                  <a target='_blank' href={props.href}>
                    {props.text}
                  </a>
                </p>
                <hr />
              </div>
              <figure className='image is-48x48'>
                <a target='_blank' href={props.href}>
                  <img
                    style={{ height: '90px', width: '90px' }}
                    src={props.image || './image/app.jpg'}
                    alt='Placeholder image'
                  />
                </a>
                <div
                  style={{
                    display: 'inline',
                    verticalAlign: 'top',
                    paddingLeft: '16px'
                  }}
                  className='content'
                >
                  {props.description || props.text}
                </div>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </span>
  )
}

function App () {
  let apps = [
    {
      uri: 'bookmark.html',
      title: 'Bookmarks',
      description: 'Social Bookmarking',
      image: 'image/bookmark.jpg'
    },
    {
      uri: 'friends.html',
      title: 'Social Graph',
      image: 'image/friends.png'
    },
    { uri: 'tipjar.html', title: 'Tipjars', image: 'image/tipjar.png' },
    {
      uri: 'calendar.html',
      title: 'Calendar App',
      image: 'image/calendar.png'
    },
    {
      uri: 'video.html',
      title: 'Video App',
      image: 'image/video.png'
    },
    { uri: 'person.html', title: 'Profile App', image: 'image/person.png' },
    {
      uri: 'webtorrent.html',
      title: 'Webtorrent App',
      image: 'image/webtorrent.png'
    },
    {
      uri: 'activity.html',
      title: 'Activity App',
      image: 'image/activity.png'
    },
    { uri: 'points.html', title: 'Points App', image: 'image/points.png' },
    { uri: 'localStorage.html', title: 'Local Storage' },
    { uri: 'brain.html', title: 'Brain Wallet', image: 'image/brain.jpg' },
    { uri: 'bookmarklet.html', title: 'Bookmarklets' },
    { uri: 'solid-auth-client.html', title: 'Solid Auth Client' },
    { uri: 'wallet.html', title: 'Wallet' },
    { uri: 'credit.html', title: 'Credit', image: 'image/credit.png' },
    {
      uri: 'outstated.html',
      title: 'Outstated Counter',
      image: 'image/outstated.png'
    },
    { uri: 'counter.html', title: 'Counter App', image: 'image/counter.png' },
    { uri: 'seed.html', title: 'Seed App', image: 'image/seed.png' },
    { uri: 'inbox.html', title: 'Inbox App', image: 'image/inbox.png' },
    { uri: 'webid.html', title: 'WebId App', image: 'image/webid.png' },
    { uri: 'speech.html', title: 'Speech App', image: 'image/speech.png' },
    {
      uri: 'groupuris.html',
      title: 'Group URIs',
      image: 'image/groupuris.png'
    },
    { uri: 'voucher.html', title: 'Web Vouchers', image: 'image/voucher.png' },
    { uri: 'patch.html', title: 'Patch App' },
    { uri: 'touch.html', title: 'Touch App' },
    { uri: 'put.html', title: 'Put App' },
    {
      uri: 'container.html',
      title: 'Container App',
      image: 'image/container.png'
    },
    {
      uri:
        'mind.html?data=%7B%22nodeData%22%3A%7B%22id%22%3A%22root%22%2C%22topic%22%3A%22Lightning%20games%22%2C%22root%22%3Atrue%2C%22children%22%3A%5B%7B%22topic%22%3A%22released%22%2C%22id%22%3A%22c63b8604ff228829%22%2C%22selected%22%3Atrue%2C%22new%22%3Atrue%2C%22children%22%3A%5B%7B%22topic%22%3A%22donner%20dungeon%22%2C%22id%22%3A%22c63b847b05a5686b%22%2C%22selected%22%3Atrue%2C%22new%22%3Atrue%7D%2C%7B%22topic%22%3A%22poker%22%2C%22id%22%3A%22c63b840e2e19d384%22%2C%22selected%22%3Atrue%2C%22new%22%3Atrue%7D%2C%7B%22topic%22%3A%22agar%22%2C%22id%22%3A%22c631c9cb1d7ff3cf%22%2C%22selected%22%3Atrue%2C%22new%22%3Atrue%2C%22style%22%3A%7B%22color%22%3A%22%23c0392c%22%7D%7D%5D%7D%2C%7B%22topic%22%3A%22coming%20soon%22%2C%22id%22%3A%22c63b869ec834af65%22%2C%22selected%22%3Atrue%2C%22new%22%3Atrue%2C%22children%22%3A%5B%7B%22topic%22%3A%22Infinite%20Fleet%22%2C%22id%22%3A%22c63b898f4420b806%22%2C%22selected%22%3Atrue%2C%22new%22%3Atrue%2C%22style%22%3A%7B%22fontSize%22%3A%2232%22%2C%22color%22%3A%22%2327ae61%22%2C%22fontWeight%22%3A%22bold%22%7D%7D%5D%7D%5D%2C%22expanded%22%3Atrue%2C%22style%22%3A%7B%22color%22%3A%22%23f1c40e%22%7D%7D%2C%22linkData%22%3A%7B%7D%7D',
      image: 'image/mind.png',
      title: 'Mind Map App'
    },
    { uri: 'timeline.html', title: 'Timeline App' },
    {
      uri: 'dashboard.html',
      title: 'Dashboard App',
      image: 'image/dashboard.png'
    },
    { uri: 'conference.html', title: 'Conference Call' },
    { uri: 'acl.html', title: 'ACL App' },
    { uri: 'solid.html', title: 'Solid App' },
    { uri: 'rdflib.html', title: 'Test RDFLib' }
  ]

  var appList = apps.map(app => {
    return (
      <Li
        href={app.uri}
        text={app.title}
        image={app.image}
        description={app.description}
      />
    )
  })

  return (
    <div>
      <NavbarSolidLogin
        className='is-link'
        title='Play Apps'
        sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/index.html'
      />
      <section style={{ maxWidth: '90%' }} className='section'>
        <Body />
        <hr />
        Play apps is a set of playground apps to test out various functionality.
        <br />
        Click on a link below to try out one of our apps.
        <hr />
        <div style={{ maxWidth: '90%', display: 'flex', flexWrap: 'wrap' }}>
          {appList}{' '}
        </div>
        <hr />
      </section>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
