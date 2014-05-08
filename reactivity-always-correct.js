if (Meteor.isClient) {
  Session.set('hasUser', false);
  Session.set('subReady', false);
  
  // this simulates the wait list
  var waitList = {
    _fns: [],
    ready: function() {
      return _.all(this._fns, function(f) { return f(); })
    }
  }
  
  // this simulates the controller.waitOn 
  var waitOn = function() {
    if (Session.get('hasUser'))
      return [function() { return Session.get('subReady'); }];
    else
      return [];
  }
  
  // this simulates the "waitOn" computation
  Deps.autorun(function() {
    var waits = waitOn();
    waitList._fns = waits;
  });
  
  // OK. To begin with, the waitList is ready. This correct
  console.log("START");
  console.log("Waitlist ready: ", waitList.ready());
  
  // "Login"
  console.log("LOGIN");
  Session.set('hasUser', true);
  
  // The waitlist *should immediately be unready, but isn't*
  console.log("Waitlist ready: ", waitList.ready());
  console.log("FLUSH");
  Deps.flush();
  console.log("Waitlist ready: ", waitList.ready());  
  
  // on the other hand, it does immediately become ready when the sub is
  console.log("SUB GOES READY");
  Session.set('subReady', true)
  console.log("Waitlist ready: ", waitList.ready());
  console.log("FLUSH");
  Deps.flush();
  console.log("Waitlist ready: ", waitList.ready());
  
  // The alternate approach is to not use an autorun to pass waitOn to the waitList
  console.log('');
  console.log('');
  console.log('--PASSING FUNCTIONS AROUND AND NOT USING AUTORUN--');
  
  Session.set('hasUser', false);
  Session.set('subReady', false);
  
  // this simulates the wait list
  var waitList = {
    _fnsGenerator: [],
    ready: function() {
      // crucially we evaluate fns here
      return _.all(this._fnsGenerator(), function(f) { return f(); })
    }
  }
  
  // this simulates the controller.waitOn 
  var waitOn = function() {
    if (Session.get('hasUser'))
      return [function() { return Session.get('subReady'); }];
    else
      return [];
  }
  
  // this REPLACES the "waitOn" computation -- we would run this when the controller inits
  waitList._fnsGenerator = waitOn;
  
  // OK. To begin with, the waitList is ready. This correct
  console.log("START");
  console.log("Waitlist ready: ", waitList.ready());
  
  // "Login"
  console.log("LOGIN");
  Session.set('hasUser', true);
  
  // Now the waitlist does immediately become unready
  console.log("Waitlist ready: ", waitList.ready());
  console.log("FLUSH");
  Deps.flush();
  console.log("Waitlist ready: ", waitList.ready());  
  
  console.log("SUB GOES READY");
  Session.set('subReady', true)
  console.log("Waitlist ready: ", waitList.ready());
  console.log("FLUSH");
  Deps.flush();
  console.log("Waitlist ready: ", waitList.ready());
}
