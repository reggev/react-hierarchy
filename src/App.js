import React, { useCallback } from "react";

import "./App.css";
import Hierarchy from "./Hierarchy";

/** @typedef {{
 *  rank: number,
 *  name: string,
 *  parent: string
 * }} DataNode */

const data = [
  { rank: 1, name: "Eve", parent: "" },
  { rank: 2, name: "Cain", parent: "Eve" },
  { rank: 3, name: "po", parent: "Cain" },
  { rank: 4, name: "jim", parent: "Cain" },
  { rank: 1, name: "kelly", parent: "Cain" },
  { rank: 0, name: "Seth", parent: "Eve" },
  { rank: 1, name: "Enos", parent: "Seth" },
  { rank: 5, name: "Noam", parent: "Seth" },
  { rank: 2, name: "joe", parent: "Seth" },
  { rank: 1, name: "peggy", parent: "Seth" },
  { rank: 3, name: "Abel", parent: "Eve" },
  { rank: 4, name: "Awan", parent: "Eve" },
  { rank: 2, name: "Enoch", parent: "Awan" },
  { rank: 1, name: "Azura", parent: "Eve" },
];

const App = () => {
  const handleClick = useCallback((item) => {
    console.log(item);
  }, []);

  return (
    <div className="App">
      <Hierarchy data={data} onClick={handleClick} />
    </div>
  );
};

export default App;
