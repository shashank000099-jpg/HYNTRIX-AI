import { getInstagramData } from './lib/social/apify';

async function run() {
  try {
    const data = await getInstagramData('cristiano');
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}

run();