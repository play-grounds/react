//REMOVE import React from 'react'

class Bookmark extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    let isMedia = true
    if (isMedia) {
      return (
        <Media href={this.props.subject} />
      )  
    }
  }
}

//REMOVE export default Bookmark
