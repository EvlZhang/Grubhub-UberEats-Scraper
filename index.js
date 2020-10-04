const puppeteer=require('puppeteer');
const fetch=require('node-fetch');

async function searchCards(page){
  const cards=(await page.$$('a'));

  const restaurants=[];
  

  for(let card of cards){
    const name=await card.$eval('h5',el=>el.textContent).catch(err=>console.error(''));
    
    
    if(name){
      restaurants.push({name});
    }
  }
  return restaurants;
  
};

async function getMenu(page){

  const items=(await page.$$('.menuItem'));
  const prices=(await page.$$('.menuItem-priceAmount'));
  const foods=[];
  let i=0;

  for(let item of items){
    
    const food =await item.$eval('a',el=>el.textContent).catch(err=>console.error('menuItem error'));
    const price=await prices[i].$eval('span',el=>el.textContent).catch(err=>console.error('price error'));
    //console.log({food,price})
    i++
    if(food&&price){
      foods.push({food,price});
    }
  }
  
  return foods;
};
 
(async () => {
    
  const address='33 3rd Avenue,New York, NY';
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto('https://www.grubhub.com');
  
  await page.waitForSelector('input');
  
  const zip=(await page.$$('input'))[0];
  const button=(await page.$$('button'))[0];

  await zip.type(address);

  await button.click();
  await page.waitFor(700);
  
  await page.waitForSelector('input');
  const searchBar=(await page.$$('input'))[0];

  
  await searchBar.click();
  //enter the name of the restaurant.
  await searchBar.type('joes pizza');

  await searchBar.press('Enter');

  await page.waitFor(800);

  const restaurants=await searchCards(page);
  
  console.log(restaurants);

  //click into the restaurant
  const cards=(await page.$$('.s-card'));

  await cards[0].click();

  //get the menu items

  await page.waitFor(1500);
  

  const menu=await getMenu(page);
  console.log({menu});
  //go to ubereats

  await page.goto('http://ubereats.com');
  
  const uzip=(await page.$$('input'))[0];

  let ubutton=(await page.$$('button'))[2];

  await uzip.type(address);

  await page.waitFor(700);
  await ubutton.click();

  await page.waitFor(700);
  
  ubutton=(await page.$$('button'))[2];
  await ubutton.click();
  await page.waitFor(700);


  //now in search for food page.
  const search=await page.$('input');
  //enter the name of the restaurant
  await search.type('joes pizza');
  await search.press('Enter');

  await page.waitFor(5000);

  //get a list of restaurants


  //now get the first restaurant from search

  const urestaurants=(await page.$$('h3'));
  
  const searchNames=(await page.$$('p'));

 


  const unames=[];
  for(searchName of searchNames){
    let uname = await page.evaluate(el => el.textContent, searchName);
    if(uname){
      unames.push([uname]);
    }

  }
  console.log({unames});


  const rest=urestaurants[0];
  await page.waitFor(500);
  //click into restaurant 1
  await rest.click();

  await page.waitFor(5000);
  //get the menu
  const ufoods=await page.$$('.l9');

  const uitems=[];
 
  for(ufood of ufoods){
    
    let uitem=await page.evaluate(el=>el.textContent,ufood);
    if(uitem){
       uitems.push({uitem});

    }
    
  }
  console.log({uitems});
  

 // await browser.close();
})();

