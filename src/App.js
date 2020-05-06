import React, { useState, useCallback } from "react";

import "./App.css";
import Hierarchy from "./Hierarchy";

/** @typedef {{
 *  rank: number,
 *  name: string,
 *  parent: string
 * }} DataNode */

const data = [
  { rank: 1, name: "Eve", parent: "" },
  { rank: 1, name: "Cain", parent: "Eve" },
  { rank: 1, name: "po", parent: "Cain" },
  { rank: 1, name: "jim", parent: "Cain" },
  { rank: 1, name: "kelly", parent: "Cain" },
  { rank: 1, name: "Seth", parent: "Eve" },
  { rank: 1, name: "Enos", parent: "Seth" },
  { rank: 1, name: "Noam", parent: "Seth" },
  { rank: 1, name: "joe", parent: "Seth" },
  { rank: 1, name: "peggy", parent: "Seth" },
  { rank: 1, name: "Abel", parent: "Eve" },
  { rank: 1, name: "Awan", parent: "Eve" },
  { rank: 1, name: "Enoch", parent: "Awan" },
  { rank: 1, name: "Azura", parent: "Eve" },
];

const App = () => {
  const [collapsed, setCollapsed] = useState([]);

  const handleClick = useCallback(
    (id) =>
      setCollapsed((state) =>
        state.includes(id)
          ? state.filter((item) => item !== id)
          : state.concat(id)
      ),
    [setCollapsed]
  );

  return (
    <div className="App">
      <Hierarchy data={data} collapsed={collapsed} onClick={handleClick} />
    </div>
  );
};

export default App;
