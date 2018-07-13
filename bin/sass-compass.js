#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const help = require('./helper');
const shell = require('shelljs');
const colors = require('colors');
const cwdPath = process.cwd();
const package = require('../package.json');
const templatePath = path.resolve(__dirname, '../template');
const program = require('./commander');
let npmtype; //npm or cnpm
/**
 * @param {string} path
 * @returns {boolean} 路径是否存在
 */
function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}
/**
 * copy file from templatePath to targetPath 
 * @param {string} templatePath 
 * @param {string} targetPath 
 */
function copyFile(templatePath, targetPath) {
  fs.writeFileSync(targetPath, fs.readFileSync(templatePath));
}

function confirmOverride() {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    terminal.question('Floder is already exits, do you want override it ? yes/no ', answer => {
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        resolve(true);
        terminal.close();
      } else {
        process.exit();
      }
    });
  });
}

function confirmnpmtype() {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve, reject) => {
    terminal.question('\nnpm[1] or cnpm[2],which one will you use? 1/2 ', answer => {
      if (answer == 1) {
        resolve(true);
        npmtype = 'npm';
        terminal.close();
      } else if (answer == 2) {
        resolve(true);
        npmtype = 'cnpm';
        terminal.close();
      } else {
        process.exit();
      }
    });
  });
}
/**
 * copy template
 * @param {string} templatePath 
 * @param {string} targetPath 
 * @returns {boolean}
 */
function copyTemplate(templatePath, targetPath) {
  try {
    if (fs.statSync(templatePath).isDirectory() && !fsExistsSync(targetPath)) {
      fs.mkdirSync(targetPath);
    }
    const subpaths = fs.readdirSync(templatePath);
    subpaths.forEach(subpath => {
      const tarPath = path.resolve(targetPath, subpath);
      const tempPath = path.resolve(templatePath, subpath);
      console.log('creating...' + tarPath);
      if (fs.statSync(tempPath).isDirectory()) {
        copyTemplate(tempPath, tarPath);
      } else {
        copyFile(tempPath, tarPath);
      }
    });
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

/**
 * @param {string} projectName 
 */
async function installDependencies(projectName) {
  if (await confirmnpmtype()) {
    console.log('\ninstalling,may need several minutes,please wait...');
    if (shell.exec(`cd ${projectName} && ${npmtype} install`).code) {
      console.log(colors.red('install dependencies failed!'));
    } else {
      console.log(
        colors.yellow(
          [
            `Success! Created ${projectName} at ${cwdPath}.`,
            'Inside that directory, you can run several commands and more:',
            '  * npm start: Starts you project.',
            'We suggest that you begin by typing:',
            `  cd ${projectName}`,
            '  npm start',
            'Happy hacking!'
          ].join('\n')
        )
      );
    }
  }
}

/**
 * 
 * 
 * @param {string} projectName 
 */
async function newProject(projectName) {
  const targetPath = `${cwdPath}/${projectName}`;
  if (fsExistsSync(targetPath)) {
    if (await confirmOverride()) {
      if (copyTemplate(templatePath, targetPath)) {
        installDependencies(projectName);
      }
    }
  } else {
    if (copyTemplate(templatePath, targetPath)) {
      installDependencies(projectName);
    }
  }
}

try {
  program.option('-h, --help', help).option('-v, --version', () => {
    console.log(package.version);
  });
  program.command('new <project>').action(newProject);
  program.catch((...argvs) => {
    console.log(colors.red(`Do not use sass-compass ${argvs}`));
    console.log('Run ' + colors.blue('sass-compass --help') + ' to get the Commands that dva-native-cli supports');
  });
  program.parse(process.argv);
} catch (error) {
  console.log(error);
}