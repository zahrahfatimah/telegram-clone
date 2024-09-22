const { getDB } = require("../config/config");
const { ObjectId } = require("mongodb");

const createFollow = async ({ followingId, followerId }) => {
  const db = getDB();

  await db.collection("follow").insertOne({
    followerId: new ObjectId(followerId),
    followingId: new ObjectId(followingId),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

const findFollowersByUserId = async (userId) => {
  const db = getDB();

  await db
    .collection("follow")
    .find({ followingId: new ObjectId(userId) })
    .toArray();
  return followers;
};

const findFollowingsByUserId = async (userId) => {
  const db = getDB();

  await db
    .collection("follow")
    .find({ followerId: new ObjectId(userId) })
    .toArray();

  return followings;
};

const removeFollow = async ({ followingId, followerId }) => {
  const db = getDB();

  await db.collection('follow').deleteOne({
    followerId: new ObjectId(followerId),
    followingId: new ObjectId(followingId),
  });
};

module.exports = {
  createFollow,
  findFollowersByUserId,
  findFollowingsByUserId,
  removeFollow,
};
