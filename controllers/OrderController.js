import Order from '../models/Order.js';


    /* get all orders (only admin) */
    async function get_orders(req, res) {
        try {
            const orders = await Order.find();
            res.status(200).json({
                type: "success",
                orders
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    }

    /* get monthly income (only admin)*/
    async function get_income(req, res) {
        const date = new Date();
        const lastMonth =  new Date(date.setMonth(date.getMonth()-1));
        const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

        try {
            const income = await Order.aggregate([
                { $match: { 
                    createdAt: { 
                            $gte: previousMonth
                        },
                    },
                },
                { 
                    $project:{ 
                        month: { $month: "$createdAt" },
                        sales: "$amount",
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: "$sales" }
                    }
                },  
            ]);
            res.status(200).json({
                type: "success",
                income
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    }

    /* get user's orders */
   /* get user's orders */
async function get_order(req, res) {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                type: "error",
                message: "No orders found for this user"
            });
        }

        res.status(200).json({
            type: "success",
            orders
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong, please try again",
            err
        });
    }
}


    /* add order */
    async function create_order(req, res) {
        const newOrder = new Order(req.body);
        try {
            const savedOrder = await newOrder.save();
            res.status(201).json({
                type: "success",
                message: "Order created successfully",
                savedOrder
            })
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    }

    /* update order */
   /* update order */
async function update_order(req, res) {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, // Ensure this correctly targets the order's ID
            { $set: req.body }, // Apply updates from req.body
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({
                type: "error",
                message: "Order not found"
            });
        }

        res.status(200).json({
            type: "success",
            message: "Order updated successfully",
            updatedOrder
        });
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong, please try again",
            err
        });
    }
}


    /* delete order */
    async function delete_order(req, res) {
        try {
            await Order.findOneAndDelete(req.params.id);
            res.status(200).json({
                type: "success",
                message: "Order has been deleted successfully"
            });
        } catch (err) {
            res.status(500).json({
                type: "error",
                message: "Something went wrong please try again",
                err
            })
        }
    }


export {get_income,get_order,get_orders,delete_order,update_order,create_order};