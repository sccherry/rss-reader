const Cache = require('@11ty/eleventy-cache-assets');
const { parse } = require('node-html-parser');

const feeds = [
  {
    name: 'Jazz Advice',
    url: 'https://www.jazzadvice.com',
    parser(document) {
      return Array.from(document.querySelectorAll('.article-container')).map(
        (article) => ({
          title: article.querySelector('.entry-title').textContent,
          body: article.querySelector('.excerpt').innerHTML,
          url: article.querySelector('.item-link').getAttribute('href'),
          date: new Date(
            article.querySelector('.entry-date').textContent.trim().slice(0, -3)
          ),
        })
      );
    },
  },
];

async function parseFeed({ url, parser }) {
  const html = await Cache(url, {
    duration: '1d',
    type: 'html',
  });

  return parser(parse(html));
}

module.exports = async function () {
  const items = await Promise.all(feeds.map(parseFeed));
  return items.flat().sort((item1, item2) => item2.date - item1.date);
};
