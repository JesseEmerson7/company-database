const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");


const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "employee_tracker_db",
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "select",
        message: "what would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answers) => {
      sorter(answers.select);
    });
};

const sorter = (request) =>{
  switch (request) {
    case "View all departments":
      
      break;

      case "View all roles":
      viewAllRoles();
      break;

      case "View all employees":
      
      break;

      case "View all employees":
      
      break;
  
    default:
      break;
  }

}

const viewAllRoles = () =>{
  db.query(`select t.id, t.title, ti.name as department, t.salary
  from roles as t
  join departments as ti 
  on t.department_id = ti.id;`,(err,rows)=>{
    console.log(cTable.getTable(rows));
    start();
    if (err){
      console.log(err)
    }

  })
}

const addToData = () =>{};

const updateData = () =>{}; 

start();


