// src/components/CurrentPlayerRing.jsx
import React from "react";
import './index.less'

const CurrentPlayerRing = ({ show }) => {
  return (
    <>
      {show && (
        <div className="playerRing w-full absolute left-0 top-[80px] px-2 ">
          <img
            width={120}
            style={{ objectFit: "fill" }}
            src={`/assets/role/ring.webp`}
          />
        </div>
      )}
    </>
  );
};

export default CurrentPlayerRing;
