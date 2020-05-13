import React, {
  useMemo,
  useState,
  useCallback,
  useImperativeHandle
} from 'react'
import PropTypes from 'prop-types'
import { stratify, hierarchy, tree } from 'd3'
import { AutoSizer } from 'react-virtualized'
import defaultSpringConfig from './springConfig'
import Canvas from './Canvas'
import Boxes from './Boxes'
import Links from './Links'

/**
 *  @typedef {import('d3-hierarchy').HierarchyNode} HierarchyNode
 *  @typedef {HierarchyNode & {x: number, y:number }} TreeNode
 *  @typedef {import('react-spring').SpringConfig} SpringConfig
 * */

const Hierarchy = React.forwardRef(
  /** @param {{
  * data: any[], 
  * onClick: (e)=>void, 
  * Component: React.ElementType, 
  * boxStyle?: string,
  * nodeHeight?: number,
  * nodeWidth?: number,
  * nodeSpacing?: number
  * springConfig?: SpringConfig
  * nodeIdField?: string,
  * parentIdField?: string,
  * maxInitialDepth?: number,
  }} props */
  (
    {
      data,
      onClick,
      Component,
      boxStyle,
      nodeHeight: dy,
      nodeWidth: dx,
      nodeSpacing,
      springConfig,
      nodeIdField,
      parentIdField,
      maxInitialDepth
    },
    ref
  ) => {
    const [isFirstRender, setIsFirstRender] = useState(true)

    if (isFirstRender) setIsFirstRender(false)

    const [collapsed, setCollapsed] = useState([])
    const stratifier = useMemo(
      () =>
        stratify()
          .id((d) => d[nodeIdField])
          .parentId((d) => d[parentIdField]),
      [nodeIdField, parentIdField]
    )

    const handleClick = useCallback(
      (id) =>
        setCollapsed((state) =>
          state.includes(id)
            ? state.filter((item) => item !== id)
            : state.concat(id)
        ),
      [setCollapsed]
    )

    const filterByDepth = useCallback(
      (connections) => {
        /** @type {HierarchyNode[]} */
        const descendants = connections.descendants()
        return descendants
          .filter((item) => item.depth >= maxInitialDepth)
          .map((item) => item.id)
      },
      [maxInitialDepth]
    )

    const setupHierarchy = useCallback(
      (data, collapsed) => {
        const parents = new Set(data.map((item) => item[parentIdField]))
        const collapsedSet = new Set(collapsed)

        const connections = stratifier(data)
        let limitedConnections = null

        if (isFirstRender && Number.isInteger(maxInitialDepth)) {
          /* 
        Render root only on the first render,
        This is done to avoid rendering a full tree if a limited depth is set 
        the call to "setCollapsed" and setting the "isFirstRender" flag above 
        will re-render the component, the second render will use an actual root 
        (with limited depth).
        */
          limitedConnections = { ...connections, children: null }
          const collapsedNodes = filterByDepth(connections)
          setCollapsed(collapsedNodes)
        }

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
        if (!limitedConnections) dropChildren(connections)
        const hierarchyConnections = hierarchy(
          limitedConnections || connections
        )
        return {
          root: tree().nodeSize([dx + nodeSpacing, dy + nodeSpacing])(
            hierarchyConnections
          ),
          parents
        }
      },
      [
        filterByDepth,
        nodeIdField,
        parentIdField,
        stratifier,
        dx,
        dy,
        nodeSpacing,
        isFirstRender,
        maxInitialDepth,
        setCollapsed
      ]
    )

    const { root, parents } = useMemo(() => setupHierarchy(data, collapsed), [
      data,
      collapsed,
      setupHierarchy
    ])

    const collapseAll = useCallback(() => setCollapsed([...parents]), [
      parents,
      setCollapsed
    ])

    useImperativeHandle(ref, () => ({
      collapseAll
    }))

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
)

Hierarchy.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func,
  boxStyle: PropTypes.string,
  Component: PropTypes.func.isRequired,
  nodeHeight: PropTypes.number,
  nodeWidth: PropTypes.number,
  nodeSpacing: PropTypes.number,
  springConfig: PropTypes.object,
  nodeIdField: PropTypes.string,
  parentIdField: PropTypes.string,
  maxInitialDepth: PropTypes.number
}

Hierarchy.defaultProps = {
  onClick: () => {},
  boxStyle: '',
  nodeHeight: 320,
  nodeWidth: 500,
  nodeSpacing: 150,
  springConfig: defaultSpringConfig,
  nodeIdField: 'id',
  parentIdField: 'parentId',
  maxInitialDepth: undefined
}

export default Hierarchy
