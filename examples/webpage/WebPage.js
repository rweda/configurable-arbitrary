/**
 * Describes a basic webpage.
 * @memberof examples/webpage
*/
class WebPage {

  /**
   * @param {Number} category the id of one of the website sections to store this page under.
   * @param {String} title the title of the webpage.
   * @param {String} body the contents of the webpage.
  */
  constructor(category, title, body) {
    this.category = category;
    this.title = title;
    this.body = body;
  }

  homeContents() {
    if(this.category !== 0) {
      throw new Error(`'category' must be '0' (homepage)  Currently ${this.category}.`);
    }
    return this.body;
  }

}

module.exports = WebPage;
