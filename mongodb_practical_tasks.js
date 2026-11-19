use libraryDB

db.books.drop()

db.books.insertMany([
  { _id: 1, title: "Database Systems", author: "Elmasri", copies: 5, status: "available" },
  { _id: 2, title: "Operating Systems", author: "Galvin", copies: 3, status: "available" },
  { _id: 3, title: "Computer Networks", author: "Tanenbaum", copies: 0, status: "unavailable" },
  { _id: 4, title: "Old Almanac 1990", author: "Unknown", copies: 0, status: "unavailable" },
  { _id: 5, title: "Torn Notes", author: "Unknown", copies: 0, status: "damaged" },
  { _id: 6, title: "Water-damaged Atlas", author: "Unknown", copies: 1, status: "damaged" }
])

print("TASK 1: Add copies of Operating Systems")

db.books.updateOne(
  { title: "Operating Systems" },
  { $inc: { copies: 2 } }
)

printjson(
  db.books.find({ title: "Operating Systems" })
)

print("TASK 2: Reduce copies of Database Systems")

db.books.updateOne(
  { title: "Database Systems" },
  { $inc: { copies: -1 } }
)

printjson(
  db.books.find({ title: "Database Systems" })
)

print("TASK 3: Upsert Artificial Intelligence - First Run")

db.books.updateOne(
  { title: "Artificial Intelligence" },
  {
    $set: {
      author: "Russell",
      copies: 4,
      status: "available"
    }
  },
  { upsert: true }
)

printjson(
  db.books.find({ title: "Artificial Intelligence" })
)

print("TASK 3: Upsert Artificial Intelligence - Second Run")

db.books.updateOne(
  { title: "Artificial Intelligence" },
  {
    $set: {
      author: "Russell",
      copies: 4,
      status: "available"
    }
  },
  { upsert: true }
)

printjson(
  db.books.find({ title: "Artificial Intelligence" })
)

print("TASK 4: Update Computer Networks")

db.books.updateOne(
  { title: "Computer Networks" },
  {
    $set: { status: "available" },
    $inc: { copies: 3 }
  }
)

printjson(
  db.books.find({ title: "Computer Networks" })
)

print("TASK 5: Delete Old Almanac 1990")

db.books.deleteOne(
  { title: "Old Almanac 1990" }
)

print("TASK 6: Delete Damaged or Lost Books")

db.books.deleteMany({
  status: { $in: ["damaged", "lost"] }
})

print("TASK 7: Final Library Data")

printjson(
  db.books.find(
    {},
    { _id: 0, title: 1, copies: 1 }
  ).sort({ title: 1 }).toArray()
)

use cafeDB

db.orders.drop()

db.orders.insertMany([
  { _id: 1, customer: "Meena", item: "Coffee", qty: 2, price: 120, status: "delivered" },
  { _id: 2, customer: "Ravi", item: "Sandwich", qty: 1, price: 180, status: "delivered" },
  { _id: 3, customer: "Meena", item: "Sandwich", qty: 2, price: 180, status: "cancelled" },
  { _id: 4, customer: "Karthik", item: "Coffee", qty: 3, price: 120, status: "delivered" },
  { _id: 5, customer: "Ravi", item: "Coffee", qty: 1, price: 120, status: "delivered" },
  { _id: 6, customer: "Meena", item: "Cake", qty: 1, price: 250, status: "delivered" },
  { _id: 7, customer: "Karthik", item: "Cake", qty: 2, price: 250, status: "pending" }
])

print("TASK 1: Count Orders By Status")

printjson(
  db.orders.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]).toArray()
)

print("TASK 2: Delivered Orders")

printjson(
  db.orders.aggregate([
    {
      $match: { status: "delivered" }
    },
    {
      $project: {
        _id: 0,
        customer: 1,
        item: 1,
        qty: 1
      }
    }
  ]).toArray()
)

print("TASK 3: Revenue Per Item")

printjson(
  db.orders.aggregate([
    {
      $match: { status: "delivered" }
    },
    {
      $group: {
        _id: "$item",
        totalQty: { $sum: "$qty" },
        revenue: { $sum: { $multiply: ["$qty", "$price"] } }
      }
    },
    {
      $sort: { revenue: -1 }
    }
  ]).toArray()
)

print("TASK 4: Spend Per Customer")

printjson(
  db.orders.aggregate([
    {
      $match: { status: "delivered" }
    },
    {
      $group: {
        _id: "$customer",
        orders: { $sum: 1 },
        totalSpend: { $sum: { $multiply: ["$qty", "$price"] } }
      }
    },
    {
      $sort: { totalSpend: -1 }
    }
  ]).toArray()
)

print("TASK 5: Best Customer")

printjson(
  db.orders.aggregate([
    {
      $match: { status: "delivered" }
    },
    {
      $group: {
        _id: "$customer",
        orders: { $sum: 1 },
        totalSpend: { $sum: { $multiply: ["$qty", "$price"] } }
      }
    },
    {
      $sort: { totalSpend: -1 }
    },
    {
      $limit: 1
    },
    {
      $project: {
        _id: 1,
        totalSpend: 1
      }
    }
  ]).toArray()
)