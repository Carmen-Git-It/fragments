const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const MarkdownIt = require('markdown-it');
const contentType = require('content-type');
const md = new MarkdownIt();

/**
 * Get the data for a specific Fragment in a variety of formats
 */
module.exports = async (req, res) => {
  logger.info('GET request to getById: ' + req.params.id);
  // Split in case of fragmentID.txt or some other type
  let params = req.params.id.split('.');
  const id = params[0];
  // Get the fragment
  try {
    const fragment = await Fragment.byId(req.user, id);
    let data = await fragment.getData();
    if (params.length > 1) {
      if (fragment.isSupportedExtension(params[1])) {
        if (params[1] === 'txt') {
          res.set('content-type', 'text/plain');
        } else if (params[1] === 'html') {
          res.set('content-type', 'text/html');
          if (contentType.parse(fragment.type).type === 'text/markdown') {
            logger.info('Converting fragment markdown to html');
            data = md.render(data.toString());
          }
        } else if (params[1] === 'md') {
          res.set('content-type', 'text/markdown');
        } else if (params[1] === 'json') {
          res.set('content-type', 'application/json');
        }
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
      res.set('content-type', fragment.type);
    }
    // Send the data with the corresponding content-type header
    res.status(200).send(data);
  } catch (e) {
    logger.error({ e }, `Could not find Fragment matching ownerId:${req.user} id:${id}`);
    res
      .status(404)
      .json(
        createErrorResponse(404, `Could not find Fragment matching ownerId: ${req.user} id:${id}`)
      );
  }
};
