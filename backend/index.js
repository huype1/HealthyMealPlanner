const express = require("express");
const app = express();
const { PORT } = require("./utils/config");

require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const { connectToDatabase, sequelize } = require('./utils/db')

const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)



const start = async () => {
  try {
    await connectToDatabase()
    await sequelize.sync(); 
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start the server:', err);
  }
};

start();
