var should = require('chai').should(),
    assert = require('chai').assert,
    expect = require('chai').expect,
    sinon = require('sinon'),
    redis = require('redis-mock'),
    client = redis.createClient(),
    redisService = require('../src/redisService.js')(client);

describe("set redis key", function(){
  it("should return 'OK' if successfull", function(done){
    redisService.set('yolo','testValue',function(err,reply){
      reply.should.equal('OK');
      done();
    })
  });
})

describe("SINON TEST", function(){

  before(function(){
    sinon.stub(client,'set').yields(null,'callback value');
  });
  it("should call callback with args",function() {
    redisService.set('cb','cb',function(){})
    client.set.called.should.be.true
  })
  after(function(){
    client.set.restore()
  })
})

describe("get redis key", function(){
  before(function(done){
    redisService.flushall(function(err,reply){
      if (err){
        return
      } else {
        redisService.set('testKey','The value is banana', function(err,reply){})
        done()
      }
    });
  });
  it("should return correct value if found", function(done){
    redisService.get('testKey',function(err,reply){
      reply.should.equal('The value is banana')
      done()
    })
  })
  it("should return null if key not found", function(done){
    redisService.get('foobarKey',function(err,reply){
      should.not.exist(reply);
      done();
    })
  });
})
describe("delete redis key", function(){
  before(function(done){
    redisService.flushall(function(err,reply){
      if (err){
        return
      } else {
        redisService.set('deleteMe','The value is apple', function(err,reply){})
        done()
      }
    });
  });
  it("should return 1 if one key was deleted", function(done){
    redisService.del('deleteMe', function(err,reply){
      reply.should.equal(1)
      done()
    })
  })
  it("should return 0 if no key was deleted", function(done){
    redisService.del('unknown_key', function(err,reply){
      reply.should.equal(0)
      done()
    })
  })
})
describe("flush all keys and databases", function(){
  it("should echo OK if successfull",function(done){
    redisService.flushall(function(err,reply){
      reply.should.equal('OK');
      done()
    });
  });
});
