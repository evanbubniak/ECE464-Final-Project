API_KEY = open("news_api_key.txt", "r").read()[:-1]
MONGO_PW = open("mongo_db_pw.txt", "r").read()[:-1]
from flask import Flask, make_response, request, jsonify
from flask_mongoengine import MongoEngine
from datetime import timedelta
from newsapi import NewsApiClient
from newsapi.newsapi_exception import NewsAPIException
import datetime
from json import dumps
import math

app = Flask(__name__)

database_name = "News_API"
mongo_username = 'ntriano'
one_month_ago = (datetime.datetime.today() - timedelta(days=30)).strftime("%Y-%m-%d")
today = datetime.datetime.today().strftime("%Y-%m-%d")
two_days_ago = (datetime.datetime.today() - timedelta(2)).strftime("%Y-%m-%d")
max_page_size = 100

# Init
newsapi = NewsApiClient(api_key=API_KEY)
DB_URI = "mongodb+srv://{}:{}@cluster0.cbxuc.mongodb.net/{}?retryWrites=true&w=majority".format(mongo_username, MONGO_PW, database_name)
app.config["MONGODB_HOST"] = DB_URI
db = MongoEngine()
db.init_app(app)

class Article(db.Document):
    source = db.StringField()
    title = db.StringField()
    url = db.StringField()

    def to_json(self):
        # convert document to JSON
        return {
            "source": self.book_id,
            "title": self.title,
            "url": self.url
        }

# example request: http POST http://127.0.0.1:5000/api/db_populate
@app.route('/api/db_populate', methods=['POST'])
def db_populate():
    # may need to store the source url if using excludeDomains parameter later
    all_sources = [source['id'] for source in newsapi.get_sources()['sources']]

    articles = []
    # query 2 sources at a time, only the first 100 articles are returned
    for i in range(math.ceil(len(all_sources)/2)):
        sources = all_sources[2*i:2*i+2]
        sources = ','.join(sources)
        res = newsapi.get_everything(sources=sources, from_param=today, page_size=max_page_size)

        for article in res['articles']:
            # only keep the article source (id), title, and url
            articles.append(Article(source=article['source']['id'], title=article['title'], url=article['url']))

    # articles = [Article(source='SSSS', title='TTTT', url='UUUU')] # test article
    Article.objects.insert(articles)
    # gives a 404 error if not called with an http POST request, but db is populated successfully regardless
    return make_response("", 201)

# basic GET/POST request, will need to incorporate input from the front-end later
@app.route('/api/articles', methods=['GET', 'POST'])
def api_books():
    if request.method == "GET":
        articles = []
        for article in Article.objects:
            articles.append(article)
        return make_response(jsonify(articles), 200)
    elif request.method == "POST":
        content = request.json
        article = Article(source=content['source'], title=content['title'], url=content['url'])
        article.save()
        return make_response("", 201)

if __name__ == '__main__':
    app.run()
