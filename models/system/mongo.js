/**
 * Mongo adapter
 * We will keep status of the job in Mongo.
 * Assembled data will be pushed there to allow persistence.
 *
 * The data inserted in Mongo will be after post-processing stage and ready to export
 *
 * In addition a purge method needs to be in place to remove jobs older than 2w
 */

const config = require('../../lib/config');
var MongoClient = require('mongodb').MongoClient;
var url = config.get('mongoUrl');

function _getClient(callback) {
  MongoClient.connect(url, function(err, db) {
    if (err || !db) {
      console.log('Couldn\'t connect to Mongo at ' + url);
      if (err) {
        console.error(err);
      }
      return callback(err);
    }

    // console.log('Connected correctly to server');
    return callback(null, db);
  });
}

const transcodeJobsCollectionName = 'transcode-jobs';

const transcodeJobsCollection = {
  upsertOne: function upsertOne(queryWhere, querySet, callback) {
    _getClient(function (error, db) {
      const col = db.collection(transcodeJobsCollectionName);

      col.updateOne(queryWhere, querySet, {upsert: true}, function (err, r) {
        // console.log(r.upsertedId._id);
        db.close();
        return callback(err, r);
      });
    });
  },

  findOne: function findOne(query, callback) {
    _getClient(function (e, db) {
      var col = db.collection(transcodeJobsCollectionName);

      col.find(query).limit(1).toArray(function(err, reply) {
        db.close();
        return callback(err, (reply && reply.length ? reply[0] : null));
      });
    });
  },


  find: function find(query, callback) {
    _getClient(function (e, db) {
      var col = db.collection(transcodeJobsCollectionName);

      col.find(query).toArray(function(err, reply) {
        db.close();
        return callback(err, reply);
      });
    });
  },

  deleteOne: function deleteOne(query, callback) {
    _getClient(function (e, db) {
      var col = db.collection(transcodeJobsCollectionName);

      col.deleteOne(query, function(err, reply) {
        return callback(null, reply);
      });
    });
  }
};




module.exports = {
  // getClient: getClient,
  transcodeJobs: transcodeJobsCollection
};
