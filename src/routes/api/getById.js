const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get the data for a specific Fragment in a variety of formats
 */
module.exports = async (req, res) => {
  logger.info('GET request to getById: ', req.params.id);
  // Split in case of fragmentID.txt or some other type
  let params = req.params.id.split('.');
  const id = params[0];
  // Get the fragment
  try {
    const fragment = await Fragment.byId(req.user, id);
    const data = await fragment.getData();
    if (params.length > 1) {
      if (params[1] === 'txt') {
        res.set('content-type', 'text/plain');
      } else {
        logger.error('Invalid filetype in getById request: ', params[1]);
        res
          .status(415)
          .json(
            createErrorResponse(
              415,
              `Could not process fragment id:${id} as filetype .${params[1]}`
            )
          );
        return;
      }
    } else {
      res.set('content-type', data.type);
    }
    // Send the data with the corresponding content-type header
    res.status(200).send(data);
  } catch (e) {
    logger.error({ e }, `Could not find Fragment matching ownerId:${req.user} id:${id}`);
    res
      .status(404)
      .json(
        createErrorResponse(404, `Could not find Fragment matching ownerId:${req.user} id:${id}`)
      );
  }
};
