INSERT INTO department (name)
VALUES
('Manager'),
('Agency Relations'),
('Credit Committee'),
('Uderwriting'),
('HR'),
('Ops');

INSERT INTO role (title, salary, department_id)
VALUES
('Manager', 850000, 1),
('Agency Relations', 80000, 2),
('Credit Committee', 70000, 3),
('Underwriting', 60000, 4),
('HR', 55000, 5),
('Ops', 33000, 6);

INSERT INTO employee (first_name, last_name, role_id)
VALUES
('H', 'Justin', 1),
('E', 'Eric', 2),
('S', 'Kolton', 2),
('H', 'Christian', 2),
('H', 'Michael', 3),
('S', 'Kameron', 3),
('S', 'Nick', 3),
('M', 'Chris', 4),
('S', 'Ashley', 4),
('G', 'Bri', 4),
('R', 'Josseline' 4),
('H', 'Amy', 5),
('H', 'Debbie', 6),
('R', 'Kim', 6),
('O', 'Diana',6)
('H', 'Lauren', 6);

UPDATE employee SET manager_id = 1 WHERE id > 1;