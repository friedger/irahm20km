Meteor.subscribe("contributions");
Meteor.subscribe("total");
Meteor.subscribe("total-by-users");

Template.contributions.contributions = function () {
  return Contributions.find({}, {sort: {createdAt: -1}});
};

Template.contributions.total = function () {
  return Total.findOne();
};

Template.contributions.mytotal = function () {
  return MyTotals.findOne(Meteor.userId());
};

var openConfirmDialog = function (amount) {
  Session.set("showConfirmDialog", true);
  Session.set("amount", amount);
};

Template.container.showConfirmDialog = function () {
  return Session.get("showConfirmDialog");
};

Template.confirmDialog.events({
  'click .confirm': function (event, template) {
  	 var amount = Session.get("amount");
    Meteor.call("donate", {amount:Number(amount), public:true});
    Session.set("showConfirmDialog", false);
  },
  'click .done': function (event) {
    Session.set("showConfirmDialog", false);
    return false;
  }
});

Template.confirmDialog.amount = function(){
  if (! Session.get("amount")){
		Session.set("amount", 5);	
  }  
  return Session.get("amount");
		 
}

Template.donate.events({
  'click .donate':
    function (evt, template) {
    	if (Meteor.user()){			
    		amount = template.find(".amount"); 
    		openConfirmDialog(amount.value)   		
      }       
    }  
  });
  
  
Handlebars.registerHelper("prettifyDate", function(timestamp) {
	 date = new Date(timestamp);
    return date.toDateString()
});

Handlebars.registerHelper("prettifyMoney", function(amount) {
	 
var decimalSeparator = Number("1.2").toLocaleString().substr(1,1);

var amountWithCommas = amount.toLocaleString();
var arParts = String(amountWithCommas).split(decimalSeparator);
var intPart = arParts[0];
var decPart = (arParts.length > 1 ? arParts[1] : '');
decPart = (decPart + '00').substr(0,2);

return intPart + decimalSeparator + decPart + " €";
});


Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes'],
    github: ['user']
  },
  requestOfflineToken: {
    google: true
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});
