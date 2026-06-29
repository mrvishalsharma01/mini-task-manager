import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  createTaskSchema,
  updateTaskSchema,
} from '../controllers/task.controller';
import { validate } from '../middleware/validate';

const router = Router();

router.route('/')
  .get(getTasks)
  .post(validate(createTaskSchema), createTask);

router.route('/:id')
  .patch(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

export default router;
