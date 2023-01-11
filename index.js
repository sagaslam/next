const puppeteer = require('puppeteer')
const qrcode = require('qrcode-terminal')
const { Client, LocalAuth } = require('whatsapp-web.js')
//const path = require('path')
const authURL = 'https://www.next.co.uk/secure/account/Login'
const acctURL = 'https://www.next.co.uk/secure/account/myaccount'
const signoutURL = 'https://www.next.co.uk/forget-me'
const keyword = 'VIP'
const number = '447767008265@c.us'

async function initialiseWhatsApp() {
  //Read QRcode only one time
  const client = new Client({
    authStrategy: new LocalAuth()
  })

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
  })

  client.on('ready', () => {
    console.log('client ready')

    // const text = 'Hey!'
    // client.sendMessage(number, text)
  })

  client.initialize()
}

async function login(username, password) {
  // Open a new browser and navigate to the login page
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 150,
    devtools: true
  })
  const page = await browser.newPage()

  //await initialiseWhatsApp()

  await page.goto(authURL)

  // Check the current URL
  const currentUrl = await page.url()
  console.log(currentUrl)
  if (currentUrl === authURL) {
    try {
      await page.waitForSelector('#onetrust-button-group-parent', 30000)
      await page.click('#onetrust-accept-btn-handler')
    } catch (e) {
      console.log(e)
    }

    await page.type('#EmailOrAccountNumber', username)
    await page.type('#Password', password)
    await page.click('#SignInNow')

    await page.waitForNavigation()

    const VIPstate = await page.waitForXPath(
      "/html/body//a[contains(text(),'VIP')]"
    )

    debugger

    console.log(VIPstate)

    try {
      while (
        !!(await page.waitForXPath("/html/body//a[contains(text(),'VIP')]"))
      ) {
        await page.goto(acctURL)
        await page.reload()

        const content = await page.content()

        await delay(13 * 1000)
      }
    } catch (err) {
      console.error('Error in myProgram: %o', err)
    } finally {
      //await browser.close()
    }
  }

  async function delay(ms, state = null) {
    // Generate a random number between 5 and 10
    const randomTime = Math.floor(Math.random() * 6) + 5
    return new Promise((resolve, reject) => {
      window.setTimeout(() => resolve(state), ms + randomTime * 1000)
    })
  }
}

login('SE918533', 'maldives1')
