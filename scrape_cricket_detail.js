const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

(async function scrape() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get(
      "https://india.1xbet.com/live/cricket/2618939-agra-district-womens-league/544410247-agra-royals-women-the-aryans-cricket-academy-women"
    );
    await driver.wait(until.elementLocated(By.css(".c-sport-content")), 10000);

    await driver.wait(until.elementLocated(By.css(".bet_group_col")), 10000); // Change .table-selector to the actual selector for the table

    // Scrape the table data
    let data = [];
    let table = await driver.findElement(By.css(".bet_group_col")); // Change .table-selector to the actual selector for the table
    let rows = await table.findElements(By.xpath("./div"));
    for (let i = 0; i < rows.length; i++) {
      let obj = {};
      let header = await rows[i]
        .findElement(By.css(".bet_group .bet-title__label"))
        .getText();
      let bets = await rows[i].findElements(
        By.css(".bet_group .bets .bet-inner")
      );
      obj.head = header;
      let arrValue = [];
      let values = {};

      for (let j = 0; j < bets.length; j++) {
        let text = await bets[j].findElement(By.css(".bet_type")).getText();
        let rates = await bets[j].findElement(By.css(".koeff")).getText();
        values.type = text;
        values.rate = +rates;
        arrValue.push(values);
        values = {};
      }
      obj.values = arrValue;

      data.push(obj);
    }

    const jsonData = JSON.stringify(data, null, 2);
    const filePath = path.join(__dirname, "output_cricket_detail.json");
    fs.writeFileSync(filePath, jsonData, "utf8");
    console.log("Data written to JSON file");
  } catch (error) {
    console.error("Error in the scraping process:", error);
  } finally {
    await driver.quit();
  }
})();
