import React, { useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { stratify, hierarchy, tree } from 'd3'
import { AutoSizer } from 'react-virtualized'
import defaultSpringConfig from './springConfig'
import Canvas from './Canvas'
import Boxes from './Boxes'
import Links from './Links'

/** @typedef {import('d3-hierarchy').HierarchyNode} HierarchyNode */
/** @typedef {HierarchyNode & {x: number, y:number }} TreeNode */
/** @typedef {import('react-spring').SpringConfig} SpringConfig */

/** @param {{
 * data: any[], 
 * onClick: (e)=>void, 
 * Component: React.ReactType, 
 * boxStyle?: string,
 * nodeHeight?: number,
 * nodeWidth?: number,
 * nodeSpacing?: number
 * springConfig?: SpringConfig
 * nodeIdField?: string,
 * parentIdField?: string
 }} props */
const Hierarchy = ({
  data,
  onClick,
  Component,
  boxStyle,
  nodeHeight: dy,
  nodeWidth: dx,
  nodeSpacing,
  springConfig,
  nodeIdField,
  parentIdField
}) => {
  const stratifier = useMemo(
    () =>
      stratify()
        .id((d) => d[nodeIdField])
        .parentId((d) => d[parentIdField]),
    [nodeIdField, parentIdField]
  )
  const [collapsed, setCollapsed] = useState([])

  const handleClick = useCallback(
    (id) =>
      setCollapsed((state) =>
        state.includes(id)
          ? state.filter((item) => item !== id)
          : state.concat(id)
      ),
    [setCollapsed]
  )

  const { root, parents } = useMemo(() => {
    const parents = new Set(data.map((item) => item[parentIdField]))
    const collapsedSet = new Set(collapsed)

    const connections = stratifier(data)
    /** @param {HierarchyNode} element */
    const dropChildren = (element) => {
      // this method mutates the connections data!
      // for each collapsed node drop the children
      if (collapsedSet.has(element.data[nodeIdField])) {
        element.children = null
        return
      }
      if (element.children) element.children.forEach(dropChildren)
    }
    dropChildren(connections)
    const hierarchyConnections = hierarchy(connections)
    return {
      root: tree().nodeSize([dx + nodeSpacing, dy + nodeSpacing])(
        hierarchyConnections
      ),
      parents
    }
  }, [data, collapsed, dx, dy, nodeSpacing])
  return (
    <div
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <AutoSizer>
        {({ width, height }) =>
          width === 0 || height === 0 ? null : (
            <Canvas height={height} width={width}>
              <Links
                nodeIdField={nodeIdField}
                root={root}
                dx={dx}
                dy={dy}
                collapsed={collapsed}
                springConfig={springConfig}
              />
              <Boxes
                nodeIdField={nodeIdField}
                Component={Component}
                root={root}
                dx={dx}
                dy={dy}
                collapsed={collapsed}
                parents={parents}
                onClick={onClick}
                onCollapse={handleClick}
                boxStyle={boxStyle}
                springConfig={springConfig}
              />
            </Canvas>
          )
        }
      </AutoSizer>
    </div>
  )
}

Hierarchy.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
  boxStyle: PropTypes.string,
  Component: PropTypes.elementType.isRequired,
  nodeHeight: PropTypes.number,
  nodeWidth: PropTypes.number,
  nodeSpacing: PropTypes.number,
  springConfig: PropTypes.object,
  nodeIdField: PropTypes.string,
  parentIdField: PropTypes.string
}

Hierarchy.defaultProps = {
  onClick: () => {},
  boxStyle: '',
  nodeHeight: 320,
  nodeWidth: 500,
  nodeSpacing: 150,
  springConfig: defaultSpringConfig,
  nodeIdField: 'id',
  parentIdField: 'parentId'
}

export default Hierarchy
