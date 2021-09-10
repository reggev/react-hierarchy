import React, { useMemo, Fragment } from "react";
import Link from "./Link";
import { TreeNode } from "./index";
import { SpringConfig } from "@react-spring/web";

type Props<T> = {
  root: TreeNode<T>;
  dx: number;
  dy: number;
  collapsed: string[];
  springConfig: SpringConfig;
};

const Links = <T extends { id: string }>({
  root,
  dx,
  dy,
  springConfig,
}: Props<T>) => {
  const links = useMemo(() => root.links(), [root]);

  return (
    <>
      {links.map(({ source, target }) => (
        <Link
          key={`link-${source.data.id}-${target.data.id}`}
          dx={dx}
          dy={dy}
          source={source as TreeNode<T>}
          target={target as TreeNode<T>}
          springConfig={springConfig}
        />
      ))}
    </>
  );
};

export default Links;
