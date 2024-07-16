const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

(async function scrape() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("https://india.1xbet.com/line/tennis");
    await driver.wait(
      until.elementLocated(By.css(".dashboard-content")),
      10000
    );

    let container = await driver.findElement(By.css(".dashboard-content"));
    let innerDiv = await container.findElement(By.xpath("./div"));

    let elementss = await innerDiv.findElements(By.xpath("./div"));

    let data = [];
    for (let i = 0; i < elementss.length; i += 1) {
      try {
        let event = await elementss[i]
          .findElement(
            By.css(
              ".fixed-heading .c-events__item .c-events__name .c-events__liga"
            )
          )
          .getText();

        let teamNames = await elementss[i].findElements(
          By.css(".c-events__teams .c-events__team")
        );
        let teams = {};
        for (let j = 0; j < teamNames.length; j++) {
          let teamName = await teamNames[j].getText();
          teams[`Team${j + 1}`] = teamName;
        }

        let teamScores = await elementss[i].findElements(
          By.css(
            ".c-events__time-info .c-events__time .c-events-time__val"
          )
        );
        let scores = {};
        for (let k = 0; k < teamScores.length; k++) {
          try {
            let teamScore = await teamScores[k].getText();
            scores[`Time${k + 1}`] = teamScore;
          } catch (error) {
            console.error("Error scraping score data:", error);
          }
        }

        let head = await elementss[i].findElements(
          By.css(
            ".dashboard-champ-content .fixed-heading .c-events__item .c-bets .c-bets__bet"
          )
        );
        let maxValues = [];
        for (let l = 0; l < head.length; l++) {
          let max = await head[l]
            .findElement(By.css(".c-bets__title"))
            .getText();
          maxValues.push(max);
        }

        let rowData = { Event: event, ...teams,...scores };
        for (let m = 0; m < maxValues.length; m++) {
          rowData[`head${m + 1}`] = maxValues[m];
        }

        let body = await elementss[i].findElements(
          By.css(
            ".dashboard-champ-content .c-events__item_col .c-bets .c-bets__bet"
          )
        );
        let rate = [];
        for (let n = 0; n < body.length; n++) {
          let rateText = await body[n]
            .findElement(By.css(".c-bets__inner"))
            .getText();
          rate.push(rateText);
        }
        for (let o = 0; o < rate.length; o++) {
          rowData[`Rate${o + 1}`] = rate[o];
        }

        data.push(rowData);
      } catch (error) {
        console.error("Error scraping data from an element:", error);
      }
    }

    const jsonData = JSON.stringify(data, null, 2);
    const filePath = path.join(__dirname, "upcoming_tennis.json");
    fs.writeFileSync(filePath, jsonData, "utf8");
    console.log("Data written to JSON file");
  } catch (error) {
    console.error("Error in the scraping process:", error);
  } finally {
    await driver.quit();
  }
})();
