/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');

// Set up middleware
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// Create a router on which to mount our API endpoints
const router = express.Router();

// Set up API endpoints
router.get('/fragments', require('./get'));

router.get('/fragments/:id', require('./getById'));

router.get('/fragments/:id/info', require('./getByIdInfo'));

router.post('/fragments', rawBody(), require('./post'));

router.delete('/fragments/:id', require('./delete'));

router.put('/fragments/:id', rawBody(), require('./put'));

module.exports = router;
