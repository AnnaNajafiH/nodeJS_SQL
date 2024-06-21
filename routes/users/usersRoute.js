import express from "express";
import sql from "../../db.js"; // Import the database connection
import { getAllUsers,creatUser,getOneUser,deleteUser,updateUser } from "../../controllers/usersControllers/usersControllers";


const usersRoute = express.Router();

usersRoute.route(`/`).get(getAllUsers).post(creatUser);

usersRoute.route(`/:user_id`).get(getOneUser).delete(deleteUser).put(updateUser);

export default usersRoute;
