class AddressBar extends React.Component {
  constructor (props) {
    super(props)
    var uri = subject
    this.state = { uri: subject }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({uri: event.target.value })
    history.pushState({}, 'Bookmark App', window.location.href.split('?')[0] + '?uri=' 
    + encodeURIComponent(event.target.value))
    console.log('this.state.uri', this.state.uri)
  }

  render () {
    return (<div>
      <label>Address</label>
      <br/> 
      <input size='80' onChange={this.handleChange} placeholder='uri' value={this.state.uri} />
      <hr />

      {this.props.children}
    </div>)
  }

}

