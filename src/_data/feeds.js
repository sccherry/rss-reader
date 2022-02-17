const Cache = require('@11ty/eleventy-cache-assets');
const { parse } = require('node-html-parser');

const feeds = [];

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
