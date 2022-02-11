import { exec } from 'child_process';
import { createSpinner } from 'nanospinner';


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