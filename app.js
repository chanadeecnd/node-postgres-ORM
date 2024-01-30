const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');

// Connecting to database.
const sequelize = new Sequelize('User', 'postgres', 'admin1234' , {
    host: 'localhost',
    dialect: 'postgres',
})


// ---Create schema.---
// User schema 
const User = sequelize.define('users', {
    user_id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        field: 'user_id'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'email'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password'
    }
}, {})

// Address schema
const Address = sequelize.define('address', {
    address_id: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true,
        field: 'address_id'
    },
    address_text: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'address_text'
    }
}, {})

// ----------------------------------------

// Relation of table
User.hasMany(Address);
Address.belongsTo(User);

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/api/users', async (req,res) => {
    const users = await User.findAll();
    return res.status(200).json(users);
})

app.post('/api/users', async (req,res) => {
    const userData = req.body;
    const addressDat = req.body.addresses;
    try {
        const user = await User.create(userData);
        return res.json(user)
    } catch (error) {
        console.log(error)
        return res.json({
            message: 'Insert error',
            error: error.errors.map(e => e.message)
        })
    }
})


app.listen(port, async () => {
    await sequelize.sync( {force: false} )
    console.log(`Server is running on port ${port}`);
})
