import React from 'react'

/** Displays a NamedNode by value. */
export default function NamedNode ({value, ...props}) {
  var contentType
  if (/.png$|.jpg$/.test(value)) {
    contentType = 'image'
    return <img src={value} alt='' />
  } else {
    return <a href={value} alt=''>{value}</a>
  }
}
