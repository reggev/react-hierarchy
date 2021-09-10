import React, { useMemo, Fragment } from 'react'
import PropTypes from 'prop-types'
import Link from './Link'

/**
 * @typedef {import('./index').TreeNode} TreeNode
 * @typedef {import("d3-hierarchy").HierarchyNode} HierarchyNode
 * @param {{
 *  root: TreeNode,
 *  dx:number,
 *  dy:number,
 *  collapsed: string[],
 *  springConfig: import('@react-spring/web').SpringConfig,
 * nodeIdField: string
 * }} props */
const Links = ({ root, dx, dy, springConfig, nodeIdField }) => {
  /** @type {{source: TreeNode, target: TreeNode}[]} */
  // @ts-ignore
  const links = useMemo(() => root.links(), [root])
  // wrapping in a for type compatibility
  return (
    <Fragment>
      {links.map(({ source, target }) => (
        <Link
          key={`link-${source.data.id}-${target.data.id}`}
          source={source}
          target={target}
          dx={dx}
          dy={dy}
          springConfig={springConfig}
        />
      ))}
    </Fragment>
  )
}

Links.propTypes = {
  root: PropTypes.shape({
    links: PropTypes.func.isRequired
  }).isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  springConfig: PropTypes.object,
  nodeIdField: PropTypes.string.isRequired
}
export default Links
