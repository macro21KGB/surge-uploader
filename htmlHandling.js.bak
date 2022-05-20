import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { deleteTerminalCharactersFromName } from './utils.js';
import chalk from 'chalk';
import { homeDir } from './index.js';
export const getBaseHTMLTemplate = (homeDir) => {

  const defaultHTML = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title><<TITLE>></title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
    </head>
    <body>
      <ul id="project-list>
        <<LINKS>>
      </ul>
    </body>
  
   `
  const htmlTemplatePath = join(homeDir, 'surge-uploader-template.html');
  try {
    if (!existsSync(homeDir)) mkdirSync(homeDir);

    //check if the file exists
    if (!existsSync(htmlTemplatePath)) {
      //if not, create it
      console.log(chalk.yellow('No template file found, created one at: ' + htmlTemplatePath));
      writeFileSync(htmlTemplatePath, defaultHTML);
      return defaultHTML;
    }
    return readFileSync(htmlTemplatePath, 'utf8');
  }
  catch (e) {
    console.log(chalk.red(e));
  }

};


const generateProjectHTML = (projectNames, currentUsername) => {

  const projectsHTML = projectNames.map(project => {
    return `
        <li class="li-project">
          <a class="a-project" href="https://${project}" target="_blank">${project}</a>
        </li>
      `
  }).join('');


  const newHTML = getBaseHTMLTemplate(homeDir)
    .replace("<<LINKS>>", projectsHTML)
    .replace("<<TITLE>>", deleteTerminalCharactersFromName(currentUsername) + "'s Surge Projects");

  return newHTML;
}

const writeHTMLToFile = (html) => {
  const htmlFolderPath = join(homeDir, 'surge-uploader');

  //check if the folder exists
  if (!existsSync(htmlFolderPath)) {
    //if not, create it
    mkdirSync(htmlFolderPath);
  }

  const htmlFilePath = join(htmlFolderPath, 'index.html');
  writeFileSync(htmlFilePath, html);

}

export {
  generateProjectHTML,
  writeHTMLToFile,

};
