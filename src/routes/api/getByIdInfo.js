const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get the metadata for a specific Fragment
 */
module.exports = async (req, res) => {
  logger.info('GET request to get info by Id: ', req.params.id);
  // Split in case of fragmentID.txt or some other type
  let params = req.params.id.split('.');
  const id = params[0];
  // Get the fragment
  try {
    const fragment = await Fragment.byId(req.user, id);
    logger.info(`Got metadata for fragment: ${fragment.id}`);
    // Send the metadata
    res.status(200).json(createSuccessResponse(fragment));
  } catch (e) {
    logger.error({ e }, `Could not find Fragment matching ownerId:${req.user} id:${id}`);
    res
      .status(404)
      .json(
        createErrorResponse(404, `Could not find Fragment matching ownerId:${req.user} id:${id}`)
      );
  }
};
