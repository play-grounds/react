import React from 'react'

/** Displays a Node by value. */
export default function Node ({value, termType, ...props}) {
  if (termType === 'literal') {
    return <Literal value={value} />
  } else if (termType === 'namedNode') {
    return <NamedNode value={value} />
  }
}
