import React, { useMemo } from 'react'
import {
  // animated, useTransition,
  SpringConfig
} from '@react-spring/web'
import { TreeNode } from './index'
// type ComponentProps<T> = {
//   data: T;
//   onClick: (e: Event) => void;
//   id: string;
//   onCollapse: (e: Event) => void;
//   showExpand: boolean;
//   isExpanded: boolean;
// };

type Props<T> = {
  root: TreeNode<T>
  parents: Set<string>
  onClick: (e: Event) => void
  onCollapse: (e: Event) => void
  dx: number
  dy: number
  collapsed: string[]
  Component: any
  boxStyle?: string
  springConfig: SpringConfig
}

const Boxes = <T extends Record<string, unknown>>({
  root,
  dx,
  dy,
  parents,
  onClick,
  onCollapse,
  Component
}: // springConfig,
Props<T>) => {
  const elements = useMemo(() => root.descendants(), [root])
  // const transitions = useTransition<T>(
  //   elements,
  //   (item) => item.data.data[nodeIdField],
  //   {
  //     from: {
  //       opacity: 0,
  //     },
  //     enter: (child) => ({
  //       opacity: 1,
  //       transform: `translate(${child.x}, ${child.y})`,
  //     }),
  //     update: (child) => ({
  //       opacity: 1,
  //       transform: `translate(${child.x}, ${child.y})`,
  //     }),
  //     leave: { opacity: 0 },
  //     config: springConfig,
  //   }
  // );
  return (
    <>
      {/* {transitions.map(({ item: { data, children }, key, props }) => ( */}
      {/* <animated.g style={props} transform={props.transform} key={key}> */}
      {elements.map((el) => (
        <foreignObject
          key={`box-${el.data.id}`}
          style={{
            overflow: 'visible'
          }}
          transform={`translate(${el.x}, ${el.y})`}
          width={dx}
          height={dy}
          xmlns='http://www.w3.org/1999/xhtml'
        >
          <Component
            data={el.data.data}
            onClick={onClick}
            id={el.data.id as string}
            onCollapse={onCollapse}
            showExpand={parents.has(el.data.id as string)}
            isExpanded={(el.children?.length ?? 0) > 0}
          />
        </foreignObject>
      ))}
      {/* </animated.g> 
      ))} */}
    </>
  )
}

Boxes.propTypes = {}
Boxes.defaultProps = {
  boxStyle: ''
}

export default Boxes
