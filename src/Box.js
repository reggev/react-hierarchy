import React, { useCallback } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import styles from "./styles.module.scss";

const colors = ["#4c4d99", "#f71a7e", "#6f4f6e", "#9fc3d4"];

/**
 * @typedef {import('./Hierarchy').TreeNode} TreeNode
 * @typedef {import("d3").HierarchyNode} HierarchyNode
 * @typedef {import('./App').DataNode} DataNode
 * @param {{
 *  element: TreeNode,
 *  parents: Set<string>,
 *  onClick: (e)=>void,
 *  onCollapse: (e) => void,
 *  dx:number,
 *  dy:number,
 *  collapsed: string[]
 * }} props */
const Box = ({ element, parents, onCollapse, onClick, dx, dy, collapsed }) => {
  /** @type {HierarchyNode} */
  const { data: node } = element;
  /** @type {{data: DataNode}} */
  const { data } = node;

  const handleClick = useCallback(() => onCollapse(node.id), [
    node,
    onCollapse,
  ]);
  return (
    <>
      <g transform={`translate(${element.x}, ${element.y})`}>
        <foreignObject
          width={dx}
          height={dy}
          className={styles.foreignObject}
          xmlns="http://www.w3.org/1999/xhtml"
        >
          <div className={styles.contentBox} style={{ height: dy - 20 }}>
            <Card data={data} onClick={onClick} />
          </div>
        </foreignObject>
        {parents.has(node.id) && (
          <g
            onClick={handleClick}
            transform={`translate(${dx / 2}, ${dy + 0})`}
          >
            <circle
              cx={0}
              cy={0}
              r={10}
              fill={element.children ? colors[2] : colors[3]}
            />
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
            onClick={onClick}
            onCollapse={onCollapse}
            key={`${data.name}-${child.data.data.name}`}
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
  onCollapse: PropTypes.func.isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  collapsed: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Box;
