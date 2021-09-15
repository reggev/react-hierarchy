import React, { useCallback } from 'react'
import { ComponentProps } from '../../src/index'
import { Data } from './data'

const Card = ({
  id,
  data,
  onClick,
  toggleCollapse,
  hasChildren,
  isExpanded
}: ComponentProps<Data>) => {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [onClick, id])

  const handleCollapse = useCallback(() => {
    toggleCollapse(id)
  }, [toggleCollapse, id])

  return (
    <div data-id={id}>
      <header data-node-rank={data.rank} onClick={handleClick}>
        <h1 data-testId={`card-${id}-header`}>{data.name}</h1>
      </header>
      <p data-testId={`card-${id}-payload`}>{data.rank}</p>
      {hasChildren && (
        <button
          data-testId={`card-${id}-collapse-button`}
          onClick={handleCollapse}
        >
          {isExpanded ? '-' : '+'}
        </button>
      )}
    </div>
  )
}

export default Card
