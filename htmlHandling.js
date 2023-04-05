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
		<style>
			#project-list {
			  display: grid;
			  max-width: 95%;
			  margin: 1rem auto;
			  flex-wrap: wrap;
			  gap: 0.5rem;
			  grid-template-columns: repeat(4, 1fr);
			}

			body {
			  display: flex;
			  flex-direction: column;
			  justify-content: center;
			}

			input {
			  border: none;
			  margin: 1rem 1rem;
			  padding: 0.5rem 0.8rem;
			  border-radius: 10px;
			  border: 2px solid rgb(99, 99, 216);
			  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.136);
			}

			.a-project {
			  padding: 0.5rem 0.8rem;
			  border-radius: 10px;
			  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.136);

			  display: flex;
			  justify-content: center;
			  align-items: center;
			  text-align: center;


			}

			@media screen and (max-width: 768px) {
			  #project-list {
				grid-template-columns: repeat(2, 1fr);
			  }
			}

			@media screen and (max-width: 450px) {
			  #project-list {
				grid-template-columns: repeat(1, 1fr);
			  }
			}
		</style>
    </head>
    <body>
	  <input id="filter" type="text" placeholder="Filter projects...">
      <ul id="project-list">
        <<LINKS>>
      </ul>
	  
	  <script>
		const projects = document.querySelectorAll('.a-project');
		const inputFitler = document.querySelector('#filter');

		inputFitler.addEventListener('input', (e) => {
		  const filter = e.target.value.toLowerCase();

		  if (filter === '') {
			projects.forEach((project) => {
			  project.style.display = 'block';
			});
			return;
		  }

		  projects.forEach((project) => {
			const text = project.textContent.toLowerCase();
			if (text.includes(filter)) {
			  project.style.display = 'block';
			} else {
			  project.style.display = 'none';
			}
		  });
		});
	  </script>
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
        <a class="a-project" href="https://${project}" target="_blank">${project}</a>
      `
	}).join('');


	const newHTML = getBaseHTMLTemplate(homeDir)
		.replace("<<LINKS>>", projectsHTML)
		.replace("<<TITLE>>", currentUsername + "'s Surge Projects");

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
