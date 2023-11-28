const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  let id = req.params.id;
  logger.info('Attempt to DELETE fragment: ' + id + ' by user: ' + req.user);
  try {
    await Fragment.delete(req.user, id);
    logger.info('Successfully DELETED fragment: ' + id);
    res.status(200).json(createSuccessResponse());
  } catch (e) {
    console.log(e);
    logger.error('Could not find and delete fragment: ' + id + ' owned by: ' + req.user);
    res
      .status(404)
      .json(
        createErrorResponse(
          404,
          'Unable to find fragment: ' +
            id +
            ' with owner: ' +
            req.user +
            ' invalid DELETE request.' +
            e
        )
      );
  }
};
