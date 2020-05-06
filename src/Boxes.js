import React, { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";
import Card from "./Card";
import { animated, useTransition } from "react-spring";

/**
 * @typedef {import('./Hierarchy').TreeNode} TreeNode
 * @typedef {import("d3").HierarchyNode} HierarchyNode
 * @typedef {import('./App').DataNode} DataNode
 * @param {{
 *  root: TreeNode,
 *  parents: Set<string>,
 *  onClick: (e)=>void,
 *  onCollapse: (e) => void,
 *  dx:number,
 *  dy:number,
 *  collapsed: string[]
 * }} props */
const Boxes = ({ root, dx, dy, parents, onClick, onCollapse }) => {
  const elements = useMemo(() => root.descendants(), [root]);
  const transitions = useTransition(elements, (item) => item.data.data.name, {
    from: {
      opacity: 0,
    },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  return (
    <>
      {transitions.map(({ item: { data, x, y }, key, props }) => (
        <animated.g style={props} transform={`translate(${x}, ${y})`} key={key}>
          <foreignObject
            width={dx}
            height={dy}
            className={styles.foreignObject}
            xmlns="http://www.w3.org/1999/xhtml"
          >
            <div className={styles.contentBox} style={{ height: dy - 20 }}>
              <Card data={data.data} onClick={onClick} />
            </div>
            {parents.has(data.id) && (
              <button onClick={(e) => onCollapse(data.id)} />
            )}
          </foreignObject>
        </animated.g>
      ))}
    </>
  );
};

Boxes.propTypes = {
  root: PropTypes.shape({
    descendants: PropTypes.func.isRequired,
  }).isRequired,
  dx: PropTypes.number.isRequired,
  dy: PropTypes.number.isRequired,
  parents: PropTypes.instanceOf(Set),
  onClick: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
};

export default Boxes;
