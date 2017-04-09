
var inquirer = require("fs");
var inquirer = require("file-share");
var inquirer = require("inquirer");
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Texas2015",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw (error);
    console.log("connected as id " + connection.threadId);
});

var options = function(){
  inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Let's Go Shopping", "exit"],
            name: "selection"
        }
    ]).then(function(user) {
        switch (user.selection) {
            case "Let's Go Shopping":
                shopping();
                //options();
                break;
                
            case "exit":
                break;
        }
    });
};


function shopping() {
    console.log("artist data");
          inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["See Items", "Make A Selection", "exit"],
            name: "selection"
        }
    ]).then(function(user) {
        switch (user.selection) {
            case "See Items":
                seeItems();
                //options();
                break;
                
            case "Make A Selection":
                makeSelect();
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

var makeSelect = function() {
    console.log("Pick an item");
};


 options();