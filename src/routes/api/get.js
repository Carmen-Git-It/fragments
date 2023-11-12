const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  const expanded = 'expand' in req.query ? (req.query.expand === '1' ? true : false) : false;

  logger.info('GET request for /fragments from user: ', req.user, ' Expanded: ', expanded);

  Fragment.byUser(req.user, expanded).then((data) => {
    res.status(200).json(createSuccessResponse({ fragments: data }));
  });
};
