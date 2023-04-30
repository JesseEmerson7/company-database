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

const sorter = (request) => {
  switch (request) {
    case "View all departments":
      viewAllDepartments();
      break;

    case "View all roles":
      viewAllRoles();
      break;

    case "View all employees":
      viewAllEmployees();

      break;

    case "Add a department":
      addADepartment();
      break;

    case "Add a role":
      break;

    case "Add an employee":
      addEmployee();
      break;

    case "Update an employee role":
      break;

    default:
      break;
  }
};

const viewAllRoles = () => {
  db.query(
    `select t.id, t.title, ti.name as department, t.salary
  from roles as t
  join departments as ti 
  on t.department_id = ti.id;`,
    (err, rows) => {
      console.log(cTable.getTable(rows));
      start();
      if (err) {
        console.log(err);
      }
    }
  );
};
const viewAllEmployees = () => {
  db.query(
    `select t.id, t.first_name, t.last_name,tii.title, ti.name as department, tii.salary,
  tiii.first_name as manager
  from employees as t
  join roles as tii on  t.role_id = tii.id
  join departments as ti on tii.department_id = ti.id
  left join employees as tiii on t.id = tiii.manager_id;`,
    (err, rows) => {
      console.log(cTable.getTable(rows));
      start();
      if (err) {
        console.log(err);
      }
    }
  );
};

const viewAllDepartments = () => {
  db.query(`SELECT * from departments;`, (err, rows) => {
    console.log(cTable.getTable(rows));
    start();
    if (err) {
      console.log(err);
    }
  });
};
const addADepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the new department?",
      },
    ])
    .then((answer) => {
      let departmentAdd = answer.department;
      let department = "departments";
      let nameVal = "name";
      let values = [department, nameVal, departmentAdd];
      addData(values);
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "nameF",
        message: "What is this employees first name?",
      },
      {
        type: "input",
        name: "nameL",
        message: "what is this employees last name?",
      },
      {
        type: "list",
        name: "role",
        choices: [],
        message: "What department will this employee be joining?",
      },
    ])
    .then((answer) => {});
};

const addData = (values) => {
  if (values[0] == "departments") {
    var addDataQuery = `INSERT INTO ?? (??) VALUES (?);`;
  } else if (values[0] == "employees") {
    addDataQuery = `INSERT INTO ?? (??,??,??,??) Values (?,?,?,?);`;
  }
  db.query(addDataQuery, values, (err, rows) => {
    console.log("New update created at id: " + rows.insertId);
    start();
    if (err) {
      console.log(err);
    }
  });
};

const updateData = () => {};

start();
