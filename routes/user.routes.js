const { Router } = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.find();
    res.json(user);
  } catch (e) {
    console.log("users_groups_get__", e);
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (e) {
    console.log("users_groups_get_by_id__", e);

    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

router.put("/change/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const _groups = user.group_ids;

      const _currentGroup = _groups.find(
        (group) => group._id == req.body.group_id
      );
      if (_currentGroup) {
        res.json({
          status: true,
          message: "Данный пользователь уже состоит в этой группе",
        });
      } else {
        _groups.push(req.body.group_id);
        await user.updateOne({ group_ids: _groups });
        res.json({ status: true });
      }
    }
  } catch (e) {
    console.log("users_groups_change_by_id__", e);
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

module.exports = router;
