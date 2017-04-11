
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

var bamMan = function () {
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
            choices: ["Products for Sale", "View Low Inventory","Add To Inventory", "Add New Product", "exit"],
            name: "addItem"
        }
    ]).then(function(man) {
        console.log(man.addItem);
    });
};

var newProduct = function(){
    console.log("Add Product")
};




module.exports = bamMan;