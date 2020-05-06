import React from "react";
import PropTypes from "prop-types";

/**
 * @typedef {import('./Hierarchy').TreeNode} TreeNode
 * @typedef {import("d3").HierarchyNode} HierarchyNode
 * @typedef {import('./App').DataNode} DataNode
 * @param {{
 *  element: TreeNode,
 *  dx:number,
 *  dy:number,
 *  collapsed: string[]
 * }} props */
const Link = ({ element, dx, dy, collapsed }) => {
  /** @type {HierarchyNode} */
  const { data: node } = element;
  /** @type {{data: DataNode}} */
  const { data } = node;
  const { x, y } = element;
  const { x: parentX, y: parentY } = element.parent
    ? element.parent
    : { x: 0, y: 0 };
  const xrvs = parentX - x < 0 ? -1 : 1;
  const yrvs = parentY - y < 0 ? -1 : 1;
  const rdef = 35;
  const rInitial =
    Math.abs(parentX - x) / 2 < rdef ? Math.abs(parentX - x) / 2 : rdef;
  const r =
    Math.abs(parentY - y) / 2 < rInitial ? Math.abs(parentY - y) / 2 : rInitial;
  const h = Math.abs(parentY - y) / 2 - r;
  const w = Math.abs(parentX - x) - r * 2;
  return (
    <>
      {element.parent && (
        <path
          transform={`translate(${dx / 2},${dy / 2})`}
          stroke="black"
          fill="none"
          strokeWidth={1}
          d={`
      M ${element.x} ${element.y}
      L ${element.x} ${element.y + h * yrvs}
      C  ${element.x} ${element.y + h * yrvs + r * yrvs} ${element.x} ${
            element.y + h * yrvs + r * yrvs
          } ${element.x + r * xrvs} ${element.y + h * yrvs + r * yrvs}
      L ${element.x + w * xrvs + r * xrvs} ${element.y + h * yrvs + r * yrvs}
      C ${element.parent.x}  ${element.y + h * yrvs + r * yrvs} ${
            element.parent.x
          }  ${element.y + h * yrvs + r * yrvs} ${element.parent.x} ${
            element.parent.y - h * yrvs
          }
      L ${element.parent.x} ${element.parent.y}
      `}
        />
      )}
      {element.children &&
        !collapsed.includes(node.id) &&
        element.children.map((child) => (
          <Link
            dx={dx}
            dy={dy}
            collapsed={collapsed}
            element={child}
            key={`${data.name}-${child.data.data.name}-link`}
          />
        ))}
    </>
  );
};

Link.propTypes = {
  element: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        data: PropTypes.shape({
          data: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      }).isRequired
    ),
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      data: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  collapsed: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Link;
