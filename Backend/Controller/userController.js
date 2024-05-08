const User = require("../Models/user");
const sendToken = require("../utils/jwttoken");
var uniqid = require("uniqid");
exports.registerUser = async (req, res) => {
    try {

        const { name, email, password, ShopName, isMedical, latitude, longitude } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            ShopName,
            isMedical,
            location: {
                latitude,
                longitude
            }
        });
        sendToken(user, 201, res);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

exports.me = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
}

exports.loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide email and password"
        })
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        })
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        })
    }
    sendToken(user, 200, res);
}

function addIdToMedicine(medicine) {
    return {
        ...medicine,
        _id: uniqid(`${medicine.name}-`)
    };
}


exports.addMedicine = async (req, res) => {
    try {

        let { medicines } = req.body;

        if (!medicines) {
            return res.status(400).json({
                success: false,
                message: "Please provide medicines"
            })
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid user"
            })
        }
        console.log(medicines);
        medicines = medicines.map(addIdToMedicine);
        user.medicines = [...user.medicines, ...medicines];

        await user.save();

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.log(error);
    }

}

exports.removeMedicine = async (req, res) => {

    const { medicines } = req.body;

    if (!medicines) {
        return res.status(400).json({
            success: false,
            message: "Please provide medicines"
        })
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid user"
        })
    }

    user.medicines = user.medicines.filter(m => !medicines.includes(m));

    await user.save();

    res.status(200).json({
        success: true,
        user
    })

}



// Function to calculate distance between two points using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
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

// Function to find the nearest medical shops with the specified medicine available
async function findNearbyMedicalShops(userLat, userLon, medicineName, maxDistance) {
    const medicalShops = await User.find({ isMedical: true });
    const nearbyShops = [];

    for (const shop of medicalShops) {
        const distance = getDistance(userLat, userLon, shop.latitude, shop.longitude);
        if (distance <= maxDistance && shop.medicines.find(med => med.Name.toLowerCase() === medicineName.toLowerCase())) {
            nearbyShops.push({ name: shop.name, latitude: shop.latitude, longitude: shop.longitude, distance });
        }
    }

    // If no shops found within the max distance, find the nearest one
    if (nearbyShops.length === 0) {
        let minDistance = Infinity;
        let nearestShop = null;
        for (const shop of medicalShops) {
            const distance = getDistance(userLat, userLon, shop.latitude, shop.longitude);
            if (distance < minDistance) {
                minDistance = distance;
                nearestShop = shop;
            }
        }
        if (nearestShop) {
            return [{ name: nearestShop.name, latitude: nearestShop.latitude, longitude: nearestShop.longitude, distance: minDistance >= 1 ? minDistance.toFixed(1) : Math.round(minDistance * 1000), inKiloMeter: minDistance >= 1 }];
        }
    }

    return nearbyShops;
}



exports.findMedicines = async (req, res) => {
    try {
        const { userLat, userLon, medicineName, maxDistance } = req.query;
        const nearbyShops = await findNearbyMedicalShops(userLat, userLon, medicineName, maxDistance);
        if (!nearbyShops) {
            return res.status(404).json({
                success: false,
                message: "No shops found"
            })
        }
        res.status(200).json({
            success: true,
            nearbyShops
        })
    } catch (error) {

    }

}