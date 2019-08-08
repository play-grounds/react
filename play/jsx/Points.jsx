// main
var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

var subject =
  new URLSearchParams(document.location.search).get('uri') ||
  'https://melvin.solid.live/credit/count.ttl'

// Create context for global store assignment
const StateContext = React.createContext()

const Provider = ({ stores, children }) => {
  // map that stores initialized versions of all user store hooks
  const storesMap = new Map()
  // complain if no instances provided for initialization
  if (!stores || !stores.length) {
    throw new Error(
      'You must provide stores list to a <Provider> for initialization!'
    )
  }
  // initialize store hooks
  // this is required because react expects the same number
  // of hooks to be called on each render
  // so if we run init in useStore hook - it'll break on re-render
  stores.forEach(store => {
    storesMap.set(store, store())
  })
  // return provider with stores map
  return (
    <StateContext.Provider value={storesMap}>{children}</StateContext.Provider>
  )
}

function useStore (storeInit) {
  const map = React.useContext(StateContext)

  // complain if no map is given
  if (!map) {
    throw new Error('You must wrap your components with a <Provider>!')
  }

  const instance = map.get(storeInit)

  // complain if instance wasn't initialized
  if (!instance) {
    throw new Error('Provided store instance did not initialized correctly!')
  }

  return instance
}

const store = () => {
  let initial = {}
  initial.count =
    new URLSearchParams(document.location.search).get('count') || 0

  const [template, setTemplate] = React.useState(initial)

  const increment = amount => setTemplate({ count: count + amount })
  const decrement = () => setTemplate({ count: count + 30 })
  const reset = (amount, day = 0) => {
    let a = amount || 0
    setTemplate({ count: a, day: day })
    if (a % 360 === 0) {
      localStorage.setItem('zero', new Date().getTime())
      console.log(localStorage.getItem('zero'))
    }
  }

  return { template, increment, decrement, reset }
}

function Points () {
  const { template, increment, decrement, reset } = useStore(store)

  function fetchCount (subject) {
    console.log('fetching', subject)

    UI.fetcher.load(subject, { force: true }).then(
      response => {
        let s = null
        let p = UI.store.sym('urn:query:hour')
        let o = null
        let w = UI.store.sym(subject.split('#')[0])
        let hour = UI.store.statementsMatching(s, p, o, w)
        let hourInt = parseInt(hour[0].object.value)
        console.log('hour', hour[0].object.value)

        p = UI.store.sym('urn:query:day')
        let day = UI.store.statementsMatching(s, p, o, w)
        let dayInt = parseInt(day[0].object.value)
        console.log('day', day[0].object.value)

        if (dayInt % 360 === 0) {
          new Audio('audio/cheer.ogg').play()
        } else if (dayInt % 30 === 0) {
          new Audio('audio/positive.wav').play()
        }

        document.title =
          (dayInt % 30) +
          ' ' +
          ((dayInt % 360) - (dayInt % 30)) +
          ' ' +
          hourInt +
          ' ' +
          dayInt
        reset(hourInt, dayInt)
      },
      err => {
        console.log(err)
      }
    )
  }

  React.useEffect(() => {
    fetchCount(subject)

    let uri = location.href
    let wss = uri.replace('http', 'ws')
    let touchUri = 'https://melvin.solid.live/touch.ttl'
    touchUri = subject
    let w = new WebSocket('wss://melvin.solid.live/')
    w.onmessage = function (m) {
      let data = m.data
      console.log('data', data)
      if (data.match(/pub .*/)) {
        UI.store = $rdf.graph()
        UI.fetcher = new $rdf.Fetcher(UI.store)
        fetchCount(subject)
        // location.reload()
      }
    }
    w.onopen = function () {
      w.send('sub ' + touchUri)
    }
  }, [])

  return (
    <div className='is-info'>
      <h1>Burndown Chart (hourly work)</h1>
      <hr />

      <Circle rad={template.count} count={template.day % 360} />

      <hr />

      <div className='buttons'>
        <span className='button is-large is-warning'>
          S : {template.day % 30}
        </span>
        <span className='button is-large is-success'>
          L : {(template.day % 360) - (template.day % 30)}
        </span>
        <span className='button is-large is-info'>T : {template.count}</span>
        <span className='button is-large is-link'>D : {template.day}</span>
        <span className='button is-large is-danger'>
          E : {(new Date().getTime() - localStorage.getItem('zero')) / 1000}
        </span>
      </div>

      <hr />
      <button className='button is-info' onClick={reset}>
        Refresh
      </button>
      <hr />
    </div>
  )
}

ReactDOM.render(
  <Provider stores={[store]}>
    <NavbarSolidLogin
      className='is-link'
      title='Points App'
      sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/points.html/'
    />

    <div className='section'>
      <div className='container'>
        <div className='columns'>
          <div className='column'>
            <div className='notification is-info'>
              <Points />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Provider>,
  document.getElementById('root')
)

function Circle ({ rad, count, ...props }) {
  var defaultThreshold = 410
  var threshold =
    new URLSearchParams(document.location.search).get('threshold') ||
    defaultThreshold

  if (rad > threshold) {
    rad = threshold
  }

  let percent = rad / threshold
  let red = Math.floor(percent * 212)
  let green = Math.floor(212 - red)
  let factor = threshold / 146.0

  let p = 309 * (count / 360) * percent
  let q = 309 * percent - p

  console.log(rad, percent, count, p, factor)

  return (
    <svg width='300' height='300'>
      <circle
        cx='150'
        cy='150'
        style={{
          fill: 'rgb(' + red + ', ' + green + ', 0)',
          stroke: 'gold',
          strokeWidth: 11,
          strokeDasharray: p + '% ' + q + '%'
        }}
        r={rad / factor}
      >
        <title>Pie</title>
      </circle>
    </svg>
  )
}
