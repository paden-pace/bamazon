
var inquirer = require("fs");
var inquirer = require("inquirer");
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Texas2015",
    database: "bamazon"
});

var allProducts = [];

var bamMan = function () {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, results){
        if(err) throw err;
        //console.log("test");
        for (var i = 0; i <results.length; i++){
            allProducts.push(results[i].product_name);
        };
    });
    console.log("Hello Manager, what would you like to do?");
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Products for Sale", "View Low Inventory","Add To Inventory", "Add New Product", "exit"],
            name: "selection"
        }
    ]).then(function(user) {
        switch (user.selection) {
            case "Products for Sale":
                seeItems();
                //options();
                break;
                
            case "View Low Inventory":
                lowInventory();
                //options();
                break;
            
            case "Add To Inventory":
                addInventory();
                //options();
                break;

            case "Add New Product":
                newProduct();
                //options();
                break;


            case "exit":
                break;
        }
    });
};

var seeItems = function() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, results){
        if(err) throw err;
        //console.log("test");
        for (var i = 0; i <results.length; i++){
            console.log("---------------------------------");
            console.log("Product Name: " + results[i].product_name);
            console.log("Product Department: " + results[i].department_name);
            console.log("Price: $" + results[i].price);
            console.log("Left-in-Stock: " + results[i].stock_quantity);
            console.log("---------------------------------");
        };
    });
};

var lowInventory = function(){
    console.log("---------------------------------");
    console.log("Low Inventory: ")
    connection.query('SELECT * FROM products', function(err, results){
        if(err) throw err;
        for (var i = 0; i <results.length; i++){
            if(results[i].stock_quantity <= 5){
                console.log("Product: " + results[i].product_name);
                console.log("In Stock: " + results[i].stock_quantity);
                //console.log("Count: " + results[i].count(artist));
                console.log("---------------------------------");
            };
        };
    });
};

var addInventory = function(){
    console.log("Add Inventory")
    inquirer.prompt([
        {
            type: "list",
            message: "What would item would you like to increase stock?",
            choices: allProducts,
            name: "addItem"
        },
        {
            type: "input",
            message: "How many would you like to add?",
            name: "addQuant"
        }
    ]).then(function(man) {
        console.log(man.addItem);
        connection.query('Select * FROM products WHERE product_name = ?', [man.addItem], function (err,results){
            var trueQuant = results[0].stock_quantity;
            var trueQuantInt = parseInt(trueQuant, 10);
            var addQuantInt = parseInt(man.addQuant, 10);
            console.log("Request: " + addQuantInt);
            console.log("Amount in Stock: " + trueQuantInt);
            var newQuant = (trueQuantInt + addQuantInt);
            connection.query('UPDATE products SET ? WHERE ?', [
                {stock_quantity: newQuant},
                {product_name: man.addItem}
                ], function(err, results){
                    console.log("New Quantity in Stock is: " + newQuant);
                    if(err) throw err;
                });
        });
    });
};



var newProduct = function(){
    console.log("Add Product")
    inquirer.prompt([
        {
            type: "input",
            message: "What product would you like to add?",
            name: "product"
        },
        {
            type: "input",
            message: "What department will that be added to?",
            name: "dept"
        },
        {
            type: "input",
            message: "What is the price?",
            name: "price"
        },
        {
            type: "input",
            message: "How many would you like to add?",
            name: "quant"
        }
    ]).then(function(addition) {
        var additionQuantInt = parseInt(addition.quant);
        var additionPriceInt = parseInt(addition.price).toFixed(2);
        connection.query('INSERT INTO products SET ?',
        {product_name: addition.product, department_name: addition.dept, price: additionPriceInt, stock_quantity: additionQuantInt},
        function(err, results){
            console.log("New Product " + addition.product + " has been added to inventory.");
            if(err) throw err;
        });
        //console.log(addition.product +  " - " + addition.dept+  " - "+ addition.price+  " - "+ addition.quant);
    });
};



module.exports = bamMan;