import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { stratify, hierarchy, tree } from "d3";
import { AutoSizer } from "react-virtualized";
import Canvas from "./Canvas";

const stratifier = stratify()
  .id((d) => d.name)
  .parentId((d) => d.parent);

const colors = ["#4c4d99", "#f71a7e", "#6f4f6e", "#9fc3d4"];

const Link = ({ element, dx, dy }) => {
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
        !element.data.data.collapsed &&
        element.children.map((child) => (
          <Link
            dx={dx}
            dy={dy}
            element={child}
            key={`${element.data.data.name}-${child.data.data.name}-link`}
          />
        ))}
    </>
  );
};

/** @param {{element, onClick: (e)=>void, dx:number, dy:number }} props*/
const Box = ({ element, onClick, dx, dy }) => {
  const handleClick = useCallback(() => onClick(element.data.id), [
    element,
    onClick,
  ]);

  return (
    <>
      <g
        transform={`translate(${element.x}, ${element.y})`}
        onClick={handleClick}
      >
        <rect
          rx={10}
          x={0 + 20}
          y={0 + 20}
          width={dx - 40}
          height={dy - 40}
          fill={colors[element.data.data.rank]}
        ></rect>
        <text
          x={dx / 2}
          y={dy / 2}
          textAnchor="middle"
          style={{ cursor: "default", userSelect: "none" }}
        >
          {element.data.data.name}
        </text>
      </g>
      {element.children &&
        !element.data.data.collapsed &&
        element.children.map((child) => (
          <Box
            dx={dx}
            dy={dy}
            element={child}
            key={`${element.data.data.name}-${child.data.data.name}`}
            onClick={onClick}
          />
        ))}
    </>
  );
};

const Hierarchy = ({ data, onClick }) => {
  const dx = 150;
  const dy = 100;
  const root = useMemo(() => {
    const connections = stratifier(data);
    const hierarchyConnections = hierarchy(connections);
    return tree().nodeSize([dx, dy])(hierarchyConnections);
  }, [data]);

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
              <Link element={root} dx={dx} dy={dy} />
              <Box element={root} dx={dx} dy={dy} onClick={onClick} />
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
};

export default Hierarchy;
