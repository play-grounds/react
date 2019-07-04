//REMOVE import React from 'react' ; import ReactDOM from 'react-dom' 

class Addressbar extends React.Component {
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
  }

  render () {

    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        subject: this.state.subject
      });
    });

    return (<div>
      <label>Address</label>
      <br/> 
      <input size='80' onChange={this.handleChange} placeholder='uri' value={this.state.subject} />
      <hr />

      {children}
    </div>)
  }

}

//REMOVE export default Addressbar
