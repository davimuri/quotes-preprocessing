const aws = require('aws-sdk')
const fs = require('fs')

aws.config.update({
  region: 'eu-central-1'
})

const docClient = new aws.DynamoDB.DocumentClient()

console.log("Importing quotes into DynamoDB. Please wait.")

const quotes = JSON.parse(fs.readFileSync('quote_files/quotes.json', 'utf8'))

const dbParams = (quote) => {
  return {
    TableName: 'quotes',
    Item: {
      'id': quote.number,
      'data': quote
    }
  }
}

const insertQuote = (quote) => {
  const params = dbParams(quote)
  docClient.put(params, (error, data) => {
    if (error) {
      const message = JSON.stringify(error, null, 2)
      console.error(`Èrror inserting quote ${quote.number} message: ${message}`)
    }
  })
}


quotes.forEach(quote => {
  insertQuote(quote)
})
