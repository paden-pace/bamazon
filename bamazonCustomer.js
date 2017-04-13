
var fs = require("fs");
var inquirer = require("inquirer");
var mysql = require('mysql');

var bamMan = require('./bamazonManager');
var bamSup = require('./bamazonSupervisor');
var bamInd = require('./bamazonIndex.js');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Texas2015",
    database: "bamazon"
});

var newAll = [];
var curDept;

var bamCust = function() {
    connection.query('SELECT department_name, count(department_name) FROM products GROUP BY department_name HAVING count(*) >= 1 ORDER BY count(department_name) DESC', function(err, results){
        if(err) throw err;
        for (var i = 0; i <results.length; i++){
            newAll.push(results[i].department_name);
        };
    });
    console.log("Welcome to this super trendy store!");
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
                break;
                
            case "Make A Selection":
                makeSelect();
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

var purchaseReq = function (deptListItem, deptQuant){
    connection.query('Select * FROM products WHERE product_name = ?', [deptListItem], function (err,results){
        var trueQuant = results[0].stock_quantity;
        var truePrice = results[0].price;
        if (deptQuant > trueQuant){
            console.log("Looks like we don't have enough in stock.");
            console.log("We only have: " + trueQuant);
            inquirer.prompt([
                {
                    type: "input",
                    message: "How many would you like to order?",
                    name: "quant"
                }
            ]).then(function(update) {
                purchaseReq(deptListItem, update.quant);
            });
            
        } else if (deptQuant <= trueQuant){
            console.log("Sure thing buddy!");
            var newQuant = (trueQuant - deptQuant);
            connection.query('UPDATE products SET ? WHERE ?', [
                {stock_quantity: newQuant},
                {product_name: deptListItem}
                ], function(err, results){
                    if(err) throw err;
                });
            var sale = truePrice * deptQuant;
            connection.query('UPDATE departments SET ? WHERE ?', [
                {total_sales: sale},
                {department_name: curDept}
                ], function(err, results){
                    if(err) throw err;
                });
            console.log("New Quantity in Stock is: " + newQuant);
        };
    });
};

var makeSelect = function() {
    inquirer.prompt([
        {
            type: "list",
            message: "What department do you want to look into?",
            choices: newAll,
            name: "dept"
        }
    ]).then(function(select) {
        connection.query('Select * FROM products WHERE department_name = ?', [select.dept], function (err,results){
            var newDept = [];
            curDept = select.dept;
            for (i=0; i<results.length; i++){
                newDept.push(results[i].product_name);
            };
            inquirer.prompt([
                {
                    type: "list",
                    message: "What item would you like to buy?",
                    choices: newDept,
                    name: "listItem"
                },
                {
                    type: "input",
                    message: "How many of those would you like?",
                    name: "quant"
                }
            ]).then(function(dept) {
                purchaseReq(dept.listItem, dept.quant);
                fs.appendFile("salesLog.txt", dept.quant + " - " + dept.listItem + "s have been purchased." + "\r\n");
            });
        });
    });
};

module.exports = bamCust;


