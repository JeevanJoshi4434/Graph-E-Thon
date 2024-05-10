const Order = require("../Models/order");
const User = require("../Models/user");
exports.createOrder = async (req, res) => {
    try {
        const { medicineDetails, shopID, location, address, total } = req.body;
        const shop = await User.findById(shopID);
        const order = await Order.create({
            user: req.user.id,
            medicines: medicineDetails,
            shopDetails: {
                name: shop.name,
                address: shop.address,
                location: {
                    latitude: shop.location.latitude,
                    longitude: shop.location.longitude
                }
            },
            total: total,
            address: address,
            OTP: Math.floor(100000 + Math.random() * 900000),
            location: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            status: 0,
            date: Date.now(),
            shopID
        })

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        order.status = req.body.status;
        order.updates.push(req.body.update);
        await order.save();
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}

exports.getShopOrders = async (req, res) => {
    try {
        const orders = await Order.find({ shopID: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }
}

exports.singleOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            });
        }
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateDelivery = async () => {
    try {
        const { orderID, OTP } = req.body;
        const order = await Order.findById(orderID);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (order.OTP !== OTP) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        order.OTP = null;
        order.status = 5;
        await order.save();
        res.status(200).json({
            success: true,
        });

    } catch (error) {

    }
}

exports.reduceQuantityFromInventory = async (req, res) => {
    try {
        const { productDetail } = req.body;
        const shop = await User.findById(req.user.id);

        if (!shop) {
            return res.status(404).json({ success: false, message: 'Shop not found' });
        }

        const { quantity, _id } = productDetail;
        const inventory = shop.medicines;
        const index = inventory.findIndex(item => item._id.toString() === _id.toString());

        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in inventory' });
        }
        shop.medicines[index].quantity = quantity;
        const updatedInventory = shop.medicines;
        const updateStore = await User.findByIdAndUpdate(req.user.id, {
            $set: {
                medicines: updatedInventory
            }
        })
        res.status(200).json({
            success: true,
            inventory: quantity // Return the updated inventory
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getRecommendationMedicines = async (req,res) => {
    try {

        const shops = await User.find({ isMedical: true });
        const medicines = [];
        for (let i = 0; i < shops.length; i++) {
            const shop = shops[i];
            const shopMedicines = shop.medicines;
            medicinesAvailable = [];
            for (let j = 0; j < shopMedicines.length; j++) {
                const medicine = shopMedicines[j];
                if (medicine.quantity > 0) {
                    medicinesAvailable.push(medicine);
                }
            }
            const result = {
                shopName: shop.ShopName,
                owner: shop.name,
                medicines: medicinesAvailable,
                shopID: shop._id.toString(),
                }
            medicines.push(result);
        }
        console.log(medicines);
        res.status(200).json({
            success: true,
            medicines
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
}


// Function to calculate distance between two points using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
    console.log(lat1,lat2,lon1,lon2);
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Function to find nearby medical shops within a specified range and their available medicines
async function recommendNearbyMedicalShops(userLat, userLon, maxDistance) {
    try {

        const medicalShops = await User.find({ isMedical: true });
        const nearbyShops = [];
        console.log(medicalShops)
        for (const shop of medicalShops) {
            const distance = getDistance(userLat, userLon, shop.location.latitude, shop.location.longitude);
            console.log(distance);
            if (distance <= maxDistance) {
                nearbyShops.push({
                    name: shop.name,
                    shopName: shop.ShopName,
                    latitude: shop.latitude,
                    longitude: shop.longitude,
                    distance,
                    medicines: shop.medicines.filter(med => med.quantity > 0),
                    id: shop._id
                });
            }
        }

        return nearbyShops;

    } catch (e) {
        console.error(e);
        return null;
    }
}

// Recommendation route to recommend nearby medical shops and their available medicines within a range of 80km
exports.recommendMedicalShops = async (req, res) => {
    try {
        const { userLat, userLon } = req.query;
        const maxDistance = 150; // Maximum distance in kilometers

        const recommendedShops = await recommendNearbyMedicalShops(userLat, userLon, maxDistance);
        if (!recommendedShops || recommendedShops.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No medical shops found within the specified range."
            });
        }

        res.status(200).json({
            success: true,
            recommendedShops
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
}
