
var fs = require("fs");
var inquirer = require("inquirer");
var mysql = require('mysql');
require('console.table');

var bamMan = require('./bamazonManager');
var bamCust = require('./bamazonCustomer');
var bamInd = require('./bamazonIndex.js');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Texas2015",
    database: "bamazon"
});

var bamSup = function() {
    console.log("Hello Supervisor!");
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department","Create New Department", "View Sales Log", "exit"],
            name: "selection"
        }
    ]).then(function(user) {
        switch (user.selection) {
            case "View Product Sales by Department":
                viewSales();
                break;
                
            case "Create New Department":
                newDept();
                break;

            case "View Sales Log":
                readSales();
                break;

            case "exit":
                break;
        }
    });
};

var newDept = function(){
    console.log("New Department.")
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the new department?",
            name: "name"
        },
        {
            type: "input",
            message: "What will be this new department's overhead costs?",
            name: "overhead"
        }
    ]).then(function(addDept) {
        connection.query('INSERT INTO departments SET ?', 
        {department_name: addDept.name, over_head_costs: addDept.overhead, total_sales: 0},
        function(err, results){
            if(err) throw err;
            console.log(addDept.name + " has been added as a new department.")
        });
    });
};




var tableArray = [];

var Maker = function(id, name, overhead, sales, profit){
    this.id = id,
    this.name = name,
    this.overhead = overhead,
    this.sales = sales,
    this.profit = (sales - overhead)
};

var viewSales = function(){
    console.log("View Sales.")  
    connection.query('Select * FROM departments', function (err,results){
        for (i = 0; i < results.length; i++){
            var addProfit = (results[i].total_sales - results[i].over_head_costs);
            var addRow = new Maker(results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].total_sales, addProfit);
            tableArray.push(addRow) 
            
        } 
        console.table(tableArray);
    });
};

var readSales = function() {
    fs.readFile("salesLog.txt", "utf8", function(err, data) {
        console.log(data);
    });
};


module.exports = bamSup;


