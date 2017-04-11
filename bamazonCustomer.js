
var inquirer = require("fs");
//var inquirer = require("file-share");
var inquirer = require("inquirer");
var mysql = require('mysql');

var bamMan = require('./bamazonManager');

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

var options = function(){
    connection.query('SELECT department_name, count(department_name) FROM products GROUP BY department_name HAVING count(*) >= 1 ORDER BY count(department_name) DESC', function(err, results){
        if(err) throw err;
        for (var i = 0; i <results.length; i++){
            //console.log("Dept: " + results[i].department_name);
            newAll.push(results[i].department_name);
            //console.log(newAll);
            //console.log("---------------------------------");
        };
    });
  inquirer.prompt([
        {
            type: "list",
            message: "Who are you?",
            choices: ["Customer", "Administrator", "exit"],
            name: "selection"
        }
    ]).then(function(user) {
        switch (user.selection) {
            case "Customer":
                cust();
                //options();
                break;
            case "Administrator":
                bamMan();
                
            case "exit":
                break;
        }
    });
};

var admin = function() {
    console.log("Hello Admin!");
};

var cust = function() {
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

var purchaseReq = function (deptListItem, deptQuant){
    connection.query('Select * FROM products WHERE product_name = ?', [deptListItem], function (err,results){
        var trueQuant = results[0].stock_quantity;
        // console.log("Request: " + dept.quant);
        // console.log("Amount in Stock: " + trueQuant);
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
            console.log("New Quantity in Stock is: " + newQuant);
        };
    });
};

var makeSelect = function() {

    
    // connection.query('Select * FROM products', function (err,results){
    //     //console.log(results[0].RowDataPacket);
    //     var newAll = [];
    //     for (i=0; i<results.length; i++){
    //         var j=0; 
    //         console.log("-----------j-----------");
    //         if (j<=newAll.length){ 
    //             if (results[i].department_name != newAll[j]){
    //                 newAll.push(results[i].department_name);
    //                 console.log("-----------------------");
    //                 console.log(newAll);
    //                 j++;
    //             };
    //         };
    //     };
    // });
    inquirer.prompt([
        {
            type: "list",
            message: "What department do you want to look into?",
            choices: newAll,
            name: "dept"
        }
    ]).then(function(select) {
        //console.log ("Item: "+ select.item);
        //console.log ("Department: " + select.dept);
        //console.log ("Quantity: " + select.quant);
        connection.query('Select * FROM products WHERE department_name = ?', [select.dept], function (err,results){
            var newDept = [];
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
                console.log(dept.listItem);
                purchaseReq(dept.listItem, dept.quant);
            });
        });
    });
};


options();

