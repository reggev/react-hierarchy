import React, { useCallback, Fragment } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'

const Card = ({ id, data, onClick, onCollapse, showExpand, isExpanded }) => {
  const handleClick = useCallback(() => {
    onClick(id)
  }, [onClick, id])
  const handleCollapse = useCallback(() => {
    onCollapse(id)
  }, [onCollapse, id])
  return (
    <Fragment>
      <header
        className={styles.nodeHeaderContainer}
        data-node-rank={data.rank}
        onClick={handleClick}
      >
        <h1 className={styles.nodeHeader}>{data.name}</h1>
      </header>
      <p>this is a very long and exciting story</p>
      <footer className={styles.nodeFooter} data-node-rank={data.rank}>
        <p>this is the end of the card</p>
      </footer>
      {showExpand && (
        <button className={styles.expandButton} onClick={handleCollapse}>
          {isExpanded ? '-' : '+'}
        </button>
      )}
    </Fragment>
  )
}

Card.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  onClick: PropTypes.func
}

export default Card
