import { Data } from "./App";

export function removeNodeWithAllItsDescendants(
  rootId: string,
  nodes: Data[]
): string[] {
  const nodesToDrop = [rootId];
  const descendants = [rootId];
  while (descendants.length > 0) {
    const id = descendants.pop();
    for (const node of nodes) {
      if (node.parentId === id) {
        nodesToDrop.push(node.id);
        descendants.push(node.id);
      }
    }
  }
  return nodesToDrop;
}
