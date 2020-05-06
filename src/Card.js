import React from "react";
import PropTypes from "prop-types";
import styles from "./styles.module.scss";

const Card = ({ data, onClick }) => (
  <>
    <header className={styles.nodeHeaderContainer} data-node-rank={data.rank}>
      <h1 className={styles.nodeHeader}>{data.name}</h1>
    </header>
    <p>this is a very long and exciting story</p>
    <footer className={styles.nodeFooter} data-node-rank={data.rank}>
      <p>this is the end of the card</p>
    </footer>
  </>
);

Card.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func,
};

export default Card;
