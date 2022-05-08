import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('e2e basic test', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      // headless: false, // show gui
      // slowMo: 250,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('Should find plus button and click it', async () => {
    await page.goto(baseUrl);
    await page.$eval('#plus_btn', (e) => {
      e.click();
    });
    await page.type('#add-product-form > .modal_name > input', 'test');
    await page.type('#add-product-form > .modal_price > input', '123');
    await page.click('#add-product-form .modal_save');
  });
});
