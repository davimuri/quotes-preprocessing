# Quotes Preprocessing
* Downloads html files with quotes, make a preprocessing of the quotes and loads them in DynamoDB.
* First run scrapper.js and then run db_uploader.js

## scrapper.js

* Uses axios and cheerio to download the html files and get the quotes.
* Quotes are stored in temporal file in JSON format.

## db_uploader.js

* Uses aws-sdk to connect DynamoDB and load the quotes
* It assumes the aws cli is already configured with credentials. AWS-SDK takes the credentials from there.
