import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { stratify, hierarchy, tree } from "d3";
import { AutoSizer } from "react-virtualized";
import Canvas from "./Canvas";
import Box from "./Box";
import Link from "./Link";

const stratifier = stratify()
  .id((d) => d.name)
  .parentId((d) => d.parent);

/** @param {{data: any, onClick: (e)=>void, collapsed: string[] }} props*/
const Hierarchy = ({ data, onClick, collapsed }) => {
  const dx = 150;
  const dy = 100;
  const { root, parents } = useMemo(() => {
    const parents = new Set(data.map((item) => item.parent));
    const collapsedSet = new Set(collapsed);

    const connections = stratifier(data);
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
      root: tree().nodeSize([dx, dy])(hierarchyConnections),
      parents,
    };
  }, [data, collapsed]);

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        background: "papayawhip",
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
  collapsed: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Hierarchy;
