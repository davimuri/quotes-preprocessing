const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

const MAX_QUOTE = 261
const SOFTWARE_QUOTES_URL = 'https://www.comp.nus.edu.sg/~damithch/quotes/quote'

const getQuote = (html) => {
  const index = html.indexOf('<br>')
  if (index > 0) {
    return html.substring(0, index)
  }
  return null
}

const appendToFile = (text) => {
  fs.appendFile('quote_files/quotes.json', text+'\n', function (err) {
    if (err) throw err
  })
}

const createFileAndWrite = (fileName, text) => {
  fs.writeFile(fileName, text, function (err) {
    if (err) throw err
    //console.log('Saved!');
  })
}

const downloadOriginalFile = (url, fileName) => {
  axios.get(url)
    .then(response => {
      const html = response.data
      createFileAndWrite(fileName, html)
    })
    .catch(error => {
      console.error(error)
    })
}

const downloadAllOriginalFiles = () => {
  for (i = 1; i <= MAX_QUOTE; i++) {
    const url = `${SOFTWARE_QUOTES_URL}${i.toString()}.htm`
    downloadOriginalFile(url, `quote_files/${i.toString()}.html`)
  }  
}

const cleanText = (text) => {
  return text.replace(/\t/g, '')
    .replace(/\r\n/g, '')
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ')
    .replace('[]', '')
    .replace('()', '')
    .replace('( )', '')
    .trim()
}

const getQuoteFromHtml = (quoteNumber, html) => {
  const $ = cheerio.load(html, {
    normalizeWhitespace: true,
    decodeEntities: true
  })

  let links = []
  $.root().find('a').each((index, element) => {
    const text = cleanText($(element).text())
    links.push({
      href: $(element).attr('href'),
      text
    })
    if (text === 'source') {
      $(element).remove()
    }
  })

  //console.log(links)
  
  const quoteText = cleanText($.text())
  //console.log(quoteText)

  return {
    number: quoteNumber,
    text: quoteText,
    links
  }
}

const processAllOriginalFiles = async () => {
  let quotes = []
  for (i = 1; i <= MAX_QUOTE; i++) {
    const fileName = `quote_files/${i.toString()}.html`
    const data = await fs.promises.readFile(fileName)
    quotes.push(getQuoteFromHtml(i, data))
  }
  appendToFile(JSON.stringify(quotes))
}

processAllOriginalFiles()