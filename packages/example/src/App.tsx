import React, { useCallback, useState, useRef } from "react";
import Hierarchy, { RefProps } from "@reggev/react-hierarchy-tree";
import "./App.css";
import Card from "./Card";
import styles from "./styles.module.scss";
import rawData from "./data.json";
import AutoSizer from "react-virtualized-auto-sizer";

export type Data = {
  rank: number;
  customId: string;
  CustomParentId: string;
  name: string;
};

const App = () => {
  const [data, setData] = useState(rawData);

  const hierarchyRef = useRef<RefProps>();
  if (hierarchyRef.current) {
    hierarchyRef.current;
  }
  const handleClick = useCallback(
    (id) => {
      console.log(id);
      // setData((state) => {
      //   const tmp = state
      //     .map((item) =>
      //       item.name === id ? { ...item, rank: item.rank + 1 } : item
      //     )
      //     .filter((item) => item.rank <= 5);
      //   const parents = new Set(tmp.map((item) => item.name));

      //   return tmp.filter(
      //     (item) => parents.has(item.CustomParentId) || !item.CustomParentId
      //   );
      // });
    },
    [setData]
  );

  const onCollapse = useCallback(() => {
    if (hierarchyRef.current) {
      // @ts-ignore
      hierarchyRef.current.collapseAll();
    }
  }, [hierarchyRef]);

  const zoomExtends = useCallback(() => {
    // @ts-ignore
    if (hierarchyRef.current) hierarchyRef.current.zoomExtends();
  }, [hierarchyRef]);

  return (
    <div className="App">
      <div className={styles.buttonsPanel}>
        <button onClick={onCollapse}>collapse all</button>
        <button onClick={zoomExtends}>zoom extends</button>
      </div>
      <div style={{ flex: 1 }}>
        <AutoSizer>
          {({ height, width }) =>
            height === 0 || width === 0 ? null : (
              <Hierarchy
                maxInitialDepth={3}
                data={data}
                onClick={handleClick}
                Component={Card}
                nodeIdField="customId"
                parentIdField="CustomParentId"
                ref={hierarchyRef as React.Ref<RefProps>}
                padding={{ top: 600 }}
                height={height}
                width={width}
              />
            )
          }
        </AutoSizer>
      </div>
    </div>
  );
};

export default App;
