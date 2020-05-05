import React, { useState, useCallback } from "react";

import "./App.css";
import Hierarchy from "./Hierarchy";

const connections = [
  { rank: 1, name: "Eve", parent: "" },
  { rank: 1, name: "Cain", parent: "Eve" },
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
  const [data, setData] = useState(connections);

  const handleClick = useCallback((id) => {
    setData((state) =>
      state.map((item) =>
        item.name === id ? { ...item, collapsed: !item.collapsed } : item
      )
    );
  }, []);

  return (
    <div className="App">
      <Hierarchy data={data} onClick={handleClick} />
    </div>
  );
};

export default App;
