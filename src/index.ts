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
  const bodySize = parseInt(c.req.query("bsize") || "0");

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
    oldUrl: string;
    newUrl: string;
  }

  let searcResults: ISearchResult[] = [];

  $(".search-result.search-result-link").each((i, elem) => {
    const titleElem = $(elem).find("a.search-title");
    let body = $(elem).find(".search-result-body > .md").children().text();
    if (bodySize > 0) {
      body = body.substring(0, bodySize).concat("...");
    }

    if (i < numOfResults) {
      searcResults = [
        ...searcResults,
        {
          title: titleElem.text(),
          body: body,
          upvotes: parseInt($(elem).find(".search-score").text()),
          comments: parseInt($(elem).find(".search-comments").text()),
          subreddit: $(elem).find("a.search-subreddit-link").text(),
          oldUrl: titleElem.attr("href") || "",
          newUrl:
            titleElem
              .attr("href")
              ?.replace(/old.reddit.com/g, "www.reddit.com") || "",
        },
      ];
    }
  });

  return c.json(searcResults);
});

export default app;
