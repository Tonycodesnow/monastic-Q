const { User, Thought } = require("../models");
const { AuthenticationError } =  require('apollo-server-express');

const resolvers = {
  Query: {
    // get all users
    users: async () => {
      return User.find()
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },
    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("friends")
        .populate("thoughts");
    },

    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find().sort({ createdAt: -1 });
    },
    thought: async (parent, { _id }) => {
      return Thought.findOne({ _id });
    },
    Mutation: {
      addUser: async (parent, args) => {
        const user = await User.create(args);

        return user;
      },
      login: async (parent, { email, passowrd }) => {
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError('Invalid credentials');
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError('Invalid credentials');
        }

        return user;
      }

    }
  }
};

module.exports = resolvers;
