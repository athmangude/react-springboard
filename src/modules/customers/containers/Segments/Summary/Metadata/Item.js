/* eslint-disable jsx-a11y/href-no-hash */
import React from "react";
import PropTypes from "prop-types";
import MwambaBar from "SharedComponents/mwamba-bar";

const colors = [
  "#f39f02",
  "#2574a6",
  "#ae84a7",
  "#52bf8a",
  "#f46800",
  "#7986cb",
  "#ffca28",
  "#ef5350",
  "#42a5f5",
  "#1de8b5"
];

const Item = ({ metadata, name }) => {
  const total = metadata.reduce(
    (accumulator, currentValue) => accumulator + currentValue.count,
    0
  );
  return (
    <div style={{ width: "100%", margin: "0 0 20px" }}>
      <span
        style={{
          color: "#3d4553",
          fontSize: 13,
          fontWeight: "bold",
          textTransform: "capitalize"
        }}
      >
        {name}
      </span>
      {metadata.length
        ? metadata.map((bar, index) => (
            <MwambaBar
              key={bar.name}
              bar={bar}
              total={total}
              barColor={colors[index % colors.length]}
            />
          ))
        : null}
    </div>
  );
};

Item.propTypes = {
  metadata: PropTypes.object,
  name: PropTypes.string
};

export default Item;
