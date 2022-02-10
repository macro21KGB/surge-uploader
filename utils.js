import { exec } from 'child_process';
import { createSpinner } from 'nanospinner';

export const baseHTMLTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><<TITLE>></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css">
  </head>
  <body>
    <ul>
      <<LINKS>>
    </ul>
  </body>

`;

export const getSurgeUsername = async () => {
  const spinner = createSpinner('Getting username...');
  spinner.start();

  const usernameQuery = `surge whoami`;
  const username = await new Promise((resolve, reject) => {
    exec(usernameQuery, (error, stdout, _) => {
      if (error) {
        spinner.stop();
        reject(error);
      }
      spinner.stop();
      resolve(stdout);
    })
  });

  return username;
}


export const deleteTerminalCharactersFromName = (email) => {
  const name = email.split("@")[0];
  const regex = /\[4m(.*)/gi;
  const match = name.match(regex);
  return match ? match[0].replace("[4m", "") : null;

}