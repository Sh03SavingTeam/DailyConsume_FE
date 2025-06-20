import React from "react";
import "../styles/customPopUp.css";

function CustomPopUp(props) {
  const { open, close, header, onConfirm } = props;
  return (
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section>
          <header>
            {header}
            <button className="close" onClick={close}>
              &times;
            </button>
          </header>
          <main>{props.children}</main>
          <footer>
            <button className="yes" onClick={onConfirm}>
              확인
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
}

export default CustomPopUp;
