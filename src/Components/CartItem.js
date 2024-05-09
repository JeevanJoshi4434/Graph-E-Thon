import { AddRounded, Delete, RemoveRounded } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { actionType } from "./reducer";
import { useStateValue } from "./StateProvider";
let cartItems = [];

function CartItem(props) {
  const { itemId, name, imgSrc, price, cart, setCart, data, removeFromCart = () => { }, setTotalPrice } = props;
  const [qty, setQty] = useState(props.qty);
  const [itemPrice, setItemPrice] = useState(parseInt(qty) * parseFloat(price));

  const print = () => {
    console.log(data);
  }


  return (
    <div className="cartItem" id={itemId}>
      <div className="imgBox">
        <img src={imgSrc} alt="" />
      </div>
      <div className="itemSection">
        <h2 className="itemName">{name}</h2>
        <p className="text-[10px] text-gray-500">{data.shopName}</p>
        <div className="itemQuantity">
          <span>x {qty}</span>
          <Delete onClick={removeFromCart} />
        </div>
      </div>
      <p className="itemPrice">
        <span className="dolorSign">₹</span>{" "}
        <span className="itemPriceValue">{itemPrice}</span>
      </p>
    </div>
  );
}

export default CartItem;
