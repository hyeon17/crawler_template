import '@pages/popup/Popup.css';
import withSuspense from '@src/shared/hoc/withSuspense';
import withErrorBoundary from '@src/shared/hoc/withErrorBoundary';
// import axios from 'axios';
import {renderHTML} from '../../../server'
const Popup = () => {
  const getUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const regex = /id=(\d+)/;
      if (tabs && tabs[0] && tabs[0].url) {
        const match = tabs[0].url.match(regex);
        const id = match[1];
        const res = renderHTML(id);
        console.log(res);
      } else {
        console.log('URL not available');
      }
    });
  };

  // const sendRequestToServer = async (url) => {
  //   const res = await axios.post('http://localhost:3000', {url});
  //   console.log(res);
  // };

  return (
    <div className="App">
      <button onClick={getUrl}>Hello</button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
