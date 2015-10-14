'use strict';

/* global chai: false */

var expect = chai.expect;

describe('The Account Angular Controllers', function() {

  var $rootScope, $controller, $scope, SUPPORTED_ACCOUNTS;

  beforeEach(function() {
    angular.mock.module('ngRoute');
    angular.mock.module('linagora.esn.account');
  });

  beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _SUPPORTED_ACCOUNTS_) {
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    SUPPORTED_ACCOUNTS = _SUPPORTED_ACCOUNTS_;
    $scope = $rootScope.$new();
  }));

  describe('The accountListController controller', function() {

    function createController(accounts) {
      $controller('accountListController', {
        $scope: $scope,
        accounts: accounts,
        SUPPORTED_ACCOUNTS: SUPPORTED_ACCOUNTS
      });
    }

    it('should only keep the SUPPORTED_ACCOUNTS accounts', function() {
      var accounts = [
        {id: 'keep', type: 'oauth', data: {provider: 'twitter'}},
        {type: 'email'},
        {type: 'foo', data: {provider: 'bar'}}
      ];
      createController(accounts);
      $rootScope.$digest();

      expect($scope.accounts.length).to.equal(1);
      expect($scope.accounts[0].id).to.equal('keep');
    });

    it('should only keep the accounts with provider', function() {
      var accounts = [
        {id: 'notkeep', type: 'oauth', data: {noprovider: 'nop'}},
        {type: 'email'},
        {id: 'keep', type: 'oauth', data: {provider: 'bar'}}
      ];
      createController(accounts);
      $rootScope.$digest();

      expect($scope.accounts.length).to.equal(1);
      expect($scope.accounts[0].id).to.equal('keep');
    });

  });
});