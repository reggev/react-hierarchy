import React, { useCallback } from "react";
import PropTypes from "prop-types";

const colors = ["#4c4d99", "#f71a7e", "#6f4f6e", "#9fc3d4"];

/**
 * @typedef {import('./Hierarchy').TreeNode} TreeNode
 * @typedef {import("d3").HierarchyNode} HierarchyNode
 * @typedef {import('./App').DataNode} DataNode
 * @param {{
 *  element: TreeNode,
 *  parents: Set<string>,
 *  onClick: (e)=>void,
 *  dx:number,
 *  dy:number,
 *  collapsed: string[]
 * }} props */
const Box = ({ element, parents, onClick, dx, dy, collapsed }) => {
  /** @type {HierarchyNode} */
  const { data: node } = element;
  /** @type {{data: DataNode}} */
  const { data } = node;
  const handleClick = useCallback(() => onClick(node.id), [node, onClick]);
  return (
    <>
      <g transform={`translate(${element.x}, ${element.y})`}>
        <rect
          rx={10}
          x={0 + 20}
          y={0 + 20}
          width={dx - 40}
          height={dy - 40}
          fill={colors[1]}
        ></rect>
        <text
          x={dx / 2}
          y={dy / 2}
          textAnchor="middle"
          style={{ cursor: "default", userSelect: "none" }}
        >
          {data.name}
        </text>
        {parents.has(node.id) && (
          <g
            onClick={handleClick}
            transform={`translate(${dx / 2}, ${dy - 20})`}
          >
            <circle cx={0} cy={0} r={10} fill={colors[2]} />
            <text x={0} y={5} textAnchor="middle">
              +
            </text>
          </g>
        )}
      </g>
      {element.children &&
        !collapsed.includes(node.id) &&
        element.children.map((child, ii) => (
          <Box
            dx={dx}
            dy={dy}
            element={child}
            collapsed={collapsed}
            parents={parents}
            key={`${data.name}-${child.data.data.name}`}
            onClick={onClick}
          />
        ))}
    </>
  );
};

Box.propTypes = {
  parents: PropTypes.instanceOf(Set).isRequired,
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
  onClick: PropTypes.func.isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  collapsed: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Box;
