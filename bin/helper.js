const colors = require("colors");
module.exports = function help() {
  console.log(
    colors.green(
      [
        "",
        "  Usage: sass-compass [command] [options]",
        "",
        "",
        "  Commands:",
        "",
        "    new <ProjectName> [options]  generates a new project and installs its dependencies",
        "",
        "  Options:",
        "",
        "    -h, --help    output usage information",
        "    -v, --version output the version number",
        ""
      ].join("\n")
    )
  );
};