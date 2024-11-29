const { execSync } = require("child_process");

function executeCommand(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Command failed: ${command}\n${error.message}`);
  }
}

module.exports = { executeCommand };
