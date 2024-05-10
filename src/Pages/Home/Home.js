import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import BannerName from "../../Components/BannerName";
import MenuCard from "../../Components/MenuCard";
import { MenuItems, Items } from "../../Components/Data";
import ItemCard from "../../Components/ItemCard";
import SubMenuContainer from "../../Components/SubMenuContainer";
import CartItem from "../../Components/CartItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Skeleton } from "@mui/material";
import MapBox from "../Map/MapBox";
import FullScreenModal from "../../Components/FullScreenModal";
import Checkout from "../Checkout/Checkout";

function Home() {
  const [isMainData, setMainData] = useState(
    Items.filter((element) => element.itemId == "buger01")
  );

  const [cart, setCart] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalP, setTotalP] = useState(0);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const addToCart = (owner, medicine) => {
    setLoading(true);
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item._id === medicine._id);

    if (existingItem) {
      // If the medicine is already in the cart, increase its quantity
      if (existingItem.quantity < 5)
        existingItem.quantity++;
    } else {
      // If the medicine is not in the cart, add it
      updatedCart.push({ ...medicine, quantity: 1, shopId: owner.id, shopName: owner.shopName, distance: owner.distance });
    }

    // Update cart
    setCart(updatedCart);

    // Update total count
    setTotalCount(updatedCart.reduce((total, item) => total + item.quantity, 0));

    // Update total price
    setTotalP(updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0));

    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  const removeFromCart = (medicineId) => {
    // Remove medicine from cart
    setLoading(true);
    const updatedCart = cart.filter(item => item._id !== medicineId);

    // Update cart
    setCart(updatedCart);

    // Update total count
    setTotalCount(updatedCart.reduce((total, item) => total + item.quantity, 0));

    // Update total price
    setTotalP(updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0));
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);
  const [recommendedData, setRecommendedData] = useState({
    nearby: [],
    all: []
  })
  let navigate = useNavigate();
  const myInfo = async () => {
    try {
      const response = await axios.get('/api/v1/me');
      if (response.data.success) {
        setUser(response.data.user);
        getNearbyRecommendedData(response.data.user);
      } else {
        navigate('/login');
      }
    } catch (error) {
      
      navigate('/login');
    } finally {
      setLoader(false);
    }
  }

  const getNearbyRecommendedData = async (user) => {
    try {
      const response = await axios.get(`/api/v1/get/nearby/recommendation?userLat=${user?.location?.latitude}&userLon=${user?.location?.longitude}`);
      if (response.data.success) {
        setRecommendedData({ recommendedData, nearby: response.data.recommendedShops })

      } 
    } catch (error) {
      if(error.response?.status !== 404)
      navigate('/login');
    }
  }

  const getRecommendedData = async () => {
    try {
      const response = await axios.get('/api/v1/get/recommendation');
      if (response.data.success) {
        setRecommendedData({ recommendedData, all: response.data.medicines })
      }
    } catch (error) {
      if(error.response.status !== 404)
      navigate('/login');
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
  }, [isMainData, cart, totalP, totalPrice]);

  useEffect(() => {
    myInfo();
    getRecommendedData();
  }, [])

  const setData = (itemId) => {
    setMainData(Items.filter((element) => element.itemId == itemId));
  };

  const print = () => {
    console.log(cart, totalP);
  }
  const [searchResult, setSearchResult] = useState([]);

  return (
    <>
      <div className={`App ${loader ? "hidden" : ""}`}>
        {/* Header section */}
        {user && <Header setResult={setSearchResult} result={searchResult} user={user} />}

        {/* Left menu */}

        <main>
          <div className="mainContainer">
            {/* Banner  */}
            <div className="banner">
              <BannerName name={user?.name} discount={"20"} more={"#"} />
            </div>

            <div className="dishContainer">
              {searchResult.length > 0 &&
                <>
                  <p className="text-md font-bold">Search Result</p>
                  <div className="dishItemContainer grid grid-cols-4">
                    {searchResult?.length > 0 &&
                      searchResult?.map((i) => {
                        return i.medicines.map((data) => (
                          <ItemCard
                            imgSrc={"https://static.vecteezy.com/system/resources/previews/000/637/367/original/vector-medicine-icon-symbol-sign.jpg"}
                            data={i.medicines}
                            key={data._id}
                            inKilo={i.inKiloMeter}
                            specific
                            itemId={data._id}
                            name={data.name}
                            price={data.price}
                            shopId={i.id}
                            shopName={i.shopName}
                            provider={i.name}
                            distance={i.distance}
                            setTotalPrice={setTotalP}
                            addToCart={() => { addToCart(i, data) }}
                          />
                        ))
                      })
                    }
                  </div>
                </>
              }
              <p className="text-md font-bold">Nearby Shops Location</p>
              {recommendedData.nearby?.length > 0 && user && <MapBox user={user} locations={recommendedData.nearby} />}
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
              <p className="text-sm">Nearby Medicines <span className="text-xs text-gray-500">(within 50km range)</span></p>
              <div className="dishItemContainer grid grid-cols-4">
                {recommendedData.nearby?.length > 0 &&
                  recommendedData.nearby?.map((i) => {
                    return i.medicines.map((data) => (
                      <ItemCard
                        imgSrc={"https://static.vecteezy.com/system/resources/previews/000/637/367/original/vector-medicine-icon-symbol-sign.jpg"}
                        data={i.medicines}
                        key={data._id}
                        itemId={data._id}
                        name={data.name}
                        price={data.price}
                        shopId={i.id}
                        shopName={i.shopName}
                        provider={i.name}
                        distance={i.distance}
                        setTotalPrice={setTotalP}
                        pills={data.pillsPerBox}
                        lat={i.latitude}
                        lng={i.longitude}
                        addToCart={() => { addToCart(i, data) }}
                      />
                    ))
                  })
                }
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
                    {loading && <div className="flex gap-2 flex-col w-full">
                      <Skeleton variant="rounded" height={60} />
                      <Skeleton variant="rounded" height={60} />
                      <Skeleton variant="rounded" height={60} />
                      <Skeleton variant="rounded" height={60} />
                    </div>}
                    {!loading &&
                      cart.map((data) => (
                        <CartItem
                          key={data._id}
                          itemId={data._id}
                          name={data.name}
                          data={data}
                          imgSrc={"https://static.vecteezy.com/system/resources/previews/000/637/367/original/vector-medicine-icon-symbol-sign.jpg"}
                          qty={data.quantity}
                          price={data.price}
                          setCart={setCart}
                          cart={cart}
                          removeFromCart={() => { removeFromCart(data._id) }}
                        />
                      ))}
                  </div>
                </div>
                <div className="totalSection">
                  <h3>Total</h3>
                  <p>
                    <span>₹ </span> {totalP}
                  </p>
                </div>
                <button onClick={() => setShow(true)} className="checkOut">Check Out</button>
              </div>
            )}
          </div>
        </main>
      </div>
      <FullScreenModal children={<Checkout cart={cart} setCart={setCart} totalP={totalP} setTotalP={setTotalP} />} show={show} setShow={setShow} />
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