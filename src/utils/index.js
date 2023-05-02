const _ = require('lodash');
const getInfoData = ({ fields = [], source = {} }) => {
  return _.pick(source, fields);
};

module.exports = { getInfoData };
