/**
 * Logs
 *
 * @author Dev Lop
 */
const { version } = require("../../package.json");

exports.sayLog = (message) => {
  console.log("\x1b[36m[KITSUNE BOT | TALK]\x1b[0m", message);
};

exports.inputLog = (message) => {
  console.log("\x1b[30m[KITSUNE BOT | INPUT]\x1b[0m", message);
};

exports.infoLog = (message) => {
  console.log("\x1b[34m[KITSUNE BOT | INFO]\x1b[0m", message);
};

exports.successLog = (message) => {
  console.log("\x1b[32m[KITSUNE BOT | SUCCESS]\x1b[0m", message);
};

exports.errorLog = (message) => {
  console.log("\x1b[31m[KITSUNE BOT | ERROR]\x1b[0m", message);
};

exports.warningLog = (message) => {
  console.log("\x1b[33m[KITSUNE BOT | WARNING]\x1b[0m", message);
};

exports.bannerLog = () => {
  console.log("\x1b[35m=================================================\x1b[0m");
  console.log("\x1b[35m           KITSUNE BOT v" + version + "                \x1b[0m");
  console.log("\x1b[35m=================================================\x1b[0m");
};
