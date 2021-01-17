var mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    name: String,
    nameLower: { // lowerecase version of name to help with searching
      type: String,
      default: function() {
        return this.name.toLowerCase()
      }
    },
    caption: String,
    captionLower: { // lowerecase version of caption to help with searching
      type: String,
      default: function() {
        return this.caption.toLowerCase()
      }
    },
    userEmail: String,
    photo:
    {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('Photo', photoSchema);
