// Mock for @css-inline/css-inline to avoid native binary dependency
module.exports = {
  inline: function(html, options) {
    // Simply return the HTML without CSS inlining
    return html;
  }
}; 