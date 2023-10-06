const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  const expanded = 'expanded' in req.query ? (req.query.expanded === '1' ? true : false) : false;

  Fragment.byUser(req.user, expanded).then((data) => {
    res.status(200).json(createSuccessResponse({ fragments: data }));
  });
};
