const express = require("express");
const router = express.Router();
const { registerUser, loginUser, addMedicine, removeMedicine, findMedicines, me, updateLocation } = require("../Controller/userController");
const { isAuthenticatedUser } = require("../Middleware/auth");
const { createOrder, updateStatus, singleOrderDetails, getShopOrders, getOrders, updateDelivery, reduceQuantityFromInventory, getRecommendationMedicines, recommendMedicalShops } = require("../Controller/orderController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route('/add/medicine').post( isAuthenticatedUser, addMedicine);
router.route('/remove/medicine').post( isAuthenticatedUser, removeMedicine);
router.route('/get/medicines').get(findMedicines);
router.route('/me').get(isAuthenticatedUser, me);
router.route('/update/location').post(isAuthenticatedUser, updateLocation);

// orderController 
router.route('/create/order').post( isAuthenticatedUser, createOrder);
router.route('/update/order/status/:id').put( isAuthenticatedUser, updateStatus);
router.route('/get/order/:id').get( isAuthenticatedUser, singleOrderDetails);
router.route('/get/orders/admin').get( isAuthenticatedUser, getShopOrders);
router.route('/get/orders/user').get(isAuthenticatedUser, getOrders);
router.route('/place/order').post(isAuthenticatedUser, updateDelivery);
router.route('/reduce/inventory').post(isAuthenticatedUser, reduceQuantityFromInventory);
router.route('/get/recommendation').get(getRecommendationMedicines);
router.route('/get/nearby/recommendation').get(isAuthenticatedUser, recommendMedicalShops);


module.exports = router;