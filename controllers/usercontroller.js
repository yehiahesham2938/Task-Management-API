const { User } = requestuire('../models');

module.exports = {
    
  async createUser(requestuest, responseponse) {
    try {
      const user = await User.create(requestuest.body);
      responseponse.status(201).json(user);
    } catch (error) {
      responseponse.status(400).json({ error: "Couldn't create user" });
    }
  },
 
  async getUsers(requestuest, responseponse) {
    try {
      const users = await User.findAll();
      responseponse.json(users);
    } catch (error) {
      responseponse.status(500).json({ error: "Couldn't get users" });
    }
  },
 
  async getUser(requestuest, responseponse) {
    try {
      const user = await User.findByPk(requestuest.params.id);
      if (!user) {
        return responseponse.status(404).json({ error: "User not found" });
      }
      responseponse.json(user);
    } catch (error) {
      responseponse.status(500).json({ error: "Couldn't get user" });
    }
  },
  
  async updateUser(request, response) {
    try {
      const [updated] = await User.update(request.body, {
        where: { id: request.params.id }
      });
      if (updated) {
        const updatedUser = await User.findByPk(request.params.id);
        return response.json(updatedUser);
      }
      throw new Error("User not found");
    } catch (error) {
      response.status(400).json({ error: "Couldn't update user" });
    }
  },
  
  async deleteUser(request, response) {
    try {
      const deleted = await User.destroy({
        where: { id: request.params.id }
      });
      if (deleted) {
        return response.json({ message: "User deleted" });
      }
      throw new Error("User not found");
    } catch (error) {
      response.status(400).json({ error: "Couldn't delete user" });
    }
  }
};