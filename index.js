#!/usr/bin/env node


// Dependencies
import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import figlet from 'figlet';
import chalkAnimation from 'chalk-animation';
import { exec } from 'child_process';
import { createSpinner } from 'nanospinner';
import fs from 'fs';
import baseHTMLTemplate from './settings.js';

const user = {
  username: '',
  password: ''
}


const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));

const askUserCredentials = async () => {
  const answers = await inquirer.prompt([{
    name: 'username',
    type: 'input',
    message: 'Enter your Surge username:'
  },
  {   
    name: 'password',
    type: 'input',
    message: 'Enter your Surge password:'
  }]
)

  user.username = answers.username;
  user.password = answers.password;

}

const loadUserCredentials = () => {
  // Load user credentials from a file
  //

  try {

  
    const credentials = fs.readFileSync('./credentials.json');
    const credentialsJSON = JSON.parse(credentials);

    user.username = credentialsJSON.username;
    user.password = credentialsJSON.password;


  } catch (error) {
    console.log(chalk.red(`
      ${error}
    `))
  }

}

const welcome = async () => {

  figlet('Surge Uploader', (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(chalk.green(data));
  });

  await sleep(1000);

  // Load the user credentials from the file
  loadUserCredentials();

  console.log(`
    ${chalk.bgGreen("Current user:")} ${ user.username !== "" ? chalk.green(user.username) : chalk.red("Not logged in") }
  `)

}


const executeSurgeQuery = async () => {
  //execute surge list in the terminal and return the output

  const spinner = createSpinner('Executing query...');
  spinner.start();

  const surgeQuery = `surge list`;

  const surgeOutput = await new Promise((resolve, reject) => {

    exec(surgeQuery, (error, stdout, stderr) => {
      if (error) {
        spinner.stop();
        reject(error);
      }
      spinner.stop();
      resolve(stdout);
    });
  });


  return surgeOutput;

}

const getSurgeProjects = async () => {
// Get the list of projects from surge

  const surgeOutput = await executeSurgeQuery();
  const projects = surgeOutput.split('\n');
  const regex = /([\w\-]+\.surge.sh)/gi;

  const projectNames = projects.map(project => {
    const match = project.match(regex);
    return match ? match[0].replace("39m", "") : null;
  }).filter(project => project !== null);
  
  return projectNames;
}

const generateProjectHTML = (projectNames) => {

  const projectsHTML = projectNames.map(project => {
    return `
      <li>
        <a href="https://${project}" target="_blank">${project}</a>
      </li>
    `
  }).join('');


  const newHTML = baseHTMLTemplate.replace("<<LINKS>>", projectsHTML )

  return newHTML;
}


await welcome();
if ( user.username === "" ) {
  await askUserCredentials();
}
const allProjects = await getSurgeProjects();
const html = generateProjectHTML(allProjects);

console.log(html);

