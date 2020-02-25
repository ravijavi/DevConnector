const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  //pass in an object, post will be connected to a user
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users' //have a user connected to POST, they can only delete their own posts, etc.
  },
  text: {
    type: String,
    required: true
  },
  name: {
    //plan is to have the option to retain a post even if the user deletes their account, depending on the context
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId, //collection will allow us to see who liked a post, also prevent users from liking more than once
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
