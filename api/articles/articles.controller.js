const UnauthorizedError = require('../../errors/unauthorized');
const articleService = require('./articles.service');

class ArticlesController {
  async getAll(req, res, next) {
    try {
      const articles = await articleService.getAll();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
  async getAllByUser(req, res, next) {
    try {
      const userId = req.params.userId;
      const articles = await articleService.getAllByUser(userId);
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
  async create(req, res, next) {
    try {
      const article = await articleService.create({
        title: req.body.title,
        content: req.body.content,
        user:  req.user._id,
      });
      req.io.emit('article:create', article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        throw new UnauthorizedError('Only admin users can update articles');
      }
      const id = req.params.id;
      const data = req.body;
      const articleModified = await articleService.update(id, data);
      res.json(articleModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      if (req.user.role !== 'admin') {
        throw new UnauthorizedError('Only admin users can delete articles');
      }
      const id = req.params.id;
      await articleService.delete(id);
      req.io.emit('article:delete', { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
