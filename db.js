const Sequelize = require("sequelize");
const conn = new Sequelize(process.env.DATABASE_URL || "postgres://localhost/acme_api");

const User = conn.define("user", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
  }
});
const Department = conn.define("department", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    notEmpty: true
  },
});

Department.hasMany(User);
User.belongsTo(Department);

const sync = async () => {
  await conn.sync({ force: true });

  const [Engineering, Admin, HR] = await Promise.all([
    Department.create({ name: "Engineering"}),
    Department.create({ name: "Admin"}),
    Department.create({ name: "HR"})
  ]);

  const [Lindsey, Sasha, Peet, Manny] = await Promise.all([
    User.create({ name: "Lindsey",departmentId:HR.id }),
    User.create({ name: "Sasha", departmentId:Engineering.id}),
    User.create({ name: "Peet", departmentId:Admin.id }),
    User.create({ name: "Manny", departmentId: Admin.id})
  ]);
};


module.exports = {
  sync,
  models: {
    User,
    Department
  }
};