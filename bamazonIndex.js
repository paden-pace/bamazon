var inquirer = require("fs");
//var inquirer = require("file-share");
var inquirer = require("inquirer");
var mysql = require('mysql');

var bamMan = require('./bamazonManager.js');
var bamSup = require('./bamazonSupervisor.js');
var bamCust = require('./bamazonCustomer.js');



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
            choices: ["Customer", "Administrator", "Supervisor", "exit"],
            name: "selection"
        }
    ]).then(function(user) {
        switch (user.selection) {
            case "Customer":
                bamCust();
                break;

            case "Administrator":
                bamMan();
                break;

            case "Supervisor":
                bamSup();
                break;
                
            case "exit":
                break;
        }
    });
};


options();



