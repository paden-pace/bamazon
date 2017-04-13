var fs = require("fs");
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



// connection.connect(function (err) {
//     if (err) throw (error);
//     console.log("connected as id " + connection.threadId);
// });

var bamInd = function(){

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


bamInd();



module.exports = bamInd;