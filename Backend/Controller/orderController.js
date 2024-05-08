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

exports.reduceQuantityFromInventory = async () => {
    try {
        const { productDetail, userID } = req.body;
        const shop = await User.findById(userID);
        const { quantity, _id } = productDetail;
        const inventory = shop.inventory;
        const index = inventory.findIndex((item) => item._id.toString() === _id.toString());
        inventory[index].quantity = inventory[index].quantity - quantity;
        await shop.save();
        res.status(200).json({
            success: true,
            inventory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getRecommendationMedicines = async () => {
    try {

        const shops = await User.find({ isMedical: true });
        const medicines = [];
        for (let i = 0; i < shops.length; i++) {
            const shop = shops[i];
            const shopMedicines = shop.medicines;
            medicinesAvailable = [];
            for (let j = 0; j < shopMedicines.length; j++) {
                const medicine = shopMedicines[j];
                if (medicine.stock > 0) {
                    medicinesAvailable.push(medicine);
                }
            }
            const result = {
                shopName: shop.name,
                medicines: medicinesAvailable,
                shopID: shop._id
            }
            medicines.push(result);
        }
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