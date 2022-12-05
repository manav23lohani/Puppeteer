const { Cluster } = require("puppeteer-cluster");
const fs = require("fs");

// take from user through search-box
const contest = "weekly-contest-322";
// take username to be searched
const username = '';
const links = [...Array(3).keys()];
(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 10,
  });

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);
    const users = await page.evaluate(() =>
      Array.from(document.querySelectorAll("tbody tr"), (e) => ({
        rank: e.querySelector("td:nth-child(1)").innerText,
        name: e.querySelector("td:nth-child(2)").innerText.trim(),
        score: e.querySelector("td:nth-child(3)").innerText,
        finishTime: e.querySelector("td:nth-child(4)").innerText,
      }))
    );

    // store in json file
    console.log(users);
  });

  // queue all links to cluster that are to be fetched
  for (let link of links){
     await cluster.queue(`https://leetcode.com/contest/${contest}/ranking/${link+1}/`);
  }
  await cluster.idle();
  await cluster.close();
})();
