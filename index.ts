import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const projects: Project[] = [];

app.get('/projects', (req: Request, res: Response) => {
  res.json(projects);
});

app.get('/projects/:id', (req: Request, res: Response) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
  } else {
    res.json(project);
  }
});

app.post('/projects', (req: Request, res: Response) => {
  const { name, description } = req.body;
  const project: Project = { id: uuidv4(), name, description, tasks: [] };
  projects.push(project);
  res.status(201).json(project);
});

app.post('/projects/:id/tasks', (req: Request, res: Response) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
  } else {
    const { title, description } = req.body;
    const task: Task = { id: uuidv4(), title, description, completed: false };
    project.tasks.push(task);
    res.status(201).json(task);
  }
});

app.put('/projects/:id', (req: Request, res: Response) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
  } else {
    const { name, description } = req.body;
    project.name = name;
    project.description = description;
    res.json(project);
  }
});

app.put('/projects/:id/tasks/:taskId', (req: Request, res: Response) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
  } else {
    const task = project.tasks.find((t) => t.id === req.params.taskId);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      const { title, description, completed } = req.body;
      task.title = title;
      task.description = description;
      task.completed = completed;
      res.json(task);
    }
  }
});

app.delete('/projects/:id', (req: Request, res: Response) => {
  const projectIndex = projects.findIndex((p) => p.id === req.params.id);
  if (projectIndex === -1) {
    res.status(404).json({ error: 'Project not found' });
  } else {
    projects.splice(projectIndex, 1);
    res.sendStatus(204);
  }
});

app.delete('/projects/:id/tasks/:taskId', (req: Request, res: Response) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
  } else {
    const taskIndex = project.tasks.findIndex((t) => t.id === req.params.taskId);
    if (taskIndex === -1) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      project.tasks.splice(taskIndex, 1);
      res.sendStatus(204);
    }
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
