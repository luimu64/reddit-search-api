# Unofficial reddit search api

## Parameters

### Query - `required`

`q: string` Your search query

To get results regarding Touhou games:
`localhost:8787/search?q=touhou`

### Number of results - `optional`

`amount: number` The amount of results to return

Default is 10

To get 5 search results:
`localhost:8787/search?q=kitten&amount=5`

### Sorting - `optional`

`sort: string` In what order to sort.

Available options are:

- new
- top
- comments
- relevance (default)

To get newest posts:
`localhost:8787/search?q=gaming&sort=new`

### Body size - `optional`

`bsize: number` The length of body attribute in characters.

To get posts with length of 200 characters:
`localhost:8787/search?q=gaming&bsize=200`
