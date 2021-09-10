import React, { useCallback, useState, useRef } from "react";
import Hierarchy from "@reggev/react-hierarchy-tree";
// import 'react-hierarchy/dist/index.css'
import "./App.css";
import Card from "./Card";
import styles from "./styles.module.scss";
import rawData from "./data.json";

const App = () => {
  const [data, setData] = useState(rawData);

  const hierarchyRef = useRef();
  const handleClick = useCallback(
    (id) => {
      setData((state) => {
        const tmp = state
          .map((item) =>
            item.name === id ? { ...item, rank: item.rank + 1 } : item
          )
          .filter((item) => item.rank <= 5);
        const parents = new Set(tmp.map((item) => item.name));

        return tmp.filter(
          (item) => parents.has(item.CustomParentId) || !item.CustomParentId
        );
      });
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
      <Hierarchy
        maxInitialDepth={1}
        data={data}
        onClick={handleClick}
        Component={Card}
        nodeIdField="customId"
        parentIdField="CustomParentId"
        ref={hierarchyRef}
        padding={{ top: 600 }}
      />
    </div>
  );
};

export default App;
