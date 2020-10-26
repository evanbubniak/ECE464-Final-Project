API_KEY = open("news_api_key.txt", "r").read()[:-1]
print(API_KEY)


from newsapi import NewsApiClient

# Init
newsapi = NewsApiClient(api_key=API_KEY)

# /v2/top-headlines
top_headlines = newsapi.get_top_headlines(q='election',
                                          sources='bbc-news,the-verge',
                                          language='en')

# /v2/everything
all_articles = newsapi.get_everything(q='election',
                                      sources='bbc-news,the-verge',
                                      domains='bbc.co.uk,techcrunch.com',
                                      from_param='2020-10-01',
                                      to='2020-10-26',
                                      language='en',
                                      sort_by='relevancy',
                                      page=2)

# /v2/sources
sources = newsapi.get_sources()

print(sources)