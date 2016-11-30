import fs from 'fs';
import google from 'googleapis';
import GoogleAuth from 'google-auth-library';

function getTokenPath() {
  const USERS = ['igalst', 'mrnd', 'ecom', 'wca'];
  const user = USERS[Math.floor(Math.random() * USERS.length)];
  return `./src/server/credentials/${user}-at-wix-com.json`;
}

function gDocReady(callback) {
  fs.readFile('./src/server/credentials/client_secret.json', (err, content) => {
    if (err) {
      console.log('Error loading client secret file: ', err);
      return;
    }
    authorize(JSON.parse(content), callback);
  });
}

function authorize(credentials, callback) {
  const Auth = new GoogleAuth();
  const oauth2Client = new Auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]);

  fs.readFile(getTokenPath(), (err, token) => {
    if (err) {
      console.error('Error reading token file');
      return;
    }
    oauth2Client.credentials = JSON.parse(token);
    callback(oauth2Client);
  });
}

function addLeadingZero(val) {
  return val < 10 ? `0${val}` : val;
}

export default function process(data) {
  return new Promise((resolve, reject) => {
    const now = new Date();
    const row = [
      `${now.getFullYear()}-${addLeadingZero(now.getMonth())}-${addLeadingZero(now.getDate())}`,
      `${addLeadingZero(now.getHours())}:${addLeadingZero(now.getMinutes())}:${addLeadingZero(now.getSeconds())}`,
      data.uuid,
      `https://static.wixstatic.com/media/${data.mediaUrl}`,
      {0: 'None', 1: 'Wix User', 2: 'CC Meber', 3: 'Wix User, CC Member'}[0 + (data.typeWixUser ? 1 : 0) + (data.typeCCMember ? 2 : 0)],
      data.email,
      data.fullName,
      data.phoneNumber,
      data.country,
      data.description
    ];

    gDocReady(auth => {
      const sheets = google.sheets('v4');
      sheets.spreadsheets.values.append({
        auth,
        spreadsheetId: '1tk5ny7I7tmqq4pE_7-GJ0u4cB6ka-QeWmNIbS9CRTbc',
        range: 'Data!2:9999999',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [row]
        }
      }, (err, response) => {
        if (err) {
          console.log('The API returned an error: ', err);
          reject(err.message);
          return;
        }
        console.log('Success', response);
        resolve({
          apiResponse: response,
          postData: row
        });
      });
    });
  });
}
