const connection = require("./config/connection");
const consoleTable = require("console.table");
const inquirer = require('inquirer');

console.log(`
--------------------------------------------------------------------------------

███╗░░░███╗██╗███╗░░██╗██╗░█████╗░███╗░░██╗░██████╗
████╗░████║██║████╗░██║██║██╔══██╗████╗░██║██╔════╝
██╔████╔██║██║██╔██╗██║██║██║░░██║██╔██╗██║╚█████╗░
██║╚██╔╝██║██║██║╚████║██║██║░░██║██║╚████║░╚═══██╗
██║░╚═╝░██║██║██║░╚███║██║╚█████╔╝██║░╚███║██████╔╝
╚═╝░░░░░╚═╝╚═╝╚═╝░░╚══╝╚═╝░╚════╝░╚═╝░░╚══╝╚═════╝░

░█████╗░░██████╗░██████╗███████╗███╗░░░███╗██████╗░██╗░░░░░███████╗██╗
██╔══██╗██╔════╝██╔════╝██╔════╝████╗░████║██╔══██╗██║░░░░░██╔════╝██║
███████║╚█████╗░╚█████╗░█████╗░░██╔████╔██║██████╦╝██║░░░░░█████╗░░██║
██╔══██║░╚═══██╗░╚═══██╗██╔══╝░░██║╚██╔╝██║██╔══██╗██║░░░░░██╔══╝░░╚═╝
██║░░██║██████╔╝██████╔╝███████╗██║░╚═╝░██║██████╦╝███████╗███████╗██╗
╚═╝░░╚═╝╚═════╝░╚═════╝░╚══════╝╚═╝░░░░░╚═╝╚═════╝░╚══════╝╚══════╝╚═╝
--------------------------------------------------------------------------------  
    `)

init = () => {
        
    inquirer.prompt({
            name: 'choices',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'Add employee',
                'View all employees',
                'Update employee role',
                'View department',
                'Add role',
                'Exit application'
            ],
        })
        .then((response) => {
            switch (response.choices) {
                case 'Add employee':
                    addEmployee();
                    break;
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'Update employee role':
                    updateRole();
                    break;
                case "View department":
                    viewDepartment();
                    break;
                case "Add role":
                    addRole();
                    break;
                case 'Exit application':
                    connection.end();
                    break;
            }
        });
}

const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, role) => {
        let roles = role.map(({ id, title }) => ({ value: id, name: title }));

        inquirer.prompt([{
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the employee's ID?",
            choices: roles
        },
        {
            type: "list",
            name: "manager_id",
            message: "What is the manager's ID?",
            choices: roles
        }])
            .then(answer => {
                connection.query("INSERT INTO employee SET ?", {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id
                }, (err, res) => {
                    if (err) throw err
                    console.table(res);
                    init();
                })
            })
    })
};

const viewEmployees = () => {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

const updateRole= () => {
    connection.query("SELECT * FROM employee", (err, employee) => {
        let employees = employee.map(({ id, first_name, last_name }) => ({ value: id, name: first_name + last_name }));

        inquirer.prompt({
            type: "list",
            name: "employee",
            message: "Which employee would you like to update?",
            choices: employees
        })
            .then(pick => {
                connection.query("SELECT * FROM role", (err, role) => {
                    let roles = role.map(({ id, title }) => ({ value: id, name: title }));

                    inquirer.prompt({
                        type: "list",
                        name: "role",
                        message: "What is their new role?",
                        choices: roles
                    })
                        .then(update => {
                            connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [update.role, pick.employee], (err, res) => {
                                if (err) throw err;
                                console.table(res);
                                init();
                            });
                        });
                });
            });
    });
};

const viewDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    })
};

const addRole = () => {
    connection.query("SELECT * FROM department", (err, department) => {
        let departments = department.map(({ id, name }) => ({ value: id, name: name }));

        inquirer.prompt([{
            type: "input",
            name: "title",
            message: "What is the title of the new role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the annual salary?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department does this role belong to?",
            choices: departments
        }])
            .then(answer => {
                connection.query("INSERT INTO role SET ?", {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id,
                }, (err, res) => {
                    if (err) throw err
                    console.table(res);
                    init();
                })
            })
    })
};

init()
