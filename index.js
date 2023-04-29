const mysql = require("mysql2");
const inquirer = require("inquirer");
const tableLog = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "",
  },
  console.log(`Connected to the classlist_db database.`)
);
