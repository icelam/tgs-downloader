import colors from 'colors/safe.js';

/**
 * Show message in terminal
 * @param {string|array} message - message to show
 */
const showMessage = (message, { color, emoji } = {}) => {
  if (Array.isArray(message)) {
    const messageWithColor = message.map((messagePart, i) => {
      const messageColor = typeof color === 'string'
        ? color
        : color[i];

      const fullMessage = emoji && i === 0 ? `${emoji}  ${messagePart}` : messagePart;
      const applyColor = messageColor
        ? colors[messageColor]
        : (text) => text;

      return applyColor(fullMessage);
    });
    console.info(...messageWithColor);
  } else {
    const fullMessage = emoji ? `${emoji}  ${message}` : message;
    const applyColor = color
      ? colors[color]
      : (text) => text;

    console.info(applyColor(fullMessage));
  }
};

export default showMessage;
