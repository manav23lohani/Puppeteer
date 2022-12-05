const puppeteer = require("puppeteer");

async function run() {
  const userName = "utkarsh_solanki";
  const contest = "weekly-contest-322";

  var found = 0;

  for (let i = 225; i <= 235 && found == 0; i++) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://leetcode.com/contest/${contest}/ranking/${i}/`);

    const users = await page.evaluate(() =>
      Array.from(document.querySelectorAll("tbody tr"), (e) => ({
        rank: e.querySelector("td:nth-child(1)").innerText,
        name: e.querySelector("td:nth-child(2)").innerText.trim(),
        score: e.querySelector("td:nth-child(3)").innerText,
        finishTime: e.querySelector("td:nth-child(4)").innerText,
      }))
    );

    for (let i = 0; i < users.length; i++) {
      if (users[i].name == userName) {
        console.log(users[i]);
        found = 1;
        break;
      }
    }
    await browser.close();
  }
}
run();
