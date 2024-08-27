const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = app => {
  app.put("/api/update_user_preferences", async (req, res) => {
    try {
      // Assuming user is logged in and req.user is populated.
      const user = await User.findOne({
        githubId: req.user.githubId
      });
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Update the preferences in the user model and save.
      user.languages = req.body.languages || [];
      user.frameworks = req.body.frameworks || [];
      user.experienceLevel = req.body.experienceLevel;

      await user.save();
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Server error");
    }
  });

  // update user object projectsTracked property in Database
  app.put("/api/track_project", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send("User not logged in");
      }

      const user = await User.findOne({
        githubId: req.user.githubId
      });
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Add the project to the user's tracked projects if it's not already there
      const project = req.body;
      if (!user.projectsTracked.some(p => p.id === project.id)) {
        user.projectsTracked.push(project);
        await user.save();
      }

      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Server error");
    }
  });

  // Remove a tracked project from the user's profile
  app.put("/api/untrack_project", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send("User not logged in");
      }

      const user = await User.findOne({
        githubId: req.user.githubId
      });
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Remove the project from the user's tracked projects
      const projectId = req.body.projectId;
      user.projectsTracked = user.projectsTracked.filter(
        p => p.id !== projectId
      );
      await user.save();

      res.status(200).send(user);
    } catch (error) {
      res.status(500).send("Server error");
    }
  });
};
