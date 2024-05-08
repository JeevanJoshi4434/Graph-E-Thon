import {
  BarChart,
  SearchRounded,
  ShoppingCartRounded,
} from "@mui/icons-material";
import React, { useEffect } from "react";
import { useStateValue } from "./StateProvider";

function Header({ user }) {
  const [{ cart }, dispatch] = useStateValue();

  useEffect(() => {
    const toggleIcon = document.querySelector(".toggleMenu");
    toggleIcon.addEventListener("click", () => {
      document.querySelector(".rightMenu").classList.toggle("active");
    });
  }, []);

  return (
    <header>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/food-delivery-37c59.appspot.com/o/Images%2Flogo.png?alt=media&token=fc228623-ef27-4af4-8ea5-b9ebeeaf47dc"
        alt=""
        className="logo"
      />

      <div className="inputBox">
        <SearchRounded className="searchIcon" />
        <input type="text" placeholder="Search" />
      </div>

      <div className="shoppingCart">
        <ShoppingCartRounded className="cart" />
        <div className={`${!cart ? "noCartItem" : "cart_content"}`}>
          <p>{cart ? cart.length : ""}</p>
        </div>
      </div>

      <div className="profileContainer">
        <div className="imgBox">
          <img
            src="https://img.freepik.com/free-icon/user_318-563642.jpg"
            alt=""
          />
        </div>
        <h2 className="userName">{user.name}</h2>
      </div>

      <div className="toggleMenu">
        <BarChart className="toggleIcon" />
      </div>
    </header>
  );
}

export default Header;
