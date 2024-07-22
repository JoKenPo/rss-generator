# RSS Feed Generator
This repository contains a Node.js script that generates RSS feeds from HTML pages using predefined configurations. The script runs periodically using GitHub Actions, updating RSS feed files only if there are actual changes in the content.

## Prerequisites
  - Node.js (version 14 or higher)
  - npm (Node Package Manager)
## Setup
1. #### Clone the repository:
   ```bash
    git clone https://github.com/your-repo/rss-feed-generator.git
    cd rss-feed-generator
    ```
2. #### Install dependencies:
   ```bash
    npm install
    ```
3. #### Configure feeds.json:
   The feeds.json file should contain an array of feed configurations. Each configuration specifies how to generate an RSS feed for a particular page. The file should follow this structure:
    
    ```json
    [
      {
        "title": "Feed Title",
        "url": "https://example.com/page-to-scrape",
        "selector": "div[role] > main > article.not-listing.post-71273 > div.entry-content > ul > li > strong"
      },
      {
        "title": "Another Feed Title",
        "url": "https://anotherexample.com/page-to-scrape",
        "selector": "div.main-content > article > div > ul > li > h2"
      }
    ]
    ```
    - **title**: The title of the RSS feed. This is used to name the RSS file.
    - **url**: The URL of the page to scrape. The script will fetch the HTML from this URL.
    - **selector**: A CSS selector used to extract relevant content from the HTML page. This selector should match the HTML elements that contain the feed items.
4. #### GitHub Actions Configuration:
   The `.github/workflows/rss.yml` file is already set up to run the script periodically and push updates to the repository. You don’t need to modify this file unless you want to change the schedule or branch.

## Running Locally
To test the script locally, you can run:

```bash
node script.js
```

This will generate or update the RSS feed files based on the configuration in feeds.json.

----------
Feel free to adjust any parts as needed to fit your specific use case!
