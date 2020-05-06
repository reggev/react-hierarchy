import React, { useCallback } from "react";
import PropTypes from "prop-types";

const colors = ["#4c4d99", "#f71a7e", "#6f4f6e", "#9fc3d4"];

/** @param {{element, parents: Set<string>, onClick: (e)=>void, dx:number, dy:number, collapsed: string[] }} props*/
const Box = ({ parents, element, onClick, dx, dy, collapsed }) => {
  const handleClick = useCallback(() => onClick(element.data.id), [
    element,
    onClick,
  ]);
  // console.log({ element, parents });
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
          {element.data.data.name}
        </text>
        {parents.has(element.data.id) && (
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
        !collapsed.includes(element.data.id) &&
        element.children.map((child, ii) => (
          <Box
            dx={dx}
            dy={dy}
            element={child}
            collapsed={collapsed}
            parents={parents}
            key={`${element.data.data.name}-${child.data.data.name}`}
            onClick={onClick}
          />
        ))}
    </>
  );
};

Box.propTypes = {};

export default Box;
