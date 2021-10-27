const express = require('express');
require("dotenv").config();
const app = express();
const db = require('./database/db');
const { userValidation } = require("./validations/validations");
const { orderValidation } = require("./validations/validations");
const { validationResult } = require("express-validator");

app.use(express.json());

const port = process.env.PORT || 3003;


// Users route
app.get('/api/users', (req, res, next) => {
    db.query("SELECT * FROM users ORDER BY id ASC")
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.get('/api/users/:id', (req, res, next) => {
    const { id } = req.params;
    const getUser = {
        text : "SELECT * FROM users WHERE id = $1",
        values: [id],
    };
    db
    .query(getUser)
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
})

app.post('/api/users', userValidation, (req, res, next) => {
    const { first_name, last_name, age, active} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const createUser = {
        text: `
        INSERT INTO users (first_name, last_name, age, active)
        VALUES($1,$2,$3,$4)
        RETURNING *
        `,
        values: [first_name, last_name, age, active],
    };
    db
    .query(createUser)
    .then((data) => res.status(201).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.put('/api/users/:id', userValidation, (req,res, next) => {
    const { first_name, last_name, age, active} = req.body;
    const { id } = req.params;

    const updateUser = {
        text: `
        UPDATE users 
        SET first_name=$1, last_name=$2, age=$3, active=$4
        WHERE id=$5
        RETURNING *
        `,
        values: [first_name, last_name, age, active, id],
    }
    db
    .query(updateUser)
    .then((data) => res.status(201).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.delete('/api/users/:id', (req, res, next) => {
    
    const { id } = req.params;

    const deleteUser = {
        text: `
        DELETE FROM users
        WHERE id=$1
        RETURNING *
        `,
        values: [id],
    }
    db
    .query(deleteUser)
    .then((data) => {
        if(!data.rows) {
            return res.status(404).send("The entered user does not exist!!! Please enter a valid user.");
        }
        res.status(201).json(data.rows);
    })
    .catch((err) => res.sendStatus(500));
    
});

// The Orders route

app.get('/api/orders', (req, res, next) => {
   db.query("SELECT * FROM orders")
   .then((data) => res.json(data.rows))
   .catch((err) => res.sendStatus(500));
})

app.get('/api/orders/:id', (req, res, next) => {
    
    const { id } = req.params;

    const getOrder = {
        text: "SELECT * FROM orders WHERE id =$1",
        values: [id],
    }
    db.query(getOrder)
    .then((data) => res.json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.post('/api/orders', orderValidation, (req, res, next) => {
    const { price, date, user_id } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const createOrder = {
        text: `
        INSERT INTO orders (price, date, user_id)
        VALUES($1,$2,$3)
        RETURNING *
        `,
        values: [price, date, user_id],
    };
    db
    .query(createOrder)
    .then((data) => res.status(201).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.put('/api/orders/:id', orderValidation, (req,res, next) => {
    const { price, date, user_id } = req.body;
    const { id } = req.params;

    const updateOrder = {
        text: `
        UPDATE orders 
        set price=$1, date=$2, user_id=$3)
        WHERE id=$4
        RETURNING *
        `,
        values: [price, date, user_id, id],
    }
    db
    .query(updateOrder)
    .then((data) => res.status(201).json(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.delete('/api/orders/:id', (req, res, next) => {
    
    const { id } = req.params;

    const deleteOrder = {
        text: `
        DELETE FROM orders
        WHERE id=$1
        RETURNING *
        `,
        values: [id],
    }
    db
    .query(deleteOrder)
    .then((data) => {
        if(!data.rows) {
            return res.status(404).send("The entered order is incorrect!!! Please enter a valid order.");
        }
        res.status(201).json(data.rows);
    })
    .catch((err) => res.sendStatus(500));
    
});

app.get('/')


app.listen(port, (req,res) => {
    console.log(`Server is listening on PORT ${port}`);
})