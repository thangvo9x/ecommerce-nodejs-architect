'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.helper');

const connectString = 'mongodb://127.0.0.1:27017/shopDEV';

class Database {
  constructor() {
    this.connect();
  }

  // connect
  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectString)
      .then((_) =>
        console.log('connected mongodb success PRO!', countConnect())
      )
      .catch((err) => console.log('error connnect db', err));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceDB = Database.getInstance();

module.exports = instanceDB;
