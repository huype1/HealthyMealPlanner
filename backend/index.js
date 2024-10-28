const express = require("express");
const app = express();
const { PORT } = require("./utils/config");

require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const { connectToDatabase, sequelize, session, store } = require("./utils/db");
const { errorHandler, unknownEndpoint } = require("./utils/middleware");

const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const dishRouter = require("./controllers/dishes");
const logoutRouter = require("./controllers/logout");
const saveDishRouter = require("./controllers/save_dishes");
const mealPlanRouter = require("./controllers/meal_plans");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/dishes", dishRouter);
app.use("/api/save-dish", saveDishRouter);
app.use("/api/meal-plans", mealPlanRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

const start = async () => {
  try {
    await connectToDatabase();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Unable to start the server:", err);
  }
};

start();
