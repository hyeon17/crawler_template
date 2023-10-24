import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
import axios from 'axios';
import { load } from 'cheerio';
// import { launch } from 'puppeteer';

const Popup = () => {
  const getUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (tabs && tabs[0] && tabs[0].url) {
        renderHTML(tabs[0].url);
      } else {
        console.log('URL not available');
      }
    });
  };

  const renderHTML = async (url: string) => {
    const res = await axios.get(url);
    const $ = load(res.data);
    // const body = $('body');
    // const link = '//item.taobao.com/item.htm?id=';
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
    console.log(data);
  };

  return (
    <div className="App">
      <button onClick={getUrl}>Hello</button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
