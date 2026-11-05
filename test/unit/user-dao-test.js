var assert = require("assert");
var UserDAO = require("../../app/data/user-dao").UserDAO;
/* global describe, it */

describe("UserDAO", function() {
    "use strict";

    it("uses $eq when looking up a user during login", function(done) {
        var capturedQuery;
        var maliciousUserName = {
            $ne: null
        };
        var fakeDb = {
            collection: function() {
                return {
                    findOne: function(query, callback) {
                        capturedQuery = query;
                        callback(null, {
                            password: "password"
                        });
                    }
                };
            }
        };
        var userDao = new UserDAO(fakeDb);

        userDao.validateLogin(maliciousUserName, "password", function(err, user) {
            assert.ifError(err);
            assert.deepStrictEqual(capturedQuery, {
                userName: {
                    $eq: maliciousUserName
                }
            });
            assert.ok(user);
            done();
        });
    });
});
