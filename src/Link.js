import React from "react";
import PropTypes from "prop-types";

/**
 * @typedef {import('./Hierarchy').TreeNode} TreeNode
 * @typedef {import("d3").HierarchyNode} HierarchyNode
 * @typedef {import('./App').DataNode} DataNode
 * @param {{
 *  source: TreeNode,
 *  target: TreeNode
 *  dx:number,
 *  dy:number,
 * }} props */
const Link = ({ source, target, dx, dy }) => {
  const { x: parentX, y: parentY } = source;
  const { x, y } = target;

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
    <path
      transform={`translate(${dx / 2},${dy / 2})`}
      stroke="black"
      fill="none"
      strokeWidth={2}
      d={`
      M ${x} ${y}
      L ${x} ${y + h * yrvs}
      C  ${x} ${y + h * yrvs + r * yrvs} ${x} ${y + h * yrvs + r * yrvs} ${
        x + r * xrvs
      } ${y + h * yrvs + r * yrvs}
      L ${x + w * xrvs + r * xrvs} ${y + h * yrvs + r * yrvs}
      C ${parentX}  ${y + h * yrvs + r * yrvs} ${parentX}  ${
        y + h * yrvs + r * yrvs
      } ${parentX} ${parentY - h * yrvs}
      L ${parentX} ${parentY}
      `}
    />
  );
};

Link.propTypes = {
  source: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  target: PropTypes.shape({}),
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
};

export default Link;
