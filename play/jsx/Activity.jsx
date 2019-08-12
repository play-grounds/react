// main
var UI = {}
UI.store = $rdf.graph()
UI.fetcher = new $rdf.Fetcher(UI.store)
UI.updater = new $rdf.UpdateManager(UI.store)

var subject =
  new URLSearchParams(document.location.search).get('uri') ||
  'https://melvin.solid.live/credit/activity.ttl'

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

  const touch = (amount, day = 0) =>
    setTemplate({
      count: amount,
      day: day,
      now: new Date().getTime()
    })

  const decrement = () => setTemplate({ count: count + 30 })

  const reset = (count, day = 0, push = false) => {
    count = count || 0

    console.log('day % 360', day % 360, 'a', a)

    setTemplate({ count: count, day: day })
  }

  return { template, increment, decrement, touch, reset }
}

function pushLast (val) {
  if (!val) return
  console.log('###### pushing', val)

  let last = localStorage.getItem('last')
  if (!last) {
    localStorage.setItem('last', JSON.stringify([]))
  }
  let ret = JSON.parse(localStorage.getItem('last'))
  if (val !== ret[ret.length - 1]) {
    ret.push(val)
    localStorage.setItem('last', JSON.stringify(ret))
  }
}

function Activity () {
  const { template, reset, touch } = useStore(store)

  function fetchCount (subject) {
    console.log('fetching', subject)

    UI.fetcher.load(subject, { force: true }).then(
      response => {
        let s = null
        let p = UI.store.sym('urn:string:activity')
        let o = null
        let w = UI.store.sym(subject.split('#')[0])
        let hour = UI.store.statementsMatching(s, p, o, w)
        let hourInt = hour[0].object.value

        cogoToast.info(hourInt, {
          position: 'top-right',
          heading: 'Melvin Carvalho'
        })

        p = UI.store.sym('urn:query:day')
        let day = UI.store.statementsMatching(s, p, o, w)
        let dayInt = parseInt(day[0].object.value)
        console.log('day', day[0].object.value)

        reset(hourInt, dayInt, true)
      },
      err => {
        console.log(err)
      }
    )
  }

  // update timer
  const [seconds, setSeconds] = React.useState(0)
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    fetchCount(subject)

    let uri = location.href
    let wss = uri.replace('http', 'ws')
    let w = new WebSocket('wss://melvin.solid.live/')
    w.onmessage = function (m) {
      let data = m.data
      console.log('data', data)
      // cogoToast.success(data, { position: 'top-right' })

      if (data.match(/pub .*/)) {
        UI.store = $rdf.graph()
        UI.fetcher = new $rdf.Fetcher(UI.store)
        fetchCount(subject)
        // location.reload()
      }
    }
    w.onopen = function () {
      w.send('sub ' + subject)
    }
  }, [])

  return (
    <div className='is-info'>
      <h1>Activity Stream</h1>

      <hr />
    </div>
  )
}

ReactDOM.render(
  <Provider stores={[store]}>
    <NavbarSolidLogin
      className='is-link'
      title='Activity App'
      sourceCode='https://github.com/play-grounds/react/blob/gh-pages/play/activity.html/'
    />

    <div className='section'>
      <div className='container'>
        <div className='columns'>
          <div className='column'>
            <div className='notification is-info'>
              <Activity />
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

  // console.log(rad, percent, count, p, factor)

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
