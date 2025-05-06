import { getNews } from "./getNews";

// getListNews("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
// .then(result => console.log(result))
// .catch(e => console.error(e))

getNews()
.then(r => console.log(r))
.catch(e => console.error(e))