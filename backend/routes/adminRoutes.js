import { deleteUser, getAllUsersData, updateUser } from "../controllers/adminController.js";
import { createMessage, deactivateMessage, deleteMessage, getAdminMessages } from "../controllers/adminMessageController.js";
import userAuth from "../middleware/userAuth.js";

import { Router } from "express";

const adminRouter = Router()

adminRouter.post('/messages',userAuth("adminDashboard.view"),createMessage)
adminRouter.get('/messages',userAuth("adminDashboard.view"),getAdminMessages)
adminRouter.patch('/messages/:id',userAuth("adminDashboard.view"),deactivateMessage)
adminRouter.delete('/messages/:id',userAuth("adminDashboard.view"),deleteMessage)

adminRouter.get('/',userAuth("adminDashboard.view"),getAllUsersData)
adminRouter.post('/:id',userAuth("adminDashboard.view"),deleteUser)
adminRouter.put('/:id',userAuth("adminDashboard.view"),updateUser)


export default adminRouter