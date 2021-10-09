import React, { useCallback, useState, useRef, useMemo } from "react";
import Hierarchy, { RefProps } from "@reggev/react-hierarchy";
import "./App.css";
import Card from "./Card";
import styles from "./styles.module.scss";
import rawData from "./data.json";
import AutoSizer from "react-virtualized-auto-sizer";
import { removeNodeWithAllItsDescendants } from "./removeNodeWithAllItsDescendants";

export type Data = {
  rank: number;
  id: string;
  parentId: string;
  name: string;
};

const App = () => {
  const [data, setData] = useState(rawData);
  const rootNode = useMemo(() => data.find((node) => !node.parentId), [data]);
  const hierarchyRef = useRef<RefProps>();

  const handleClick = useCallback(
    (id) => {
      setData((state) => {
        const nextRanks = state.map((item) => {
          if (item.id !== id) return item;
          const nextRank = item.rank - 1;

          if (id === rootNode?.id) {
            return { ...item, rank: Math.max(nextRank, 0) };
          }

          return { ...item, rank: nextRank };
        });

        const nodeToRemove = nextRanks.find((node) => node.rank < 0);

        if (nodeToRemove) {
          const idsToRemove = new Set(
            removeNodeWithAllItsDescendants(nodeToRemove.id, state)
          );
          return nextRanks.filter((item) => !idsToRemove.has(item.id));
        } else {
          return nextRanks;
        }
      });
    },
    [setData]
  );

  const onCollapse = useCallback(() => {
    if (hierarchyRef.current) {
      hierarchyRef.current.collapseAll();
    }
  }, [hierarchyRef]);

  const zoomExtends = useCallback(() => {
    if (hierarchyRef.current) hierarchyRef.current.zoomExtends();
  }, [hierarchyRef]);

  return (
    <div className="App">
      <div style={{ flex: 1 }}>
        <AutoSizer>
          {({ height, width }) =>
            height === 0 || width === 0 ? null : (
              <Hierarchy
                maxInitialDepth={1}
                data={data}
                onClick={handleClick}
                Component={Card}
                nodeIdField="id"
                parentIdField="parentId"
                ref={hierarchyRef as React.Ref<RefProps>}
                padding={{ top: 600 }}
                height={height}
                width={width}
              />
            )
          }
        </AutoSizer>
      </div>
      <div className={styles.buttonsPanel}>
        <button className={styles.panelButton} onClick={onCollapse}>
          collapse all
        </button>
        <button className={styles.panelButton} onClick={zoomExtends}>
          zoom extends
        </button>
      </div>
    </div>
  );
};

export default App;
