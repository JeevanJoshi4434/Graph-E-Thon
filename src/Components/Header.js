import {
  BarChart,
  SearchRounded,
  ShoppingCartRounded,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useStateValue } from "./StateProvider";
import axios from "axios";
import { MDBBtn } from "mdb-react-ui-kit";

function Header({ user,result,setResult }) {
  const [{ cart }, dispatch] = useStateValue();

  useEffect(() => {
    const toggleIcon = document.querySelector(".toggleMenu");
    toggleIcon.addEventListener("click", () => {
      document.querySelector(".rightMenu").classList.toggle("active");
    });
  }, []);

  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState(null);
  const find = async () => {
    try {
      if (search.replace(" ", "").length <= 0) return;
      const resp = await axios.get(`/api/v1/get/medicines?userLat=${user.location.latitude}&userLon=${user.location.longitude}&medicineName=${search}&maxDistance=50 `)
      if (resp.data.success){
        setSearchData(resp.data.nearbyShops);
        setResult(resp.data.nearbyShops);
        console.log(resp.data.nearbyShops);
      } 

    } catch (error) {

    }
  }
  return (
    <header>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/food-delivery-37c59.appspot.com/o/Images%2Flogo.png?alt=media&token=fc228623-ef27-4af4-8ea5-b9ebeeaf47dc"
        alt=""
        className="logo"
      />

      <div className="inputBox">
        <SearchRounded className="searchIcon" />
        <input type="text" placeholder="Search" onChange={(e) => { setSearch(e.target.value);}} value={search} />
        <MDBBtn onClick={find} className="searchBtn" color="primary" >Find</MDBBtn>
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
