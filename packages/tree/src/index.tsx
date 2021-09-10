import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useImperativeHandle,
  Ref
} from 'react'
import { stratify, tree, HierarchyNode } from 'd3-hierarchy'
import AutoSizer from 'react-virtualized-auto-sizer'
import defaultSpringConfig from './springConfig'
import Viewer, { RefProps as ViewRefProps } from './View'
import Boxes from './Boxes'
import Links from './Links'
import { SpringConfig } from '@react-spring/web'

export type TreeNode<T> = HierarchyNode<T> & { x: number; y: number }

const defaultPadding = {
  bottom: 0,
  top: 0,
  left: 0,
  right: 0
}

type Props<T> = {
  data: T[]
  Component: any
  onClick?: (e: Event) => void
  boxStyle?: string
  nodeHeight?: number
  nodeWidth?: number
  nodeSpacing?: number
  springConfig?: SpringConfig
  nodeIdField: keyof T & string
  parentIdField: keyof T & string
  maxInitialDepth?: number
  padding?: Partial<typeof defaultPadding>
}

export type RefProps = Ref<{
  collapseAll: () => void
  zoomExtends: () => void
}>

const Hierarchy = <T extends Record<string, unknown>>(
  {
    data,
    onClick = () => undefined,
    Component,
    boxStyle = '',
    nodeHeight: dy = 320,
    nodeWidth: dx = 500,
    nodeSpacing = 150,
    springConfig = defaultSpringConfig,
    nodeIdField,
    parentIdField,
    maxInitialDepth = 2,
    padding
  }: Props<T>,
  ref: RefProps
) => {
  const [isFirstRender, setIsFirstRender] = useState(true)
  const viewerRef = useRef<ViewRefProps>()
  if (isFirstRender) setIsFirstRender(false)

  const [collapsed, setCollapsed] = useState<string[]>([])
  const stratifier = useMemo(
    () =>
      stratify<T>()
        .id((d) => d[nodeIdField] as unknown as string)
        .parentId((d) => d[parentIdField] as unknown as string),
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
    (connections: HierarchyNode<T>) => {
      const descendants = connections.descendants()
      return descendants
        .filter((item) => item.depth >= maxInitialDepth)
        .map((item) => item.id as string)
    },
    [maxInitialDepth]
  )

  const setupHierarchy = useCallback(
    (data: T[], collapsed: string[]) => {
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

      const dropChildren = (element: HierarchyNode<T>) => {
        // this method mutates the connections data!
        // for each collapsed node drop the children
        // @ts-ignore
        if (collapsedSet.has(element.data[nodeIdField])) {
          element.children = undefined
          return
        }
        if (element.children) element.children.forEach(dropChildren)
      }

      if (!limitedConnections) dropChildren(connections)

      // const hierarchyConnections = hierarchy(
      //   limitedConnections || connections
      // );

      return {
        root: tree<T>().nodeSize([dx + nodeSpacing, dy + nodeSpacing])(
          // hierarchyConnections
          connections || limitedConnections
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

  const { root, parents } = useMemo(
    () => setupHierarchy(data, collapsed),
    [data, collapsed, setupHierarchy]
  )

  const collapseAll = useCallback(
    () => setCollapsed(Array.from(parents as unknown as Set<string>)),
    [parents, setCollapsed]
  )

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
                parents={parents as unknown as Set<string>}
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

export default React.forwardRef(Hierarchy)
