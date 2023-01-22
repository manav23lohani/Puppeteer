const { Cluster } = require("puppeteer-cluster");
const fs = require("fs");

// take from user through search-box
const contest = "weekly-contest-322";
const links = [...Array(10).keys()];
(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 10,
  });
  let users=[];
  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url, { waitUntil: "networkidle2" });
    const pageUsers = await page.evaluate(() =>
      Array.from(document.querySelectorAll("tbody tr"), (e) => ({
        rank: e.querySelector("td:nth-child(1)").innerText,
        name: e.querySelector("td:nth-child(2)").innerText.trim(),
        score: e.querySelector("td:nth-child(3)").innerText,
        finishTime: e.querySelector("td:nth-child(4)").innerText,
      }))
    );

    // store in json file
    users.push(...pageUsers);
  });

  // queue all links to cluster that are to be fetched
  for (let link of links){
     await cluster.queue(`https://leetcode.com/contest/${contest}/ranking/${link+1}/`);
  }
await cluster.idle();
await cluster.close();
users.sort((a, b) => {
  return a.rank - b.rank;
});
// convert the users data to JSON
const json = JSON.stringify(users);

// write the JSON data to a file
fs.writeFileSync("usersData.json", json);
console.log("Users data saved to users.json file");

})();
