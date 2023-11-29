const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const contentType = require('content-type');
const logger = require('../../logger');

/**
 * Get a list of fragments for the current user
 */

module.exports = async (req, res) => {
  const url = process.env.API_URL ? process.env.API_URL : 'http://' + req.headers.host;

  // check that the POSTed data is a buffer.
  if (!Buffer.isBuffer(req.body)) {
    logger.error('POST /fragments request body is not of type Buffer: ', req.body);
    res.status(415).json(createErrorResponse(415, `unsupported filetype`));

    // Return to ensure we don't write any data
    return;
  }

  try {
    const parsed = contentType.parse(req);

    // Create a new fragment and set the data, save it to the DB
    let fragment = new Fragment({
      ownerId: req.user,
      type: contentType.format(parsed),
    });

    await fragment.setData(Buffer.from(req.body));
    await fragment.save();
    logger.info('Created and saved new fragment: ', fragment);
    res.append('Location', url + '/v1/fragments/' + fragment.id);
    res.append('Access-Control-Expose-Headers', 'Location');
    res.status(201).json(
      createSuccessResponse({
        fragment: {
          id: fragment.id,
          ownerId: fragment.ownerId,
          created: fragment.created,
          updated: fragment.updated,
          type: fragment.type,
          size: fragment.size,
        },
      })
    );
  } catch (e) {
    logger.error('Error creating new fragment: ' + e);
    createErrorResponse(415, 'Error creating new fragment');
  }
};
