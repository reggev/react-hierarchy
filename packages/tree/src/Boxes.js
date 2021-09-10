import React, { useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { animated, useTransition } from '@react-spring/web'
import styles from './styles.module.scss'

/**
 * @typedef {import('./index').TreeNode} TreeNode
 * @typedef {import("d3").HierarchyNode} HierarchyNode
 * @param {{
 *  root: TreeNode,
 *  parents: Set<string>,
 *  onClick: (e)=>void,
 *  onCollapse: (e) => void,
 *  dx:number,
 *  dy:number,
 *  collapsed: string[],
 *  Component: React.ReactType,
 *  boxStyle?: string,
 *  springConfig: import('@react-spring/web').SpringConfig,
 *  nodeIdField: string
 * }} props */
const Boxes = ({
  root,
  dx,
  dy,
  parents,
  onClick,
  onCollapse,
  Component,
  boxStyle,
  springConfig,
  nodeIdField
}) => {
  const elements = useMemo(() => root.descendants(), [root])
  const transitions = useTransition(
    elements,
    (item) => item.data.data[nodeIdField],
    {
      from: {
        opacity: 0
      },
      enter: (child) => ({
        opacity: 1,
        transform: `translate(${child.x}, ${child.y})`
      }),
      update: (child) => ({
        opacity: 1,
        transform: `translate(${child.x}, ${child.y})`
      }),
      leave: { opacity: 0 },
      config: springConfig
    }
  )
  return (
    <Fragment>
      {transitions.map(({ item: { data, children }, key, props }) => (
        <animated.g style={props} transform={props.transform} key={key}>
          <foreignObject
            width={dx}
            height={dy}
            style={{ overflow: 'visible' }}
            xmlns='http://www.w3.org/1999/xhtml'
          >
            <div
              className={`${styles.contentBox} ${boxStyle}`}
              style={{ height: dy - 20 }}
            >
              <Component
                data={data.data}
                onClick={onClick}
                id={data.id}
                onCollapse={onCollapse}
                showExpand={parents.has(data.id)}
                isExpanded={!!children}
              />
            </div>
          </foreignObject>
        </animated.g>
      ))}
    </Fragment>
  )
}

Boxes.propTypes = {
  root: PropTypes.shape({
    descendants: PropTypes.func.isRequired
  }).isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  parents: PropTypes.instanceOf(Set),
  onClick: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
  Component: PropTypes.elementType.isRequired,
  nodeIdField: PropTypes.string.isRequired,
  boxStyle: PropTypes.string,
  springConfig: PropTypes.object
}
Boxes.defaultProps = {
  boxStyle: ''
}

export default Boxes
