// The content of this file was generated by IBM Cloud
// Do not modify it as it might get overridden
module.exports = function(app, server){
    require('./public')(app);
    require('./health')(app);
    require('./customer_router')(app);
    require('./account_router')(app);
    require('./card_router')(app);
    require('./appon_router')(app);
    require('./loan_router')(app);
//    require('./docswiftRouter')(app);
//    require('./docodbRouter')(app);
    //require('./KursComRouter')(app);
    //require('./swagger-get-router')(app);
    //require('./swagger-ui-router')(app);
};
