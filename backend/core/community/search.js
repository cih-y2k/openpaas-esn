'use strict';

var elastic = require('../elasticsearch');
var CONSTANTS = require('./constants');
var mongooseHelper = require('../../helpers/mongoose');

var defaultLimit = 50;
var defaultOffset = 0;

function denormalize(community) {
  var document = mongooseHelper.communityToJSON(community);
  document.id = document._id;
  return document;
}
module.exports.denormalize = denormalize;

/**
 * Search communities in the given domains where the title match the query.search terms.
 */
module.exports.find = function(domains, query, callback) {

  elastic.client(function(err, client) {
    if (err) {
      return callback(err);
    }

    var elasticsearchOrFilters = domains.map(function(domain) {
      return {
        term: {
          domain_ids: domain._id
        }
      };
    });

    query = query || {limit: defaultLimit, offset: defaultOffset};
    var terms = (query.search instanceof Array) ? query.search.join(' ') : query.search;

    var elasticsearchQuery = {
      sort: [
        {title: 'asc'}
      ],
      query: {
        filtered: {
          filter: {
            or: elasticsearchOrFilters
          },
          query: {
            match: {
              title: {
                type: 'phrase_prefix',
                query: terms,
                slop: 10
              }
            }
          }
        }
      }
    };

    client.search({
      index: CONSTANTS.ELASTICSEARCH.index,
      type: CONSTANTS.ELASTICSEARCH.type,
      from: query.offset,
      size: query.limit,
      body: elasticsearchQuery

    }, function(err, response) {
      if (err) {
        return callback(err);
      }

      var list = response.hits.hits;
      var communities = list.map(function(hit) { return hit._source; });
      return callback(null, {
        total_count: response.hits.total,
        list: communities
      });
    });
  });
};
