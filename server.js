const express = require('express');
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');
const figlet = require('figlet');
const validate = require('./validate');
//const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use apiRoutes
//app.use('/api', apiRoutes);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(``);
    console.log(chalk.greenBright.bold(figlet.textSync('PTO DataBase')));
    console.log(``);
    console.log(``);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
});


// Prompt User for Choices
const promptUser = () => {
  inquirer.prompt([
    {
      name: 'choices',
      type: 'list',
      message: 'Please select an option:',
      choices: [
        'View All Employees',
        'View All Roles',
        'View All Departments',
        'View All Employees By Department',
        'View Department Budgets',
        'Update Employee Role',
        'Update Employee Manager',
        'Add Employee',
        'Add Role',
        'Add Department',
        'Remove Employee',
        'Remove Role',
        'Remove Department',
        'Exit'
      ]
    }
  ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === 'View All Employees') {
        viewAllEmployees();
      }

      if (choices === 'View All Departments') {
        viewAllDepartments();
      }

      if (choices === 'View All Employees By Department') {
        viewEmployeesByDepartment();
      }

      if (choices === 'Add Employee') {
        addEmployee();
      }

      if (choices === 'Remove Employee') {
        removeEmployee();
      }

      if (choices === 'Update Employee Role') {
        updateEmployeeRole();
      }

      if (choices === 'Update Employee Manager') {
        updateEmployeeManager();
      }

      if (choices === 'View All Roles') {
        viewAllRoles();
      }

      if (choices === 'Add Role') {
        addRole();
      }

      if (choices === 'Remove Role') {
        removeRole();
      }

      if (choices === 'Add Department') {
        addDepartment();
      }

      if (choices === 'View Department Budgets') {
        viewDepartmentBudget();
      }

      if (choices === 'Remove Department') {
        removeDepartment();
      }

      if (choices === 'Exit') {
        db.end();
      }
    });
};

// ----------------------------------------------------- VIEW -----------------------------------------------------------------------

// View All Employees // checked and good at 12.45pm 7721
const viewAllEmployees = () => {
  let sql = `SELECT tbl_employee.id, 
                tbl_employee.first_name, 
                tbl_employee.last_name, 
                tbl_role.title, 
                tbl_department.department_name AS 'department', 
                tbl_role.salary
                FROM tbl_employee, tbl_role, tbl_department 
                WHERE tbl_department.id = tbl_role.department_id 
                AND tbl_role.id = tbl_employee.role_id
                ORDER BY tbl_employee.id ASC`;
  //connection.promise().query(sql, (error, response) => {
    db.query(sql, (error, response) => {
    if (error) throw error;
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`Current Employees:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.table(response);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
};

// View all Roles
const viewAllRoles = () => {
  console.log(chalk.yellow.bold(`====================================================================================`));
  console.log(`                              ` + chalk.green.bold(`Current Employee Roles:`));
  console.log(chalk.yellow.bold(`====================================================================================`));
  const sql = `SELECT tbl_role.id, tbl_role.title, tbl_department.department_name AS department
              FROM tbl_role
              INNER JOIN tbl_department 
              ON tbl_role.department_id = tbl_department.id`;
    db.query(sql, (error, response) => {
    if (error) throw error;
    response.forEach((role) => { console.log(role.title); });
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
};

// View all Departments
const viewAllDepartments = () => {
  const sql = `SELECT tbl_department.id AS id, tbl_department.department_name AS department FROM tbl_department`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`All Departments:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.table(response);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
};

// View all Employees by Department
const viewEmployeesByDepartment = () => {
  const sql = `SELECT tbl_employee.first_name, 
                tbl_employee.last_name, 
                tbl_department.department_name AS department
                FROM tbl_employee 
                LEFT JOIN tbl_role ON tbl_employee.role_id = tbl_role.id 
                LEFT JOIN tbl_department ON tbl_role.department_id = tbl_department.id`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.log(`                              ` + chalk.green.bold(`Employees by Department:`));
    console.log(chalk.yellow.bold(`====================================================================================`));
    console.table(response);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
};

//View all Departments by Budget
const viewDepartmentBudget = () => {
  console.log(chalk.yellow.bold(`====================================================================================`));
  console.log(`                              ` + chalk.green.bold(`Budget By Department:`));
  console.log(chalk.yellow.bold(`====================================================================================`));
  const sql = `SELECT department_id AS id, 
                tbl_department.department_name AS department,
                SUM(salary) AS budget
                FROM  tbl_role  
                INNER JOIN tbl_department ON tbl_role.department_id = tbl_department.id GROUP BY  tbl_role.department_id`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    console.table(response);
    console.log(chalk.yellow.bold(`====================================================================================`));
    promptUser();
  });
};

// --------------------------------------------------- ADD --------------------------------------------------------------------

// Add a New Employee //solved 7721
const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fistName',
      message: "What is the employee's first name?",
      validate: addFirstName => {
        if (addFirstName) {
          return true;
        } else {
          console.log('Please enter a first name');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
      validate: addLastName => {
        if (addLastName) {
          return true;
        } else {
          console.log('Please enter a last name');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'email',
      message: "What is the employee's email?",
    }
  ])
    .then(answer => {
      const crit = [answer.fistName, answer.lastName, answer.email]
      const roleSql = `SELECT tbl_role.id, tbl_role.title FROM tbl_role`;
      db.query(roleSql, (error, data) => {
        if (error) throw error;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer.prompt([
          {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: roles
          }
        ])
          .then(roleChoice => {
            const role = roleChoice.role;
            crit.push(role);
            const managerSql = `SELECT * FROM tbl_employee`;
            db.query(managerSql, (error, data) => { 
              if (error) throw error;
              const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
              inquirer.prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers
                }
              ])
                .then(managerChoice => {
                  const manager = managerChoice.manager;
                  crit.push(manager);
                  const sql = `INSERT INTO tbl_employee (first_name, last_name, email, role_id, manager_id)
                                    VALUES (?, ?, ?, ?, ?)`;
                  db.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!")
                    viewAllEmployees();
                  });
                });
            });
          });
      });
    });
};

// Add a New Role // solved 7/7/21 at 10.42pm
const addRole = () => {
  const sql = 'SELECT * FROM tbl_department'
  db.query(sql, (error, response) => { 
    if (error) throw error;
    let deptNamesArray = [];
    response.forEach((department) => { deptNamesArray.push(department.department_name); });
    deptNamesArray.push('Create Department');
    inquirer
      .prompt([
        {
          name: 'departmentName',
          type: 'list',
          message: 'Which department is this new role in?',
          choices: deptNamesArray
        }
      ])
      .then((answer) => {
        if (answer.departmentName === 'Create Department') {
          this.addDepartment();
        } else {
          addRoleResume(answer);
        }
      });

    const addRoleResume = (departmentData) => {
      inquirer
        .prompt([
          {
            name: 'newRole',
            type: 'input',
            message: 'What is the name of your new role?',
            validate: validate.validateString
          },
          {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of this new role?',
            validate: validate.validateSalary
          }
        ])
        .then((answer) => {
          let createdRole = answer.newRole;
          let departmentId;

          response.forEach((department) => {
            if (departmentData.departmentName === department.department_name) { departmentId = department.id; }
          });

          let sql = `INSERT INTO tbl_role (title, salary, department_id) VALUES (?, ?, ?)`;
          let crit = [createdRole, answer.salary, departmentId];

          db.query(sql, crit, (error) => {
            if (error) throw error;
            console.log(chalk.yellow.bold(`====================================================================================`));
            console.log(chalk.greenBright(`Role successfully created!`));
            console.log(chalk.yellow.bold(`====================================================================================`));
            viewAllRoles();
          });
        });
    };
  });
};

// Add a New Department // solved 7721
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'newDepartment',
        type: 'input',
        message: 'What is the name of your new Department?',
        validate: validate.validateString
      }
    ])
    .then((answer) => {
      let sql = `INSERT INTO tbl_department (department_name) VALUES (?)`;
      db.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(``);
        console.log(chalk.greenBright(answer.newDepartment + ` Department successfully created!`));
        console.log(``);
        viewAllDepartments();
      });
    });
};

// ------------------------------------------------- UPDATES -------------------------------------------------------------------------

// Update an Employee's Role - solved 7721
const updateEmployeeRole = () => {
  let sql = `SELECT tbl_employee.id, tbl_employee.first_name, tbl_employee.last_name, tbl_role.id AS "role_id"
                      FROM tbl_employee, tbl_role, tbl_department WHERE tbl_department.id = tbl_role.department_id AND tbl_role.id = tbl_employee.role_id`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => { employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`); });

    let sql = `SELECT tbl_role.id, tbl_role.title FROM tbl_role`;
  db.query(sql, (error, response) => {
      if (error) throw error;
      let rolesArray = [];
      response.forEach((role) => { rolesArray.push(role.title); });

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new role?',
            choices: employeeNamesArray
          },
          {
            name: 'chosenRole',
            type: 'list',
            message: 'What is their new role?',
            choices: rolesArray
          }
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls = `UPDATE tbl_employee SET tbl_employee.role_id = ? WHERE tbl_employee.id = ?`;
          db.query(
            sqls,
            [newTitleId, employeeId],
            (error) => {
              if (error) throw error;
              console.log(chalk.greenBright.bold(`====================================================================================`));
              console.log(chalk.greenBright(`Employee Role Updated`));
              console.log(chalk.greenBright.bold(`====================================================================================`));
              promptUser();
            }
          );
        });
    });
  });
};

// Update an Employee's Manager / / solved 7721
const updateEmployeeManager = () => {
  let sql = `SELECT tbl_employee.id, tbl_employee.first_name, tbl_employee.last_name, tbl_employee.manager_id
                      FROM tbl_employee`;
  db.query(sql, (error, response) => {
    let employeeNamesArray = [];
    response.forEach((employee) => { employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`); });

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee has a new manager?',
          choices: employeeNamesArray
        },
        {
          name: 'newManager',
          type: 'list',
          message: 'Who is their manager?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId, managerId;
        response.forEach((employee) => {
          if (
            answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }

          if (
            answer.newManager === `${employee.first_name} ${employee.last_name}`
          ) {
            managerId = employee.id;
          }
        });

        if (validate.isSame(answer.chosenEmployee, answer.newManager)) {
          console.log(chalk.redBright.bold(`====================================================================================`));
          console.log(chalk.redBright(`Invalid Manager Selection`));
          console.log(chalk.redBright.bold(`====================================================================================`));
          promptUser();
        } else {
          let sql = `UPDATE tbl_employee SET tbl_employee.manager_id = ? WHERE tbl_employee.id = ?`;

          db.query(
            sql,
            [managerId, employeeId],
            (error) => {
              if (error) throw error;
              console.log(chalk.greenBright.bold(`====================================================================================`));
              console.log(chalk.greenBright(`Employee Manager Updated`));
              console.log(chalk.greenBright.bold(`====================================================================================`));
              promptUser();
            }
          );
        }
      });
  });
};

// -------------------------------------- REMOVES --------------------------------------------------------

// Delete an Employee - solved 7721.
const removeEmployee = () => {
  let sql = `SELECT tbl_employee.id, tbl_employee.first_name, tbl_employee.last_name FROM tbl_employee`;

  db.query(sql, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => { employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`); });

    inquirer
      .prompt([
        {
          name: 'chosenEmployee',
          type: 'list',
          message: 'Which employee would you like to remove?',
          choices: employeeNamesArray
        }
      ])
      .then((answer) => {
        let employeeId;

        response.forEach((employee) => {
          if (
            answer.chosenEmployee ===
            `${employee.first_name} ${employee.last_name}`
          ) {
            employeeId = employee.id;
          }
        });

        let sql = `DELETE FROM tbl_employee WHERE tbl_employee.id = ?`;
        db.query(sql, [employeeId], (error) => {
          if (error) throw error;
          console.log(chalk.redBright.bold(`====================================================================================`));
          console.log(chalk.redBright(`Employee Successfully Removed`));
          console.log(chalk.redBright.bold(`====================================================================================`));
          viewAllEmployees();
        });
      });
  });
};

// Delete a Role solved 7721 at 11pm.
const removeRole = () => {
  let sql = `SELECT tbl_role.id, tbl_role.title FROM tbl_role`;

  db.query(sql, (error, response) => {
    if (error) throw error;
    let roleNamesArray = [];
    response.forEach((role) => { roleNamesArray.push(role.title); });

    inquirer
      .prompt([
        {
          name: 'chosenRole',
          type: 'list',
          message: 'Which role would you like to remove?',
          choices: roleNamesArray
        }
      ])
      .then((answer) => {
        let roleId;

        response.forEach((role) => {
          if (answer.chosenRole === role.title) {
            roleId = role.id;
          }
        });

        let sql = `DELETE FROM tbl_role WHERE tbl_role.id = ?`;
        db.query(sql, [roleId], (error) => {
          if (error) throw error;
          console.log(chalk.redBright.bold(`====================================================================================`));
          console.log(chalk.greenBright(`Role Successfully Removed`));
          console.log(chalk.redBright.bold(`====================================================================================`));
          viewAllRoles();
        });
      });
  });
};

// Delete a Department solved 7721 at 11.03pm
const removeDepartment = () => {
  let sql = `SELECT tbl_department.id, tbl_department.department_name FROM tbl_department`;
  db.query(sql, (error, response) => {
    if (error) throw error;
    let departmentNamesArray = [];
    response.forEach((department) => { departmentNamesArray.push(department.department_name); });

    inquirer
      .prompt([
        {
          name: 'chosenDept',
          type: 'list',
          message: 'Which department would you like to remove?',
          choices: departmentNamesArray
        }
      ])
      .then((answer) => {
        let departmentId;

        response.forEach((department) => {
          if (answer.chosenDept === department.department_name) {
            departmentId = department.id;
          }
        });

        let sql = `DELETE FROM tbl_department WHERE tbl_department.id = ?`;
        db.query(sql, [departmentId], (error) => {
          if (error) throw error;
          console.log(chalk.redBright.bold(`====================================================================================`));
          console.log(chalk.redBright(`Department Successfully Removed`));
          console.log(chalk.redBright.bold(`====================================================================================`));
          viewAllDepartments();
        });
      });
  });
};