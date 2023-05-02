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
      addARole();
      break;

    case "Add an employee":
      addEmployee();
      break;

    case "Update an employee role":
      updateEmployeeRole();
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

const addARole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the name of the new role?",
      },
      {
        type: "input",
        name: "salary",
        message:
          "What is the salary of this role?(Include cents after a decimal)",
      },
      {
        type: "input",
        name: "department",
        message: "What is this role's department id?",
      },
    ])
    .then((answer) => {
      const values = ["roles", answer.role, answer.salary, answer.department];
      addData(values);
    });
};

const addEmployee = () => {
  let updatedRoleArray = [];
  let employeeArray = ["None"];
  //query to give an updated list of roles for add employee questions
  db.query(`SELECT title from roles`, (err, rows) => {
    rows.forEach((title) => {
      updatedRoleArray.push(title.title);
      if (err) {
        console.log(err);
      }
    });
  });

  //query to give updated list of employees for selecting a manager
  db.query(`SELECT first_name from employees`, (err, rows) => {
    rows.forEach((employee) => {
      employeeArray.push(employee.first_name);
      if (err) {
        console.log(err);
      }
    });
  });
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
        choices: updatedRoleArray,
        message: "What department will this employee be joining?",
      },
      {
        type: "list",
        name: "manager",
        choices: employeeArray,
        message: "Who will be this employees manager?",
      },
    ])
    .then((answers) => {
      sortEmployeeData(answers);
    });
};

const sortEmployeeData = async (answers) => {
  const queryPromise = new Promise((resolve, reject) => {
    db.query(
      `select id from roles
        where title = ?;`,
      answers.role,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
  const roleId = await queryPromise;
  answers.role = roleId[0].id;
  if (answers.manager !== "None") {
    const queryPromiseTwo = new Promise((resolve, reject) => {
      db.query(
        `select id from employees
        where first_name = ?;`,
        answers.manager,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
    const managerId = await queryPromiseTwo;
    answers.manager = managerId[0].id;
  }

  let sendNewEmployee = [];
  if (answers.manager === "None") {
    sendNewEmployee = ["employees", answers.nameF, answers.nameL, answers.role];
  } else {
    sendNewEmployee = [
      "employees",
      answers.nameF,
      answers.nameL,
      answers.role,
      answers.manager,
    ];
  }
  addData(sendNewEmployee);
};

const addData = (values) => {
  if (values[0] == "departments") {
    var addDataQuery = `INSERT INTO ?? (??) VALUES (?);`;
  } else if (values[0] == "employees" && values.length == 5) {
    addDataQuery = `INSERT INTO ?? (first_name,last_name,role_id,manager_id) Values (?,?,?,?);`;
  } else if (values[0] == "employees" && values.length == 4) {
    addDataQuery = `INSERT INTO ?? (first_name,last_name,role_id) Values (?,?,?);`;
  } else if (values[0] == "roles") {
    addDataQuery = `insert into ?? (title,salary,department_id)
  values (?,?,?);`;
  }

  db.query(addDataQuery, values, (err, rows) => {
    console.log("New update created at id: " + rows.insertId);
    start();
    if (err) {
      console.log(err);
    }
  });
};

const updateEmployeeRole = () => {
  const updatedRoleArray = [];
  const employeeArray = ["None"];
  //query to give an updated list of roles for add employee questions
  db.query(`SELECT title from roles`, (err, rows) => {
    rows.forEach((title) => {
      updatedRoleArray.push(title.title);
      if (err) {
        console.log(err);
      }
    });
  });

  //query to give updated list of employees for question list
  db.query(`SELECT first_name from employees`, (err, rows) => {
    rows.forEach((employee) => {
      employeeArray.push(employee.first_name);
      if (err) {
        console.log(err);
      }
    });
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "emId",
        message: "What is this employees id number?",
      },
      {
        type: "input",
        name: "role",
        message: "New role id number?",
      },
    ])
    .then((answers) => {
      const values = [answers.role, answers.emId];

      db.query(
        `update employees 
    set role_id = ?
    where id = ?;`,
        values,
        (err, rows) => {
          if (err) {
            console.log(err);
            start();
          } else {
            console.log("Role updated");
            start();
          }
        }
      );
    });
};

console.log("WELCOME TO COMPANY MANAGER");

start();
