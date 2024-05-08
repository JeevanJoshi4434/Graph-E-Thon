import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import MenuContainer from "../../Components/MenuContainer";
import {
  AccountBalanceWalletRounded,
  Chat,
  Favorite,
  HomeRounded,
  Settings,
  SummarizeRounded,
} from "@mui/icons-material";
import BannerName from "../../Components/BannerName";
import MenuCard from "../../Components/MenuCard";
import { MenuItems, Items } from "../../Components/Data";
import ItemCard from "../../Components/ItemCard";
import DebitCard from "../../Components/DebitCard";
import SubMenuContainer from "../../Components/SubMenuContainer";
import CartItem from "../../Components/CartItem";
import { useStateValue } from "../../Components/StateProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function Home() {
  const [isMainData, setMainData] = useState(
    Items.filter((element) => element.itemId == "buger01")
  );

  const [{ cart, total }, dispatch] = useStateValue();
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);
  let navigate = useNavigate();
  const myInfo = async () => {
    try {
      const response = await axios.get('/api/v1/me');
      if (response.data.success) {
        console.log(response.data.user)
        setUser(response.data.user)
      } else{
        navigate('/login');
      }
    } catch (error) {
      console.log(error)
      navigate('/login');
    } finally {
      setLoader(false);
    }
  }
  useEffect(() => {
    const menuLi = document.querySelectorAll("#menu li");

    function setMenuActive() {
      menuLi.forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
    }

    menuLi.forEach((n) => n.addEventListener("click", setMenuActive));

    // menu Card active class changer
    const menuCard = document
      .querySelector(".rowContainer")
      .querySelectorAll(".rowMenuCard");

    function setMenuCardActive() {
      menuCard.forEach((n) => n.classList.remove("active"));
      this.classList.add("active");
    }

    menuCard.forEach((n) => n.addEventListener("click", setMenuCardActive));
  }, [isMainData, cart, total, totalPrice]);

  useEffect(() => {
    myInfo();
  }, [])

  const setData = (itemId) => {
    setMainData(Items.filter((element) => element.itemId == itemId));
  };


  return (
    <>
      <div className={`App ${loader ? "hidden" : ""}`}>
        {/* Header section */}
        {user && <Header user={user} />}

        {/* Left menu */}

        <main>
          <div className="mainContainer">
            {/* Banner  */}
            <div className="banner">
              <BannerName name={user?.name} discount={"20"} more={"#"} />
            </div>

            <div className="dishContainer">
              <div className="menuCard">
                <SubMenuContainer />
              </div>

              <div className="rowContainer">
                {MenuItems &&
                  MenuItems.map((data) => (
                    <div key={data.id} onClick={() => setData(data.itemId)}>
                      <MenuCard
                        imgSrc={"https://static.vecteezy.com/system/resources/previews/000/637/367/original/vector-medicine-icon-symbol-sign.jpg"}
                        name={data.name}
                        isActive={data.id == "1" ? true : false}
                      />
                    </div>
                  ))}
              </div>

              <div className="dishItemContainer">
                {isMainData &&
                  isMainData.map((data) => (
                    <ItemCard
                      key={data.id}
                      itemId={data.id}
                      imgSrc={data.imgSrc}
                      name={data.name}
                      ratings={data.ratings}
                      price={data.price}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="rightMenu">


            {!cart ? (
              <div className="addSomeItem">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/food-delivery-37c59.appspot.com/o/Images%2FemptyCart.png?alt=media&token=50b733d4-cdd9-4025-bffe-8efa4066ca24"
                  alt=""
                  className="emptyCart"
                />
              </div>
            ) : (
              <div className="cartCheckOutContianer">
                <div className="cartContainer">
                  <SubMenuContainer />

                  <div className="cartItems">
                    {cart &&
                      cart.map((data) => (
                        <CartItem
                          key={data.id}
                          itemId={data.id}
                          name={data.name}
                          imgSrc={data.imgSrc}
                          qty={"4"}
                          price={data.price}
                        />
                      ))}
                  </div>
                </div>
                <div className="totalSection">
                  <h3>Total</h3>
                  <p>
                    <span>₹ </span> {total}
                  </p>
                </div>
                <button className="checkOut">Check Out</button>
              </div>
            )}
          </div>
        </main>
      </div>
      {
        loader && <BigScreenLoader text={"Loading..."} desc={""} />
      }
    </>
  );
}

export const BigScreenLoader = ({ text = "", desc = "" }) => {
    return (
        <div style={{ position: 'absolute', height: '100vh', width: '100vw', zIndex: '9999', backgroundColor: "rgba(255,255,255,1)", alignItems: 'center', justifyContent: 'center' }} className='z-[9999] d-flex'>
            <div style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} className='d-flex flex-col justify-center items-center'>
                <CircularProgress size={19} />
                <p className='font-bold text-lg text-black'>{text}</p>
                <p className='text-sm text-black'>{desc}</p>
            </div>
        </div>
    )
}
export default Home;