import React from 'react'
import { useSpring, animated, SpringConfig } from '@react-spring/web'
import { TreeNode } from './index'

type Props<T> = {
  source: TreeNode<T>
  target: TreeNode<T>
  dx: number
  dy: number
  springConfig: SpringConfig
}

const Link = <T extends Record<string, any>>({
  source,
  target,
  dx,
  dy,
  springConfig
}: Props<T>) => {
  const { x: parentX, y: parentY } = source
  const { x: childX, y: childY } = target
  /**
   * referenced with great thanks from:
   * https://bl.ocks.org/bumbeishvili/09a03b81ae788d2d14f750afe59eb7de
   * */
  const xrvs = parentX - childX < 0 ? -1 : 1
  const yrvs = parentY - childY < 0 ? -1 : 1
  const rdef = 35
  const rInitial =
    Math.abs(parentX - childX) / 2 < rdef
      ? Math.abs(parentX - childX) / 2
      : rdef
  const r =
    Math.abs(parentY - childY) / 2 < rInitial
      ? Math.abs(parentY - childY) / 2
      : rInitial
  const h = Math.abs(parentY - childY) / 2 - r
  const w = Math.abs(parentX - childX) - r * 2

  const props = useSpring({
    to: {
      d: `
      M ${childX} ${childY}
      L ${childX} ${childY + h * yrvs}
      C  ${childX} ${childY + h * yrvs + r * yrvs} ${childX} ${
        childY + h * yrvs + r * yrvs
      } ${childX + r * xrvs} ${childY + h * yrvs + r * yrvs}
      L ${childX + w * xrvs + r * xrvs} ${childY + h * yrvs + r * yrvs}
      C ${parentX}  ${childY + h * yrvs + r * yrvs} ${parentX}  ${
        childY + h * yrvs + r * yrvs
      } ${parentX} ${parentY - h * yrvs}
      L ${parentX} ${parentY}
      `
    },
    config: springConfig
  })

  return (
    <animated.path
      transform={`translate(${dx / 2},${dy / 2})`}
      stroke='black'
      fill='none'
      strokeWidth={2}
      d={props.d}
    />
  )
}

export default Link
