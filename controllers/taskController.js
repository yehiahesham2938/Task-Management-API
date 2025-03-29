const { Task, User } = requestuire('../models');

module.exports = { 
  async createTask(request, response) {
    try {
      const task = await Task.create({
        title: request.body.title,
        description: request.body.description,
        status: request.body.status || 'pending',
        userId: request.body.userId
      });
      response.status(201).json(task);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }, 
  async getAllTasks(request, response) {
    try {
      const tasks = await Task.findAll({
        include: [{
          model: User,
          attributes: ['id', 'username', 'email']
        }]
      });
      response.json(tasks);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  },
  
  async getTaskById(request, response) {
    try {
      const task = await Task.findByPk(request.params.id, {
        include: [{
          model: User,
          attributes: ['id', 'username', 'email']
        }]
      });
      if (!task) {
        return response.status(404).json({ error: 'Task not found' });
      }
      response.json(task);
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }, 
  async updateTask(request, response) {
    try {
      const [updated] = await Task.update(request.body, {
        where: { id: request.params.id }
      });
      if (updated) {
        const updatedTask = await Task.findByPk(request.params.id);
        return response.json(updatedTask);
      }
      throw new Error('Task not found');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }, 
  async deleteTask(request, response) {
    try {
      const deleted = await Task.destroy({
        where: { id: request.params.id }
      });
      if (deleted) {
        return response.json({ message: 'Task deleted' });
      }
      throw new Error('Task not found');
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
};