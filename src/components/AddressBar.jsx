//REMOVE import React from 'react' ; import ReactDOM from 'react-dom' 

class AddressBar extends React.Component {
  constructor (props) {
    super(props)
    if (props.subject) {
      this.state = { subject : props.subject }
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({subject: event.target.value })
    history.pushState({}, 'Bookmark App', window.location.href.split('?')[0] + '?uri=' + encodeURIComponent(event.target.value))
    if (this.props.updater) {
      this.props.updater(event.target.value)
    }
  }

  render () {
    return (<div>
      <label>Address</label>
      <br/> 
      <input size='80' onChange={this.handleChange} placeholder='uri' value={this.state.subject} />
      <hr />

      {this.props.children}
    </div>)
  }

}

//REMOVE export default AddressBar
