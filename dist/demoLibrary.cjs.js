'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var minimal = require('@sentry/minimal');

const createMessage = (message) => {
  console.log('Capturing a message');
  minimal.captureMessage(message || 'This is a test message from the library');
  return 'The message was captured'
};

exports.createMessage = createMessage;
