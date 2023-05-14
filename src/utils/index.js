const _ = require('lodash');
const { Types } = require('mongoose');
const getInfoData = ({ fields = [], source = {} }) => {
  return _.pick(source, fields);
};

// ['a', b] = {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]));
};

// ['a', b] = {a: 0, b: 0}
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]));
};

const removeUndefinedObject = obj => {
  Object.keys(obj).forEach(k => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParser = obj => {
  const final = {};
  console.log('before', obj);
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  console.log('after', final);
  return final;
};

const convertToObjectId = id => new Types.ObjectId(id);

const formatCurrency = value => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  }).format(value);
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectId,
  formatCurrency,
};
