API_KEY = open("news_api_key.txt", "r").read()[:-1]
from datetime import timedelta
from newsapi import NewsApiClient
from newsapi.newsapi_exception import NewsAPIException
import datetime
from json import dumps

one_month_ago = (datetime.datetime.today() - datetime.timedelta(days=30)).strftime("%Y-%m-%d")
today = datetime.datetime.today().strftime("%Y-%m-%d")

# Init
newsapi = NewsApiClient(api_key=API_KEY)

def format_json(json, indent=4, sort_keys=False):
    return dumps(json, indent=indent, sort_keys=sort_keys, ensure_ascii=False).encode('utf8').decode()

def get_top_headlines(q=None, qintitle=None, sources=None, language="en", country=None, category=None, page_size=None, page=None):
    return newsapi.get_top_headlines(q=q, qintitle=qintitle, sources=sources, language=language, country=country, category=category, page_size=page_size, page=page)

def get_everything(
        q=None,
        qintitle=None,
        sources=None,
        domains=None,
        exclude_domains=None,
        from_param=one_month_ago,
        to=today,
        language=None,
        sort_by=None,
        page=None,
        page_size=None):
    if q == "": q = None
    if qintitle == "": qintitle = None
    if sources == "": sources = None
    if domains == "": domains = None
    if exclude_domains == "": exclude_domains = None
    if sort_by == "": sort_by = None
    if language == "": language = None
    if page == "": page = None
    if page_size == "": page_size = None
    
    return newsapi.get_everything(
        q=q, qintitle=qintitle, sources=sources, domains=domains, exclude_domains=exclude_domains, from_param=from_param, to=to, language=language, sort_by=sort_by, page=page, page_size=page_size)

def get_sources(category=None, language=None, country=None):

    if category == "": category = None
    if language == "": language = None
    if country == "": country = None

    return newsapi.get_sources(category=category, language=language, country=country)

user_input = ""
while user_input != "quit":
    user_input = input("Type a command (get_top_headlines, get_everything, get_sources, quit): ")

    try:
        if user_input == "get_top_headlines":
            q = input("query: ")
            sources = input("sources: ")
            language = input("language: ")
            print(format_json(get_top_headlines(q, sources, language)))
        
        if user_input == "get_everything":
            q=input("query: ")
            qintitle = input("query in title: ")
            sources = input("sources: ")
            domains=input("domains: ")
            exclude_domains = input("exclude_domains: ")
            language = input("language: ")
            sort_by = input("sort_by (input nothing for relevancy): ")
            page = input("page: ")
            page_size = input("page_size: ")
            print(format_json(get_everything(q, qintitle, sources, domains, exclude_domains, language=language, sort_by=sort_by, page_size=page_size)))
        
        if user_input=="get_sources":
            category = input("category: ")
            language = input("language: ")
            country=input("country: ")
            print(format_json(get_sources(category, language, country)))
    except NewsAPIException as e:
        print(e)
