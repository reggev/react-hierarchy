import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { animated, useTransition, SpringConfig } from "@react-spring/web";
import styles from "./styles.module.css";
import { TreeNode } from "./index";

type ComponentProps<T> = {
  data: T;
  onClick: (e: Event) => void;
  id: string;
  onCollapse: (e: Event) => void;
  showExpand: boolean;
  isExpanded: boolean;
};

type Props<T> = {
  root: TreeNode<T>;
  parents: Set<string>;
  onClick: (e: Event) => void;
  onCollapse: (e: Event) => void;
  dx: number;
  dy: number;
  collapsed: string[];
  Component: any;
  boxStyle?: string;
  springConfig: SpringConfig;
  nodeIdField: string;
};

const Boxes = <T extends object>({
  root,
  dx,
  dy,
  parents,
  onClick,
  onCollapse,
  Component,
  boxStyle,
  springConfig,
  nodeIdField,
}: Props<T>) => {
  const parentSet = useMemo(() => new Set(parents), [parents]);
  const elements = useMemo(() => root.descendants(), [root]);
  // const transitions = useTransition<T>(
  //   elements,
  //   (item) => item.data.data[nodeIdField],
  //   {
  //     from: {
  //       opacity: 0,
  //     },
  //     enter: (child) => ({
  //       opacity: 1,
  //       transform: `translate(${child.x}, ${child.y})`,
  //     }),
  //     update: (child) => ({
  //       opacity: 1,
  //       transform: `translate(${child.x}, ${child.y})`,
  //     }),
  //     leave: { opacity: 0 },
  //     config: springConfig,
  //   }
  // );
  return (
    <>
      {/* {transitions.map(({ item: { data, children }, key, props }) => ( */}
      {/* <animated.g style={props} transform={props.transform} key={key}> */}
      {elements.map((el) => (
        <foreignObject
          width={dx}
          height={dy}
          style={{ overflow: "visible" }}
          xmlns="http://www.w3.org/1999/xhtml"
        >
          <div
            className={`${styles.contentBox} ${boxStyle}`}
            style={{ height: dy - 20 }}
          >
            <Component
              data={el.data}
              onClick={onClick}
              id={el.id as string}
              onCollapse={onCollapse}
              showExpand={parents.has(el.id as string)}
              isExpanded={!!el.children}
            />
          </div>
        </foreignObject>
      ))}
      {/* </animated.g> 
      ))} */}
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
  Component: PropTypes.elementType.isRequired,
  nodeIdField: PropTypes.string.isRequired,
  boxStyle: PropTypes.string,
  springConfig: PropTypes.object,
};
Boxes.defaultProps = {
  boxStyle: "",
};

export default Boxes;
