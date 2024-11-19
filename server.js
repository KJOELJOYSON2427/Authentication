require("dotenv").config({ path: 'C:/Users/K Joel Joyson/OneDrive/Documents/source/NODEJS-AUTHORIZATION/.env' });

const express = require("express");
const app = express();
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const homeRoutes=require("./routes/home-routes");
const adminRoutes=require("./routes/admin-routes");
const uploadImageRoutes=require("./routes/image-routes");


app.use(express.json());
connectToDB();
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).send({ message: err.message });
    } else {
        res.status(500).send({ message: err.message });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/home",homeRoutes);
app.use("/api/admin",adminRoutes)
app.use("/api/image",uploadImageRoutes)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
