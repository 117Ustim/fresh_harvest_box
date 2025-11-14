/**
 * Пример database.js для импорта в админ-панель
 * 
 * Структура:
 * - Каждый ключ верхнего уровня = страница (home, about, contact)
 * - Внутри страницы = секции (hero, features, gallery)
 * - Внутри секций = поля (title, description, image)
 */

export const siteData = {




  // MAIN //
  main: {

    hero: {
      title: " fresh harvest box is your one-stop place for a delicious fruit basket",
      description: "Our expertly curated fruit baskets are made with the freshest, highest quality fruits available. Whether you are looking for a healthy snack or a gift for a loved one, Fresh Harvest Box has got you covered.",
      cardDescription1: "Refreshing and juicy, watermelon is the perfect summer treat and a great source of hydration",
      cardDescription2: "Sweet and juicy, strawberries are packed with vitamin C and antioxidants, making them a delicious and healthy snack",
    }
  },





  //COMP_1 //

  comp1: {

    hero: {
      title: "To order your fruit basket, simply follow these easy steps",
      description: "Our baskets are assembled with care and delivered straight to your doorstep, so you can enjoy the taste of fresh fruit without ever leaving your home. Whether you're looking for a healthy snack or a thoughtful gift, our fruit baskets are the perfect choice.",

    },
  },

  comp2: {

    hero: {
      title: "ORGANIC FRUITS",
      description: "Our organic fruits are hand-picked from local farms and delivered straight to your doorstep, ensuring that you get the freshest and most nutritious produce possible. We offer a wide selection of organic fruits grown without the use of harmful pesticides or chemicals.",


    },
  },

  //FOOTER 
  footer: {
    hero: {
      address: "03471 Kiyv , Latoshinscogo 42",

      phone: '+380(67) 357-33-54',

    },
  },


}
export default siteData;
