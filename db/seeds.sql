INSERT INTO tbl_department (department_name)
VALUES
  ('CI'),
  ('DCC'),
  ('Support')
  ;

  INSERT INTO tbl_role (title, salary, department_id)
VALUES
  ('CI Business Analyst', 50000.00, 1),
  ('CI Manager', 100000.00, 1),
  ('DCC Business Analyst', 50000.00, 2),
  ('DCC Manager', 100000.00, 2),
  ('Support Business Analyst', 60000.00, 3),
  ('Support Manager', 120000.00, 3)
  ;

  INSERT INTO tbl_employee (first_name, last_name, email, role_id, manager_id)
VALUES
  ('James', 'Fraser', 'jf@goldenbough.edu', 2, NULL),
  ('Jack', 'London', 'jlondon@ualaska.edu', 1, 1),
  ('Robert', 'Bruce', 'rbruce@scotland.net', 4, NULL),
  ('Peter', 'Greenaway', 'pgreenaway@postmodern.com', 3, 3),
  ('Derek', 'Jarman', 'djarman@prospectcottage.net', 6, NULL),
  ('Kris', 'Renaldi', 'chickens@aol.com', 5, 5)
  ;
  


