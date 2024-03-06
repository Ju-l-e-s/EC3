const mongoose = require('mongoose');
const Article = require('./articles.schema');

class ArticleService {
  getAll() {
    return Article.find();
  }

  async getAllByUser(userId) {
    return await Article.find({ user: mongoose.Types.ObjectId(userId) })
      .populate('user', '-password')
      .exec();
  }
  create(data) {
    const article = new Article(data);
    return article.save();
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
}

module.exports = new ArticleService();
