class Video extends React.Component {
  constructor (props) {
    super(props)
    let youtube = new URLSearchParams(document.location.search).get('youtube')
    let video = new URLSearchParams(document.location.search).get('video')
    let embedId = youtube || video || '3AjXgY35iZg'

    let provider = 'youtube'
    if (youtube) provider = 'youtube'
    if (video) provider = 'video'
    this.state = { embedId: embedId, provider: provider }
  }

  render () {
    console.log(this.state)
    if (this.state.provider === 'youtube') {
      return (
        <div className='container'>
          <div
            id='player'
            data-plyr-provider={this.state.provider}
            data-plyr-embed-id={this.state.embedId}
          />
        </div>
      )
    }

    if (this.state.provider === 'video') {
      return (
        <div className='container'>
          <video controls crossOrigin playsInline>
            <source src={this.state.embedId} type='video/mp4' />>
          </video>
        </div>
      )
    }

    return <div>No Video Found</div>
  }
}

ReactDOM.render(
  <div>
    <NavbarSolid
      className='is-link'
      title='Video'
      sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/video.html'
    />

    <Video />
  </div>,

  document.getElementById('root')
)

// https://github.com/sampotts/plyr/#options
const player = new Plyr('#player', {})

// Expose player so it can be used from the console
window.player = player
