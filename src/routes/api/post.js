const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const contentType = require('content-type');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */

module.exports = (req, res) => {
  const url = process.env.API_URL ? process.env.API_URL : req.headers.host;

  // check that the POSTed data is a buffer.
  if (!Buffer.isBuffer(req.body)) {
    logger.error('POST /fragments request body is not of type Buffer: ', req.body);
    res.status(415).json(createErrorResponse(415, `unsupported filetype`));
  }

  const parsed = contentType.parse(req);

  // Create a new fragment and set the data, save it to the DB
  let fragment = new Fragment({
    ownerId: req.user,
    type: parsed.type,
  });

  fragment.setData(req.body);
  fragment.save();

  logger.info('Created and saved new fragment: ', fragment);

  // Attach location header, set exposed header control
  res.append('Location', url + '/v1/fragments/' + fragment.id);
  res.append('Access-Control-Expose-Headers', 'Location');
  res.status(201).json(createSuccessResponse({}));
};
