const groupsRouter = require("express").Router();

const groupsDB = require("../db/groups");

groupsRouter.get("/", async (req, res) => {
  let groups = await groupsDB.all();
  res.json(groups);
});

groupsRouter.post("/create", async (req, res, next) => {
  try {
    const createdGroup = await groupsDB.create(req.body, token);
    res.json(createdGroup);
  } catch (exception) {
    next(exception);
  }
});

groupsRouter.post("/subscribe", async (req, res, next) => {
  try {
    const subscriptionInfo = await groupsDB.subscribe(req.body.id, req.userId);
    res.json(subscriptionInfo);
  } catch (exception) {
    next(exception);
  }
});

groupsRouter.delete("/subscription", async (req, res, next) => {
  try {
    const unsub = await groupsDB.unsubscribe(req.body.id, req.userId);
    res.json(unsub);
  } catch (exception) {
    next(exception);
  }
});

groupsRouter.get("/subscriptions", async (req, res, next) => {
  try {
    const subscriptions = await groupsDB.getSubscriptions(req.userId);
    res.json(subscriptions);
  } catch (exception) {
    next(exception);
  }
});

groupsRouter.param("groupName", async (req, res, next, groupName) => {
  const group = await groupsDB.getGroupByName(groupName);
  if (group) {
    req.group = group;
  } else {
    next(new Error("Group not found"));
  }
  next();
});

groupsRouter.get("/:groupName", async (req, res) => {
  res.json(req.group);
});

module.exports = groupsRouter;
