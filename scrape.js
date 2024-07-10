// const {Builder, By, until} = require('selenium-webdriver');
// const fs = require('fs');
// const path = require('path');

// (async function scrape() {
//     // Set up the Selenium WebDriver
//     let driver = await new Builder().forBrowser('chrome').build();

//     try {
//         // Navigate to the URL
//         await driver.get('https://india.1xbet.com/betsonyour/live');

//         // Wait until the required elements are loaded
//         await driver.wait(until.elementLocated(By.css('.dashboard-content')), 10000);

//         // Scrape the data
//         let data = [];
//         let elements = await driver.findElements(By.css('.c-events__teams .c-events-scoreboard__team-wrap'));
//         console.log(`Found ${elements.length} dashboard content elements.`);

//         for (let element of elements) {     elements=   [{ },{} ]
//             try {
//                 console.log(element,"LLKL")
//                 let name = await element.findElement(By.css(' .c-events__team')).getText();
//                 let otherField = await element.findElement(By.css('.c-events__team')).getText();
//                 data.push({ name, otherField });
//                 console.log(`Scraped data - Name: ${name}, Other Field: ${otherField}`);
//             } catch (error) {
//                 console.error('Error scraping data from an element:', error);
//             }
//         }

//         // Check if data is scraped
//         console.log(`Total data items scraped: ${data.length}`);

//         // Convert data to CSV format
//         const csvHeader = 'Name,Other Field\n';
//         const csvRows = data.map(row => `${row.name},${row.otherField}`).join('\n');
//         const csvContent = csvHeader + csvRows;

//         // Write the data to a CSV file
//         const filePath = path.join(__dirname, 'output.csv');
//         fs.writeFileSync(filePath, csvContent, 'utf8');
//         console.log('Data written to CSV file');
//     } catch (error) {
//         console.error('Error in the scraping process:', error);
//     } finally {
//         await driver.quit();
//     }
// })();
const {Builder, By, until} = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

(async function scrape() {
    // Set up the Selenium WebDriver
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Navigate to the URL
        await driver.get('https://india.1xbet.com/betsonyour/live');

        // Wait until the required elements are loaded
        await driver.wait(until.elementLocated(By.css('.dashboard-content')), 10000);

        // Scrape the data
        let data = [];
        let elements = await driver.findElements(By.css('.c-events__teams .c-events-scoreboard__team-wrap'));
        console.log(`Found ${elements.length} wrap elements.`);

        for (let i = 0; i < elements.length; i += 2) {
            try {
                let team1 = await elements[i].findElement(By.css('.c-events__team')).getText();
                let team2 = (i + 1 < elements.length) ? await elements[i + 1].findElement(By.css('.c-events__team')).getText() : '';
                data.push({ Team1: team1, Team2: team2 });
                console.log(`Scraped data - Team1: ${team1}, Team2: ${team2}`);
            } catch (error) {
                console.error('Error scraping data from an element:', error);
            }
        }

        let elements2 = await driver.findElements(By.css('.c-events-scoreboard__lines .c-events-scoreboard__line'));
        console.log(`Found ${elements.length} wrap elements.`);

        for (let i = 0; i < elements2.length; i += 2) {
            try {
                let score1 = await elements2[i].findElement(By.css('.c-events-scoreboard__cell--all')).getText();
                let score2 = (i + 1 < elements2.length) ? await elements2[i + 1].findElement(By.css('.c-events-scoreboard__cell--all')).getText() : '';
                if (data[i / 2]) {
                    data[i / 2].Score1 = score1;
                    data[i / 2].Score2 = score2;
                } else {
                    data.push({ Team1: '', Team2: '', Score1: score1, Score2: score2 });
                }
                // data.push({ Score1: score1, Score2: score2 });
                console.log(`Scraped dataaaaaa - Team1: ${score1}, Team2: ${score2}`);
            } catch (error) {
                console.error('Error scraping data from an element:', error);
            }
        }

        // Check if data is scraped
        console.log(`Total data items scraped: ${data.length}`);

        // Convert data to CSV format
        const csvHeader = 'Team1,Team2,Score1,Score2\n';
        const csvRows = data.map(row => `${row.Team1},${row.Team2},${row.Score1},${row.Score2}`).join('\n');
        const csvContent = csvHeader + csvRows;

        // Write the data to a CSV file
        const filePath = path.join(__dirname, 'output.csv');
        fs.writeFileSync(filePath, csvContent, 'utf8');
        console.log('Data written to CSV file');
    } catch (error) {
        console.error('Error in the scraping process:', error);
    } finally {
        await driver.quit();
    }
})();
