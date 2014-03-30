Router.map(function () {
  this.route('serverFile', {
    where: 'server',
    path: '/cb',

    action: function () {
      var value = this.params.value;
      var input_address = this.params.input_address;
      var confirmations = this.params.confirmations;
      var transaction_hash = this.params.transaction_hash;
      var input_transaction_hash = this.params.input_transaction_hash;
      var destination_address = this.params.destination_address;
      var destination_address = this.params.destination_address;
      var test = this.params.test;
		Meteor._debug(value + " " + confirmations + " ");
      this.response.writeHead(200, {'Content-Type': 'text/html'});
      this.response.end('*ok*');
    }
  });
});