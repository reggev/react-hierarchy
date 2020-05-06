import React, { useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { stratify, hierarchy, tree } from "d3";
import { AutoSizer } from "react-virtualized";
import Canvas from "./Canvas";
import Box from "./Box";
import Link from "./Link";

/** @typedef {import('d3-hierarchy').HierarchyNode} HierarchyNode */
/** @typedef {HierarchyNode & {x: number, y:number }} TreeNode */

const stratifier = stratify()
  .id((d) => d.name)
  .parentId((d) => d.parent);

/** @param {{data: any[], onClick: (e)=>void }} props */
const Hierarchy = ({ data, onClick }) => {
  const [collapsed, setCollapsed] = useState([]);

  const handleClick = useCallback(
    (id) =>
      setCollapsed((state) =>
        state.includes(id)
          ? state.filter((item) => item !== id)
          : state.concat(id)
      ),
    [setCollapsed]
  );
  const dx = 500;
  const dy = 320;
  const nodeSpacing = 150;
  const { root, parents } = useMemo(() => {
    const parents = new Set(data.map((item) => item.parent));
    const collapsedSet = new Set(collapsed);

    const connections = stratifier(data);
    /** @param {HierarchyNode} element */
    const dropChildren = (element) => {
      // this method mutates the connections data!
      // for each collapsed node drop the children
      if (collapsedSet.has(element.data.name)) {
        element.children = null;
        return;
      }
      if (element.children) element.children.forEach(dropChildren);
    };
    dropChildren(connections);
    const hierarchyConnections = hierarchy(connections);
    return {
      root: tree().nodeSize([dx + nodeSpacing, dy + nodeSpacing])(
        hierarchyConnections
      ),
      parents,
    };
  }, [data, collapsed]);
  console.log(root.descendants());
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <AutoSizer>
        {({ width, height }) =>
          width === 0 || height === 0 ? null : (
            <Canvas height={height} width={width}>
              <Link element={root} dx={dx} dy={dy} collapsed={collapsed} />
              <Box
                parents={parents}
                element={root}
                dx={dx}
                dy={dy}
                onClick={onClick}
                onCollapse={handleClick}
                collapsed={collapsed}
              />
            </Canvas>
          )
        }
      </AutoSizer>
    </div>
  );
};

Hierarchy.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      parent: PropTypes.string.isRequired,
      rank: PropTypes.number.isRequired,
    })
  ).isRequired,
  onClick: PropTypes.func,
};

Hierarchy.defaultProps = {
  onClick: () => {},
};

export default Hierarchy;
