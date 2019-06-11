import React from 'react'

/** Displays a NamedNode by value. */
export default function NamedNode ({value, ...props}) {
  return <a href={value} alt=''>{value}</a>
}
