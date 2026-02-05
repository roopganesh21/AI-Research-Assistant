function getTimestamp() {
  return new Date().toISOString();
}

const logger = {
  info: (message) => {
    console.log(`[INFO] [${getTimestamp()}] ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR] [${getTimestamp()}] ${message}`);
  },
  warn: (message) => {
    console.warn(`[WARN] [${getTimestamp()}] ${message}`);
  }
};

module.exports = logger;
