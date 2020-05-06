import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Link from "./Link";

/**
 * @typedef {import('./Hierarchy').TreeNode} TreeNode
 * @typedef {import("d3").HierarchyNode} HierarchyNode
 * @typedef {import('./App').DataNode} DataNode
 * @param {{
 *  root: TreeNode,
 *  dx:number,
 *  dy:number,
 *  collapsed: string[]
 * }} props */
const Links = ({ root, dx, dy }) => {
  /** @type {{source: TreeNode, target: TreeNode}[]} */
  // @ts-ignore
  const links = useMemo(() => root.links(), [root]);
  // wrapping in a for type compatibility
  return (
    <>
      {links.map(({ source, target }) => (
        <Link
          key={`link-${source.data.id}-${target.data.id}`}
          source={source}
          target={target}
          dx={dx}
          dy={dy}
        />
      ))}
    </>
  );
};

Links.propTypes = {
  root: PropTypes.shape({
    links: PropTypes.func.isRequired,
  }).isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
};
export default Links;
