#!/usr/bin/env node

// Dependencies
import chalk from 'chalk';
import { exec } from 'child_process';
import figlet from 'figlet';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import path, { join } from 'path';
import { getSurgeUsername, deleteTerminalCharactersFromName } from './utils.js';
import { generateProjectHTML, writeHTMLToFile } from './htmlHandling.js';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { exit } from 'process';

const sleep = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));
export const homeDir = join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], 'surge-upl');

let currentUsername = '';
let currentSiteName = '';

const welcome = async () => {
  figlet('\nSurge Uploader', (err, data) => {
    if (err) {
      console.log('Something went wrong...');
      console.dir(err);
      return;
    }
    console.log(chalk.green(data));
  });

  await sleep(1000);
  currentUsername = await getSurgeUsername();

  console.log(`
    ${chalk.bgRed('Make sure you have a surge account and you are logged in')}
    ${chalk.green("Current user:")} ${currentUsername !== "" ? currentUsername : chalk.red("Not logged in")}
  `)

}


const executeGetSurgeProjects = async () => {

  //execute surge list in the terminal and return the output
  const spinner = createSpinner('Getting Surge Projects...');
  spinner.start();

  const surgeQuery = `surge list`;
  const surgeOutput = await new Promise((resolve, reject) => {

    exec(surgeQuery, (error, stdout, _) => {
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

const askIfPushToSurge = async () => {
  const answers = inquirer.prompt({
    type: 'confirm',
    name: 'pushToSurge',
    message: 'Do you want to push the generated HTML to Surge?'
  });

  const finalAnswers = (await answers).pushToSurge;

  return finalAnswers;
}

const getSurgeProjects = async () => {
  // Get the list of projects from surge

  const surgeOutput = await executeGetSurgeProjects();
  const projects = surgeOutput.split('\n');
  const regex = /([\w\-]+\.surge.sh)/gi;

  const projectNames = projects.map(project => {
    const match = project.match(regex);
    return match ? match[0].replace("39m", "") : null;
  }).filter(project => project !== null);

  return projectNames;
}


const pushToSurge = async () => {
  const finalSiteName = currentSiteName == '' ? chosenName.titlePage : currentSiteName;
  const spinner = createSpinner('Pushing to surge...');
  spinner.start();

  const surgeQuery = `surge ${path.join(homeDir, 'surge-uploader')} ${finalSiteName}.surge.sh`;
  await new Promise((resolve, reject) => {
    exec(surgeQuery, (error, stdout, _) => {
      if (error) {
        spinner.stop();
        reject(error);
      }
      spinner.stop();
      console.log(chalk.green(chalk.bold("The site is now available at: https://" + finalSiteName + ".surge.sh")));
      resolve(stdout);
    });
  });

}

const showHomeDirLocations = (homeDir) => {
  console.log(chalk.blue("You can find the generated HTML at: " + chalk.bold(path.join(homeDir, 'surge-uploader', 'index.html'))));
  console.log(chalk.yellow("You can find the template HTML at: " + chalk.bold(path.join(homeDir, 'surge-uploader-template.html'))));
}

// Main code --------------------------------------------------




const argv = yargs(hideBin(process.argv))
  .option('locations', {
    describe: 'Locations to generate HTML for',
  }).option('sitename', {
    describe: 'Site name',
    type: 'string',
    alias: 'sn'
  })
  .alias('locations', 'l')
  .alias('help', 'h')
  .parse()

if (argv.locations) {
  showHomeDirLocations(homeDir);
  exit()
}

if (argv.sitename) {
  if (argv.sitename.endsWith('.surge.sh')) {
    currentSiteName = argv.sitename.replace('.surge.sh', '');
  }
  else
    currentSiteName = argv.sitename;
}


await welcome();

// Get the list of projects from surge
const allProjects = await getSurgeProjects();

// Generate the HTML


const chosenName = await inquirer.prompt({
  type: 'input',
  name: 'titlePage',
  message: 'Title of the page( This will also be the url for the submission to surge)',
  default: deleteTerminalCharactersFromName(currentUsername),
})


const html = generateProjectHTML(allProjects, await chosenName.titlePage);

// Write the HTML to a file in the home directory
writeHTMLToFile(html);

// if the pushToSurgeControl is true, push the HTML to surge otherwise exit
const pushToSurgeControl = await askIfPushToSurge();

if (pushToSurgeControl)
  await pushToSurge();


console.log(chalk.green(chalk.bold("Done!")));
showHomeDirLocations(homeDir);
