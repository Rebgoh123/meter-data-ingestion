var express = require('express');
var db = require('../db');

const validateSessionKey = (req, res, next) => {
  const sessionKey = req.headers['x-session-key'];
  if (!sessionKey || sessionKey !== req.sessionID) {
    return res.status(401).json({ error: 'Invalid or missing session key' });
  }
  next();
};

function fetchTodos(req, res, next) {
  db.query('SELECT * FROM todos WHERE owner_id = ?', [
    req.user.id
  ], function(err, rows) {
    if (err) { return next(err); }

    var todos = rows.map(function(row) {
      return {
        id: row.id,
        title: row.title,
        completed: row.completed === 1 ? true : false,
      }
    });
    res.locals.todos = todos;
    res.locals.activeCount = todos.filter(function(todo) { return !todo.completed; }).length;
    res.locals.completedCount = todos.length - res.locals.activeCount;
    next();
  });
}

var router = express.Router();

/* GET home page. */
router.get('/todos',
    validateSessionKey,
    function(req, res, next) {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      next();
    },
    fetchTodos,
    function(req, res, next) {
      res.json({
        user: req.user,
        todos: res.locals.todos
      });
    }
);
module.exports = router;
