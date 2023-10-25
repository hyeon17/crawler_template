import puppeteer from 'puppeteer';
import { load } from 'cheerio';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

export const renderHTML = async (url) => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  

  const page = await browser.newPage();
  await page.goto(`https://item.taobao.com/item.htm?id=${url}`);
  const content = await page.content();
  const $ = load(content);
  console.log('server-->', $.html());
  const data = [];
  const originProductName = $('#J_Title > .tb-main-title').text().trim();
  const scopePrice = $('#J_StrPrice > em.tb-rmb-num').text();
  const salePrice = $('#J_PromoHd > div > strong > em.tb-rmb-num').text();
  const originCity = $('#J-From').text().trim();
  const mainImageSelector = $('#J_UlThumb > li > div > a > img').toArray();
  const detailImageSelector = $('#J_DivItemDesc > p').find('img').toArray();
  const optionsArray = $('#J_isku > div > dl > dd > ul > ').toArray();
  data.push({
    originProductName,
    scopePrice,
    salePrice,
    originCity,
    mainImageSelector,
    detailImageSelector,
    optionsArray,
  });
  browser.close();
  return data;
};

app.post('/', async(req, res) => {
  const url = req.body.url;

  try {
    const scrapedData = await renderHTML(url);
    return res.json(scrapedData);
  } catch (error) {
    console.error(error);
  }
});

const port = 3000; // 포트 번호를 원하는 대로 수정 가능
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

