const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const contentType = require('content-type');

/**
 * Get a list of fragments for the current user
 */

module.exports = (req, res) => {
  const url = process.env.API_URL ? process.env.API_URL : req.headers.host;

  if (!Buffer.isBuffer(req.body)) {
    res.status(415).json(createErrorResponse(415, `unsupported filetype`));
  }

  const parsed = contentType.parse(req);

  // TODO: HASH the email
  let fragment = new Fragment({
    ownerId: req.user,
    type: parsed.type,
  });

  fragment.setData(req.body);
  fragment.save();

  res.append('Location', url + '/v1/fragments/' + fragment.id);
  res.status(201).json(createSuccessResponse({}));
};
