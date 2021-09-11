import React, { useCallback } from "react";
import styles from "./styles.module.scss";
import { ComponentProps } from "@reggev/react-hierarchy-tree";
import { Data } from "./App";
const Card = ({
  id,
  data,
  onClick,
  onCollapse,
  showExpand,
  isExpanded,
}: ComponentProps<Data>) => {
  const handleClick = useCallback(() => {
    onClick(id);
  }, [onClick, id]);

  const handleCollapse = useCallback(() => {
    onCollapse(id);
  }, [onCollapse, id]);

  return (
    <div className={styles.contentBox}>
      <header
        className={styles.nodeHeaderContainer}
        data-node-rank={data.rank}
        onClick={handleClick}
      >
        <h1 className={styles.nodeHeader}>{data.name}</h1>
      </header>
      <p>this is a very long and exciting story</p>
      <footer className={styles.nodeFooter} data-node-rank={data.rank}>
        <p>this is the end of the card</p>
      </footer>
      {showExpand && (
        <button className={styles.expandButton} onClick={handleCollapse}>
          {isExpanded ? "-" : "+"}
        </button>
      )}
    </div>
  );
};

export default Card;
