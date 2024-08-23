import React from "react";
import "../styles/customPopUp.css";

function CustomPopUp(props) {
  const { open, close, header } = props;
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
            <button className="no" onClick={close}>
              아니오
            </button>
            <button className="yes" onClick={close}>
              예
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
}

export default CustomPopUp;
