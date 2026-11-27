use library

db.members.insertMany([
    {
        name: "Ravi",
        address: { city: "Chennai", pin: "600001" },
        borrowed: ["Python Basics", "MongoDB Guide"],
        fee: 0
    },
    {
        name: "Kumar",
        address: { city: "Chennai", pin: "600028" },
        borrowed: [],
        fee: 0
    },
    {
        name: "Sita",
        address: { city: "Bangalore", pin: "560001" },
        borrowed: ["MongoDB Guide"],
        fee: 50
    },
    {
        name: "Lakshmi",
        address: { city: "Madurai", pin: "625001" },
        borrowed: ["Python Basics"],
        fee: 120
    }
])

show dbs
show collections


db.members.find(
    { "address.city": "Chennai" },
    { _id: 0, name: 1, address: 1 }
)


db.members.find(
    { borrowed: "MongoDB Guide" },
    { _id: 0, name: 1, borrowed: 1 }
)


db.members.find(
    { borrowed: { $all: ["Python Basics", "MongoDB Guide"] } },
    { _id: 0, name: 1 }
)


db.members.find(
    { borrowed: { $size: 0 } },
    { _id: 0, name: 1 }
)


db.members.updateOne(
    { name: "Sita" },
    { $set: { "address.city": "Chennai" } }
)


db.members.countDocuments({ fee: { $gt: 0 } })

db.members.drop()





use sales

db.orders.insertMany([
    {
        orderId: 1,
        customer: "Arun",
        product: "Laptop",
        category: "Electronics",
        qty: 1,
        price: 55000
    },
    {
        orderId: 2,
        customer: "Divya",
        product: "Mouse",
        category: "Electronics",
        qty: 2,
        price: 500
    },
    {
        orderId: 3,
        customer: "Arun",
        product: "Pen",
        category: "Stationery",
        qty: 10,
        price: 40
    },
    {
        orderId: 4,
        customer: "Meena",
        product: "Notebook",
        category: "Stationery",
        qty: 20,
        price: 10
    },
    {
        orderId: 5,
        customer: "Divya",
        product: "Headphones",
        category: "Electronics",
        qty: 1,
        price: 1500
    },
    {
        orderId: 6,
        customer: "Karthik",
        product: "Chair",
        category: "Furniture",
        qty: 2,
        price: 3500
    }
])


db.orders.aggregate([
    {
        $match: { category: "Electronics" }
    },
    {
        $project: {
            _id: 0,
            orderId: 1,
            product: 1
        }
    }
])


db.orders.aggregate([
    {
        $project: {
            _id: 0,
            orderId: 1,
            customer: 1,
            lineTotal: { $multiply: ["$qty", "$price"] }
        }
    }
])


db.orders.aggregate([
    {
        $group: {
            _id: "$category",
            totalQty: { $sum: "$qty" }
        }
    }
])

db.orders.aggregate([
    {
        $group: {
            _id: "$category",
            revenue: {
                $sum: { $multiply: ["$qty", "$price"] }
            },
            avgPrice: { $avg: "$price" }
        }
    },
    {
        $sort: { revenue: -1 }
    }
])



db.orders.aggregate([
    {
        $group: {
            _id: "$customer",
            totalSpend: {
                $sum: { $multiply: ["$qty", "$price"] }
            }
        }
    },
    {
        $sort: { totalSpend: -1 }
    },
    {
        $limit: 2
    }
])