import express, { Request, Response } from 'express';
import Project from './models/Project';
import KanbanColumn from './models/KanbanColumn';
import KanbanCase from './models/KanbanCase';

const router = express.Router();

// Get all projects, including associated KanbanColumns and KanbanCases
router.get('/', async (req: Request, res: Response) => {
    try {
        const projects = await Project.findAll({
            include: {
                model: KanbanColumn,
                include: [KanbanCase], // Include cases in each column
            },
        });
        res.json(projects[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Add a new project
router.post('/', async (req: Request, res: Response) => {
    try {
        const { projectId, name, columns } = req.body.project;

        let project = await Project.findOne({ where: { projectId }, include: [KanbanColumn] });
        if (project) {

            await project.update({ name });

            for (const columnData of columns) {
                let column = await KanbanColumn.findOne({ where: { columnId: columnData.columnId, projectId: project.id } });
                if (column) {

                    await column.update(columnData);


                    for (const caseData of columnData.cases) {
                        let kanbanCase = await KanbanCase.findOne({ where: { caseId: caseData.caseId, columnId: column.id } });
                        if (kanbanCase) {

                            await kanbanCase.update(caseData);
                        } else {

                            let newColumn = await KanbanCase.create({ ...caseData, columnId: column.id });

                            for (const caseData of columnData.cases) {
                                await KanbanCase.create({ ...caseData, columnId: newColumn.id });
                            }
                        }
                    }
                } else {
                    await KanbanColumn.create({ ...columnData, projectId: project.id });
                }
            }

            res.json(project);
        } else {
            // If no project with that projectId exists, create a new one
            project = await Project.create(
                { projectId, name, columns },
                {
                    include: [KanbanColumn], // Allow creating project with columns
                }
            );
            res.json(project);
        }
    } catch (err) {
        console.log('err :>> ', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});



// Get a single project by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: {
                model: KanbanColumn,
                include: [KanbanCase], // Include cases in each column
            },
        });
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Update a project (Add or edit columns/cases)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            await project.update(req.body);
            res.json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update project' });
    }
});


// Delete a project
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            await project.destroy();
            res.json({ message: 'Project deleted' });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;
