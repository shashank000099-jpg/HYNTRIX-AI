fetch('https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=' + process.env.APIFY_API_KEY, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({usernames: ['cristiano']})
}).then(r => r.json()).then(d => {
  if (d[0].latestPosts && d[0].latestPosts.length > 0) {
    console.log(JSON.stringify(d[0].latestPosts[0], null, 2));
  }
}).catch(e => console.error(e));