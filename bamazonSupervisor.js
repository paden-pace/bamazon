
var inquirer = require("fs");
//var inquirer = require("file-share");
var inquirer = require("inquirer");
var mysql = require('mysql');

var bamMan = require('./bamazonManager');
var bamCust = require('./bamazonCustomer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Texas2015",
    database: "bamazon"
});

var newAll = [];

// connection.connect(function (err) {
//     if (err) throw (error);
//     console.log("connected as id " + connection.threadId);
// });

var bamSup = function() {
    console.log("Hello Supervisor!");
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department","Create New Department","exit"],
            name: "selection"
        }
    ]).then(function(user) {
        switch (user.selection) {
            case "View Product Sales by Department":
                viewSales();
                //options();
                break;
                
            case "Create New Department":
                newDept();
                //options();
                break;

            case "exit":
                break;
        }
    });
};

var newDept = function(){
    console.log("New Department.")
};

var viewSales = function(){
    console.log("View Sales.")
};

module.exports = bamSup;