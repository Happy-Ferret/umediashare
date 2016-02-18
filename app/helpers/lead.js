import Ember from 'ember';


export default Ember.Helper.helper(function(params) {
    var num = params[0] + 1;

    return num > 9 ? num : '0' + num;
});
