import { Hono } from "hono";
import * as cheerio from "cheerio";

const app = new Hono();

app.get("/", (c) =>
  c.text("You should hit the /search endpoint for results :)")
);

app.get("/search", async (c) => {
  const searchTerm = c.req.query("q");
  const numOfResults = parseInt(c.req.query("amount") || "10");
  const sorting = c.req.query("sort");

  const fetchRes = await fetch(
    `https://old.reddit.com/search/?q=${searchTerm}${
      sorting ? "&sort=" + sorting : ""
    }`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
      },
    }
  );
  const body = await fetchRes.text();
  const $ = cheerio.load(body);

  interface ISearchResult {
    title: string;
    body: string;
    upvotes: number;
    comments: number;
    subreddit: string;
  }

  let searcResults: ISearchResult[] = [];

  $(".search-result.search-result-link").each((i, elem) => {
    if (i < numOfResults) {
      searcResults = [
        ...searcResults,
        {
          title: $(elem).find("a.search-title").text(),
          body: $(elem).find(".search-result-body > .md").children().text(),
          upvotes: parseInt($(elem).find(".search-score").text()),
          comments: parseInt($(elem).find(".search-comments").text()),
          subreddit: $(elem).find("a.search-subreddit-link").text(),
        },
      ];
    }
  });

  return c.json({ test: searcResults });
});

export default app;
