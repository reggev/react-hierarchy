import React, { useCallback } from "react";
import styles from "./styles.module.scss";
import { ComponentProps } from "@reggev/react-hierarchy-tree";
import { Data } from "./App";
import PlusIcon from "../assets/plus.svg?component";
import MinusIcon from "../assets/minus.svg?component";

console.log(PlusIcon);
const Card = ({
  id,
  data,
  onClick,
  toggleCollapse,
  hasChildren,
  isExpanded,
}: ComponentProps<Data>) => {
  const handleClick = useCallback(() => {
    onClick(id);
  }, [onClick, id]);

  const handleCollapse = useCallback(() => {
    toggleCollapse(id);
  }, [toggleCollapse, id]);

  return (
    <div className={styles.node} data-rank={data.rank}>
      <header className={styles.nodeHeaderContainer} data-node-rank={data.rank}>
        <h1 className={styles.nodeHeader}>{data.name}</h1>
      </header>
      <p>this is a very long and exciting story</p>
      <footer className={styles.nodeFooter} data-node-rank={data.rank}>
        <p>this is the end of the card</p>
      </footer>
      <button className={styles.nodeRankButton} onClick={handleClick}>
        {data.rank === 0 ? "remove node" : "reduce rank"}
      </button>
      {hasChildren && (
        <button
          className={styles.toggleCollapseButton}
          onClick={handleCollapse}
        >
          {isExpanded ? <MinusIcon /> : <PlusIcon />}
        </button>
      )}
    </div>
  );
};

export default Card;
