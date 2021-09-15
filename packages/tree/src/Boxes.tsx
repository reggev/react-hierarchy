import React, { useMemo } from 'react'
import { animated, useTransition, SpringConfig } from '@react-spring/web'
import { TreeNode, ComponentProps } from './index'

type Props<T> = {
  root: TreeNode<T>
  parents: Set<string>
  onClick: (id: string) => void
  toggleCollapse: (id: string) => void
  dx: number
  dy: number
  collapsed: string[]
  Component: React.ComponentType<ComponentProps<T>>
  springConfig: SpringConfig
}

function Boxes<T extends Record<string, unknown>>({
  root,
  dx,
  dy,
  parents,
  onClick,
  toggleCollapse,
  Component,
  springConfig
}: Props<T>) {
  const elements = useMemo(() => root.descendants(), [root])
  const transitions = useTransition(elements, {
    from: {
      opacity: 0,
      transform: undefined
    },
    enter: (item) => ({
      opacity: 1,
      transform: `translate(${item.x},${item.y})`
    }),
    update: (item) => ({
      opacity: 1,
      transform: `translate(${item.x},${item.y})`
    }),
    leave: { opacity: 0 },
    config: springConfig,
    keys: (item) => `box-${item.data.id}`
  })

  return (
    <>
      {transitions(({ transform, ...props }, item) => (
        <animated.g style={props} transform={transform}>
          <foreignObject
            style={{ overflow: 'visible' }}
            width={dx}
            height={dy}
            xmlns='http://www.w3.org/1999/xhtml'
          >
            <Component
              data={item.data.data as unknown as T}
              onClick={onClick}
              id={item.data.id as string}
              toggleCollapse={toggleCollapse}
              hasChildren={parents.has(item.data.id as string)}
              isExpanded={(item.children?.length ?? 0) > 0}
            />
          </foreignObject>
        </animated.g>
      ))}
    </>
  )
}

export default Boxes
