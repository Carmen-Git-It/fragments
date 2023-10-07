const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get the data for a specific Fragment in a variety of formats
 */
module.exports = (req, res) => {
  logger.info('GET request to getById: ', req.params.id);
  let params = req.params.id.split('.');
  const id = params[0];
  Fragment.byId(req.user, id)
    .then((fragment) => {
      fragment.getData().then((data) => {
        if (params.length > 1) {
          if (params[1] === 'txt') {
            res.set('content-type', 'text/plain');
          } else {
            logger.error('Invalid filetype in getById request: ', params[1]);
            throw new Error(`Invalid filetype: .${params[1]}`);
          }
        } else {
          res.set('content-type', 'data.type');
        }
        res.status(200).send(data);
      });
    })
    .catch((e) => {
      logger.error({ e }, `Could not find Fragment matching ownerId:${req.user} id:${id}`);
      res
        .status(404)
        .json(
          createErrorResponse(404, `Could not find Fragment matching ownerId:${req.user} id:${id}`)
        );
    });
};
