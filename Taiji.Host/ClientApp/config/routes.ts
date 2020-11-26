import defaultRoute from './routes/route.default';
import identityRoute from './routes/route.identity';
import userInfo from './routes/route.userinfo';
import systemRoute from './routes/route.system';
import contentRoute from './routes/router.content';
import tempweb from './routes/router.tempweb';
import openplatform from './routes/route.openplatform';
import spider from './routes/route.spider';

export default [...defaultRoute, ...identityRoute, ...userInfo, ...systemRoute, ...contentRoute, ...tempweb, ...openplatform, ...spider]