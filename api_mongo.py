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
app.config['CORS_HEADERS'] = 'Content-Type'
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

class User(db.Document):
    username = db.StringField()
    preferences = db.DictField() #or EmbeddedDocumentField()
    # alternative: have one field per each potential preference instead of a dict

    def to_json(self):
        # convert document to JSON
        return {
            "username": self.username,
            "preferences": self.preferences # need to do any additional parsing here?
        }

class Analytic(db.Document):
    userId = db.StringField()
    articleId = db.StringField()
    accessDate = db.DateTimeField()

    def to_json(self):
        # convert document to JSON
        return {
            "userId": self.userId,
            "articleId": self.articleId,
            "accessDate": self.accessDate
        }

# example request: http POST http://127.0.0.1:5000/api/articles_populate
@app.route('/api/articles_populate', methods=['POST'])
def articles_populate():
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

# example request: http POST http://127.0.0.1:5000/api/users_populate
@app.route('/api/users_populate', methods=['POST'])
def users_populate():
    # ***News API has no way of excluding certain topics, so we can't have a topic blacklist currently
    # should we make the preference field names consistent with the News API query parameter names?
    users = []
    preferences = {
        'favoriteTopics': 'soccer',
        'favoriteSources': ['bbc-sport'],
    }
    users.append(User(username='Nick', preferences=preferences))
    preferences = {
        'favoriteSources': ['associated-press', 'time'],
        'excludedSources': 'fox-news'
    }
    users.append(User(username='Evan', preferences=preferences))
    User.objects.insert(users)

    # gives a 404 error if not called with an http POST request, but db is populated successfully regardless
    return make_response("", 201)

# basic GET/POST request, will need to incorporate input from the front-end later
@app.route('/api/articles', methods=['GET', 'POST'])
def api_articles():
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

# basic GET/POST request, will need to incorporate input from the front-end later
@app.route('/api/users', methods=['GET', 'POST'])
def api_users():
    if request.method == "GET":
        users = []
        for user in User.objects:
            users.append(user)
        return make_response(jsonify(users), 200)
    elif request.method == "POST":
        content = request.json
        user = User(username=content['username'], preferences=content['preferences'])
        user.save()
        return make_response("", 201)

# basic GET/POST request, will need to incorporate input from the front-end later
@app.route('/api/analytics', methods=['GET', 'POST'])
def api_analytics():
    if request.method == "GET":
        analytics = []
        for analytic in Analytic.objects:
            analytics.append(analytic)
        return make_response(jsonify(analytics), 200)
    elif request.method == "POST":
        content = request.json
        analytic = Analytic(userId=content['userId'], articleId=content['articleId'], accessDate=content['accessDate'])
        analytic.save()
        return make_response("", 201)

if __name__ == '__main__':
    app.run()


"""
all sources from News API (comma-separated):
'abc-news,abc-news-au,aftenposten,al-jazeera-english,ansa,argaam,ars-technica,ary-news,associated-press,australian-financial-review,axios,bbc-news,bbc-sport,bild,blasting-news-br,bleacher-report,bloomberg,breitbart-news,business-insider,business-insider-uk,buzzfeed,cbc-news,cbs-news,cnn,cnn-es,crypto-coins-news,der-tagesspiegel,die-zeit,el-mundo,engadget,entertainment-weekly,espn,espn-cric-info,financial-post,focus,football-italia,fortune,four-four-two,fox-news,fox-sports,globo,google-news,google-news-ar,google-news-au,google-news-br,google-news-ca,google-news-fr,google-news-in,google-news-is,google-news-it,google-news-ru,google-news-sa,google-news-uk,goteborgs-posten,gruenderszene,hacker-news,handelsblatt,ign,il-sole-24-ore,independent,infobae,info-money,la-gaceta,la-nacion,la-repubblica,le-monde,lenta,lequipe,les-echos,liberation,marca,mashable,medical-news-today,msnbc,mtv-news,mtv-news-uk,national-geographic,national-review,nbc-news,news24,new-scientist,news-com-au,newsweek,new-york-magazine,next-big-future,nfl-news,nhl-news,nrk,politico,polygon,rbc,recode,reddit-r-all,reuters,rt,rte,rtl-nieuws,sabq,spiegel-online,svenska-dagbladet,t3n,talksport,techcrunch,techcrunch-cn,techradar,the-american-conservative,the-globe-and-mail,the-hill,the-hindu,the-huffington-post,the-irish-times,the-jerusalem-post,the-lad-bible,the-next-web,the-sport-bible,the-times-of-india,the-verge,the-wall-street-journal,the-washington-post,the-washington-times,time,usa-today,vice-news,wired,wired-de,wirtschafts-woche,xinhua-net,ynet'
"""