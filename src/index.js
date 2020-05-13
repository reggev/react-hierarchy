import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useImperativeHandle
} from 'react'
import PropTypes from 'prop-types'
import { stratify, hierarchy, tree } from 'd3'
import { AutoSizer } from 'react-virtualized'
import defaultSpringConfig from './springConfig'
import Viewer from './Viewer'
import Boxes from './Boxes'
import Links from './Links'

/**
 *  @typedef {import('d3-hierarchy').HierarchyNode} HierarchyNode
 *  @typedef {HierarchyNode & {x: number, y:number }} TreeNode
 *  @typedef {import('react-spring').SpringConfig} SpringConfig
 * */

const defaultPadding = {
  bottom: 0,
  top: 0,
  left: 0,
  right: 0
}

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
  * padding: {top: number, bottom:number, left: number, right: number}
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
      maxInitialDepth,
      padding
    },
    ref
  ) => {
    const [isFirstRender, setIsFirstRender] = useState(true)
    const viewerRef = useRef()
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

    const zoomExtends = useCallback(() => {
      if (!viewerRef.current) return false
      const minY = 0 // root y
      const { minX, maxX, maxY } = root.leaves().reduce(
        (acc, item) => ({
          minX: Math.min(acc.minX, item.x),
          maxX: Math.max(acc.maxX, item.x),
          maxY: Math.max(acc.maxY, item.y)
        }),
        {
          minX: 0,
          maxX: 100,
          maxY: 100
        }
      )

      const corrections = {
        horizontalPadding: dx / 2,
        verticalPadding: dy / 2,
        horizontalOffset: dx * 2,
        verticalOffset: dy * 2
      }
      const _padding = { ...defaultPadding, ...padding }
      const dimensions = {
        minY: minY - corrections.verticalPadding - _padding.top,
        minX: minX - corrections.horizontalPadding - _padding.left,
        maxX,
        maxY,
        width:
          Math.abs(minX) +
          Math.abs(maxX) +
          corrections.horizontalOffset +
          _padding.left +
          _padding.right,
        height:
          Math.abs(minY) +
          Math.abs(maxY) +
          corrections.verticalOffset +
          _padding.top +
          _padding.bottom
      }
      // @ts-ignore
      viewerRef.current.fitSelection(
        dimensions.minX,
        dimensions.minY,
        dimensions.width,
        dimensions.height
      )
      return dimensions
    }, [root, dx, dy, viewerRef, padding])

    useImperativeHandle(ref, () => ({
      collapseAll,
      zoomExtends
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
              <Viewer
                height={height}
                width={width}
                ref={viewerRef}
                onMount={zoomExtends}
                dx={dx}
                dy={dy}
              >
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
              </Viewer>
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
  maxInitialDepth: PropTypes.number,
  padding: PropTypes.shape({
    bottom: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number
  })
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
  maxInitialDepth: undefined,
  padding: {
    bottom: 0,
    top: 0,
    left: 0,
    right: 0
  }
}

export default Hierarchy
