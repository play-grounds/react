class App extends React.Component {
  constructor (props) {
    super(props)
    let youtube =
      new URLSearchParams(document.location.search).get('youtube') ||
      'bTqVqk7FSmY'
    this.state = { youtube: youtube }
  }

  render () {
    return (
      <div className='container'>
        <div
          id='player'
          data-plyr-provider='youtube'
          data-plyr-embed-id={this.state.youtube}
        />
      </div>
    )
  }
}

ReactDOM.render(
  <div>
    <NavbarSolid
      className='is-link'
      title='Video'
      sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/video.html'
    />

    <App />
  </div>,

  document.getElementById('root')
)

// https://github.com/sampotts/plyr/#options
const player = new Plyr('#player', {})

// Expose player so it can be used from the console
window.player = player
