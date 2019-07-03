function App() {
  return (
    <div>
      <NavbarSolid className="is-link" title="Brain Wallet" sourceCode="https://github.com/play-grounds/react/blob/gh-pages/play/brain.html"></NavbarSolid>
      <Body />
    </div>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
