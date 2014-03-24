Total = new Meteor.Collection("total");

Total.allow({
  insert: function (userId) {
    return false;
  },
  update: function (userId) {   
      return false;
  },
  remove: function (userId) {
    return false;
  }
});

MyTotals = new Meteor.Collection("total-by-users");

MyTotals.allow({
  insert: function (userId) {
    return false;
  },
  update: function (userId) {   
      return false;
  },
  remove: function (userId) {
    return false;
  }
});

Contributions = new Meteor.Collection("contributions");

Contributions.allow({
  insert: function (userId, contribution) {
    return false;
  },
  update: function (userId, contribution, fields, modifier) {
    if (userId !== contribution.owner)
      return false; // not the owner

    var allowed = ["amount", "public"];
    if (_.difference(fields, allowed).length)
      return false; // tried to write to forbidden field

    // A good improvement would be to validate the type of the new
    // value of the field (and if a string, the length.) In the
    // future Meteor will have a schema system to makes that easier.
    return true;
  },
  remove: function (userId, contribution) {
    return contribution.owner === userId;
  }
});

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length !== 0;
});


donate = function (options) {
  var id = Random.id();
  Meteor.call('donate', _.extend({ _id: id }, options));
  return id;
};

if (Meteor.isServer){


Meteor.methods({
  // options should include: amount, public
  donate: function (options) {
    check(options, {
      amount: Number,
      public: Match.Optional(Boolean),
      _id: Match.Optional(NonEmptyString)
    });

    if (options.amount < 0)
      throw new Meteor.Error(413, "Amount must be positive");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    if (Meteor.user() && !!options.public){
    	if (Meteor.user().username){
    		name = Meteor.user().username;
      } else if (Meteor.user().profile) {
      	name = Meteor.user().profile.name;
      }
    } else {
    	name = "*****";
    }
    
    var id = options._id || Random.id();
    Contributions.insert({
      _id: id,
      owner: this.userId,
      name: name,
      amount: options.amount,         
      createdAt: new Date().valueOf(),   
      public: !! options.public,
    });
    
    var emailTo;
    if (Meteor.user().emails && Meteor.user().emails.length > 0){
    	emailTo = Meteor.user().emails[0].address
    } else if (Meteor.user().services.facebook){
    	emailTo = Meteor.user().services.facebook.email;
    }

	 Meteor._debug(emailTo);
	    	    
 	 Email.send({
      to: emailTo,      
      from: 'therapies@irahm.be',
      subject: mf('email_subject', null, 'Merci pour votre don a IRAHM asbl.'),
      html: Handlebars.templates['email']({amount:options.amount})
    });

    this.unblock();
    
    return id;
  }
});
}



///////////////////////////////////////////////////////////////////////////////
// Users

displayName = function (user) {
  if (user.profile && user.profile.name)
    return user.profile.name;
  return user.emails[0].address;
};

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};
