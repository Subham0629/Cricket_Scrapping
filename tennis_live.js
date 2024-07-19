const { Builder, By, until } = require("selenium-webdriver");
const fs = require("fs");
const path = require("path");

(async function scrape() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.get("https://india.1xbet.com/live/tennis");
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
          By.css(".c-events__teams .c-events-scoreboard__team-wrap")
        );
        let matches = [];
        let teams = [];
        for (let j = 0; j < teamNames.length; j++) {
          let teamName = await teamNames[j].getText();
          teams.push(teamName);
          // teams[`Team${j + 1}`] = teamName;
        }

        let teamScores = await elementss[i].findElements(
          By.css(".c-events-scoreboard__lines")
        );
        let footballPoints = [];

        for (let m = 0; m < teamScores.length; m++) {
          let singleGameScores = await teamScores[m].findElements(
            By.css(".c-events-scoreboard__line .c-events-scoreboard__cell")
          );
          let jio = [];
          for (let u = 0; u < singleGameScores.length; u++) {
            let teamCore = await singleGameScores[u].getText();
            jio.push(teamCore);
          }
          footballPoints.push(jio);
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
        let distributedRate = [];
        for (let i = 0; i < rate.length; i += 9) {
          let gameRate = [];
          for (let j = i; j < i + 9; j++) {
            gameRate.push(rate[j]);
          }
          distributedRate.push(gameRate);
        }
        let count = 1;
        let index = 0;
        let nCount = 0;
        for (let k = 0; k < teams.length; k += 2) {
          let firstTeam = [];
          let secondTeam = [];
          for (let r = 0; r < footballPoints[nCount].length; r++) {
            if (r < footballPoints[nCount].length / 2) {
              firstTeam.push(footballPoints[nCount][r]);
            } else {
              secondTeam.push(footballPoints[nCount][r]);
            }
          }
          nCount++;

          let final = {
            [`game${count++}`]: [
              { name: teams[k], score: firstTeam },
              { name: teams[k + 1], score: secondTeam },
            ],
          };
          final.rates = distributedRate[index++];

          matches.push(final);
        }
        let rowData = { Event: event, matches: matches, head: maxValues };

        data.push(rowData);
      } catch (error) {
        console.error("Error scraping data from an element:", error);
      }
    }

    const jsonData = JSON.stringify(data, null, 2);
    const filePath = path.join(__dirname, "tennis_live.json");
    fs.writeFileSync(filePath, jsonData, "utf8");
    console.log("Data written to JSON file");
  } catch (error) {
    console.error("Error in the scraping process:", error);
  } finally {
    await driver.quit();
  }
})();
