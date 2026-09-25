import { Router } from 'express';
import healthRoute from './health.route';
import projectRoutes from './project.routes';
import issueRoutes from './issue.routes';
import commentRoutes from './comment.routes';
import userRoutes from './user.routes';
import labelRoutes from './label.routes';
import epicRoutes from './epic.routes';

const router = Router();

router.use('/health', healthRoute);
router.use('/projects', projectRoutes);
router.use('/issues', issueRoutes);
router.use('/comments', commentRoutes);
router.use('/users', userRoutes);
router.use('/labels', labelRoutes);
router.use('/epics', epicRoutes);

export default router;
