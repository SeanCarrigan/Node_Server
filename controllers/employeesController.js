const data = {
  employees: require('../model/employees.json'),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const getEmployee = (req, res) => {
//   console.log(`ID: ${parseInt(req.params.id)}`);
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );
  if (!employee)
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });

  res.status(200).json(employee);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees?.length
      ? data.employees[data.employees.length - 1].id + 1
      : 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };
  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ message: 'First and last name are required.' });
  }
  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  // find employee record to UPDATE if it exists using employee id
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  // display error if no employee with matching id exists
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }
  // if a firstname was supplied in the PUT request, apply changes
  if (req.body.firstname) employee.firstname = req.body.firstname;
  // if a lastname was supplied in the PUT request, apply changes
  if (req.body.lastname) employee.lastname = req.body.lastname;
  // remove employee being modified form employees array
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  // add newly mdofied employee record to a new array
  const unsortedArray = [...filteredArray, employee];
  // sort the unsorted array now that the modified employee record has been inserted
  data.setEmployees(unsortedArray.sort((a, b) => a.id - b.id));
  res.json(data.employees);
};

const deleteEmployee = (req, res) => {
  // find employee record to DELETE if it exists using employee id
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );
  // return error message if no employee found
  if (!employee)
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  // remove employee from from employee array
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );
  data.setEmployees([...filteredArray]);
  res.status(200).json(data.employees);
};

module.exports = {
  getAllEmployees,
  getEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
};
