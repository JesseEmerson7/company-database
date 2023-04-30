INSERT INTO departments (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");
      
INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead",120000, 1),
       ("Salesperson",80025, 1),
       ("Lead Engineer",130000, 2),
       ("Legal Team Lead",200000, 4),
       ("Lawyer",195000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Shmo", 1, null),
       ("Alex", "Mercer", 2, 1),
       ("Jesse", "Emerson", 3, null),
       ("Ben", "Dover", 5, 3),
       ("Jack", "Reacher", 4, null)
       ;