import { removeNodeWithAllItsDescendants } from "./removeNodeWithAllItsDescendants";
import data from "./data.json";

const leafId = "14";
const sampleNodeId = "2";

describe("recursiveNodeRemove", () => {
  test("should remove a leaf node", () => {
    const nodesToDrop = removeNodeWithAllItsDescendants(leafId, data);
    expect(nodesToDrop).toEqual([leafId]);
  });
  test("should remove a node with all of its descendants", () => {
    const expectedNodes = [sampleNodeId, "3", "4", "5", "15"].sort();
    const nodesToDrop = removeNodeWithAllItsDescendants(
      sampleNodeId,
      data
    ).sort();
    expect(expectedNodes).toEqual(nodesToDrop);
  });
});
