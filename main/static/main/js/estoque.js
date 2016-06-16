angular.module('estoque', [])
    .controller('estoqueController', function($scope){
        var self = this;
        
        self.hidden = true;
        
        self.openModal = function(){
            self.hidden = false;
        }
        self.closeModal = function(){
            self.hidden = true;
        }
    });
    