import { Data } from "./App";
export function recursiveNodeRemove(rootId: string, nodes: Data[]): string[] {
  const children = nodes.filter((node) => node.parentId === rootId);
  return [rootId].concat(
    children.map((child) => recursiveNodeRemove(child.id, nodes)).flat()
  );
}
