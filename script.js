const axios = require("axios");
const cheerio = require("cheerio");
const RSS = require("rss");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function fetchPage(url) {
  const response = await axios.get(url);
  return response.data;
}
function parseHtml(html, selector, url) {
  const $ = cheerio.load(html);
  const items = [];

  $(selector).each((index, element) => {
    const title = $(element).text();
    const encodedTitle = encodeURIComponent(title);
    const link = `${url}#:~:text=${encodedTitle}` || "http://www.example.com";
    const description = $(element).closest("ul").text().trim() || title;

    items.push({
      title,
      description,
      url: link,
      guid: link,
      // date: new Date(),
    });
  });

  return items;
}

function createRssFeed(feedConfig, items) {
  const feed = new RSS({
    title: feedConfig.title,
    description: `${feedConfig.title} RSS feed`,
    feed_url: `${feedConfig.url}/rss.xml`,
    site_url: feedConfig.url,
    // pubDate: new Date(),
  });

  items.forEach((item) => feed.item(item));

  return feed.xml({ indent: true });
}

function extractItemsFromRss(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const items = [];
  $("channel item").each((index, element) => {
    items.push($(element).html());
  });
  return items;
}

function generateHash(data) {
  return crypto.createHash("md5").update(data.join(""), "utf8").digest("hex");
}

async function processFeeds() {
  const feedsConfig = JSON.parse(fs.readFileSync("feeds.json"));
  let changesMade = false;

  for (const feedConfig of feedsConfig) {
    try {
      const html = await fetchPage(feedConfig.url);
      const items = parseHtml(html, feedConfig.selector, feedConfig.url);
      const newRss = createRssFeed(feedConfig, items);

      const filename = `${feedConfig.title
        .replace(/\s+/g, "_")
        .toLowerCase()}.rss.xml`;
      const filepath = path.join(__dirname + "/rss/", filename);

      let existingItems = [];
      if (fs.existsSync(filepath)) {
        const existingRss = fs.readFileSync(filepath, "utf8");
        existingItems = extractItemsFromRss(existingRss);
      }

      const newItems = extractItemsFromRss(newRss);

      const newHash = generateHash(newItems);
      const existingHash = generateHash(existingItems);

      if (newHash !== existingHash) {
        fs.writeFileSync(filepath, newRss);
        changesMade = true;
        console.log(`Updated ${filename}`);
      } else {
        console.log(`No changes for ${filename}`);
      }
    } catch (error) {
      console.error(`Error processing ${feedConfig.title}:`, error);
    }
  }

  return changesMade;
}

async function main() {
  const changesMade = await processFeeds();
  if (changesMade) {
    console.log("Changes detected. Files have been updated.");
  } else {
    console.log("No changes detected. No files were updated.");
  }
}

main().catch(console.error);
