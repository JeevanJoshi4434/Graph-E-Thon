import { AddRounded, Favorite, StarRounded } from "@mui/icons-material";
import React, { useState } from "react";
import { actionType } from "./reducer";
import { useStateValue } from "./StateProvider";
import { Items } from "./Data";
import { useEffect } from "react";
let cartData = [];

function ItemCard({ itemId, data,shopId,addToCart=(medicine)=>{}, imgSrc, name, price, shopName, provider, distance=0,inKilo, specific=false }) {
  const [isFavourite, setFavourite] = useState(false);
  const [{}, dispatch] = useStateValue();
  const [isCart, setCart] = useState(null);

  useEffect(() => {
    if (isCart) {
      cartData.push(isCart);
      dispatch({
        type: actionType.SET_CART,
        cart: cartData,
      });
    }
  }, [isCart]);


  return (
    <div className="itemCard"  id={itemId}>
      <div
        className={`isFavourite ${isFavourite ? "active" : ""}`}
        onClick={() => setFavourite(!isFavourite)}
      >
        <Favorite />
      </div>
      <div className="itemContent" style={{minHeight:"191.2px",height:"191.2px",maxHeight:"191.2px"}}>
        <h3 className="itemName">{name}</h3>
        {!specific && <p className=" text-xs" >{shopName} - {distance > 0 ? `${distance.toFixed(2)} km`: `${Math.round(distance * 1000)} m`} away</p>}
        {specific && <p className=" text-xs" >{shopName} - {distance} {inKilo ? "km" : "m"} away</p>}
        <p className="text-[8px] text-gray-500">{provider}</p>
        <div className="bottom">
          <div className="ratings">
            <h3 className="price">
              <span>₹ </span>
              {price}
            </h3>
          </div>
          <i
            className="addToCart"
            onClick={addToCart}
          >
            <AddRounded />
          </i>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
