Meteor.startup(function () {
  process.env.MAIL_URL = '';
});


Meteor.publish("contributors", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

// server: publish the current size of a collection
Meteor.publish("total", function () {
  var self = this; 
  var count = 0;
  var initializing = true;
  var handle = Contributions.find({}).observeChanges({
    added: function (id, contribution) {
      count += contribution.amount
      if (!initializing)
        self.changed("total", "all", {amount: count});
    },
    removed: function (id, contribution) {
      count-= contribution.amount;
      self.changed("total", "all", {amount: count});
    }
    // don't care about changed
  });


  initializing = false;
  self.added("total", "all", {amount: count});
  self.ready();

  
  self.onStop(function () {
    handle.stop();
  });
});

// server: publish the current amount of a user
Meteor.publish("total-by-users", function (owner) {
  var self = this;
  check(owner, String);
  var count = 0;
  var initializing = true;
  var handle = Contributions.find({owner: owner}).observeChanges({
    added: function (id, contribution) {
      count += contribution.amount
      if (!initializing)
        self.changed("total-by-users", owner, {amount: count});
    },
    removed: function (id, contribution) {
      count-= contribution.amount;
      self.changed("total-by-users", owner, {amount: count});
    }
    // don't care about changed
  });


  initializing = false;
  self.added("total-by-users", owner, {amount: count});
  self.ready();

  
  self.onStop(function () {
    handle.stop();
  });
});


Meteor.publish("contributions", function () {
  return Contributions.find(
    {$or: [{"public": true}, {owner: this.userId}]});
});