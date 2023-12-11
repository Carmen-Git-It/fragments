const { createErrorResponse, createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const id = req.params.id;
  logger.info('Attempt to PUT fragment: ' + id + ' by user: ' + req.user);
  try {
    const frag = await Fragment.byId(req.user, id);
    if (
      !Buffer.isBuffer(req.body) ||
      contentType.parse(req).type != contentType.parse(frag.type).type
    ) {
      logger.error('PUT /fragments request body is not of type Buffer: ', req.body);
      res.status(400).json(createErrorResponse(400, `invalid content-type for fragment`));

      // Return to ensure we don't write any data
      return;
    }
    frag.setData(Buffer.from(req.body));
    logger.info('Successfully PUT fragment: ' + id);
    res.status(200).json(
      createSuccessResponse({
        fragment: {
          id: frag.id,
          ownerId: frag.ownerId,
          created: frag.created,
          updated: frag.updated,
          type: frag.type,
          size: frag.size,
        },
      })
    );
  } catch (e) {
    logger.error('Could not find fragment: ' + id + ' owned by: ' + req.user);
    res
      .status(404)
      .json(
        createErrorResponse(
          404,
          'Unable to find fragment: ' +
            id +
            ' with owner: ' +
            req.user +
            ' invalid PUT request.' +
            e
        )
      );
  }
};
