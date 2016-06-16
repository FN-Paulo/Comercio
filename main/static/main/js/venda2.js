angular.module("venda", [])
    .controller('venda-simples', function($scope, $http){
        var vendaSimples = this;
        
        vendaSimples.List = [];
        vendaSimples.obs = '';
        
        vendaSimples.getParcials = function(){
            var parcials = 0;
            var list = vendaSimples.List;

            angular.forEach(list, function(item){
                parcials = parcials + (item.precoVenda*item.quantidade);
            });
            
            return parcials;
        };
        
        vendaSimples.remove = function(item){
            vendaSimples.List.splice(item, 1);
        };
        
        vendaSimples.adicionar = function(item){
            var status = false;
            var i;
            for(i = 0; i < vendaSimples.List.length; i++){
               if(vendaSimples.List[i]._id == item._id){
                   status = true;
                   break;
               }else{
                   status = false;
               }
            }
            
            if(status == false){
                vendaSimples.List.push({
                    _id: item._id,
                    descricao: item.descricao,
                    quantidade: 1,
                    precoCompra: item.precoCompra,
                    precoVenda: item.precoVenda
                });
            }else{
                vendaSimples.List[i].quantidade++;
            }
        };
        
        $scope.$watch('buscaBox', function(newV, oldV){
            var route = "http://localhost:8000/api/estoque.php?desc="+newV;
            console.log(route);
            if(newV != ''){
                $http.get(route)
                    .then(function(response){
                            console.log(response.status);
                            if(response.status == 200){
                                vendaSimples.sugest = response.data;
                            }else{
                                vendaSimples.sugest = [];
                            }
                            
                    });    
            }else{
                vendaSimples.sugest = [];
            }
        });
        
        // Modal
        
        vendaSimples.hidden = true;
        
        vendaSimples.openModal = function(){
            vendaSimples.hidden = false;
        }
        vendaSimples.closeModal = function(){
            vendaSimples.hidden = true;
        }
        
        vendaSimples.cancel = function(){
            vendaSimples.List.splice(0, vendaSimples.List.length);
            vendaSimples.closeModal();
            vendaSimples.dinheiroRecebido = '';
            vendaSimples.obs = '';
            $scope.buscaBox = '';
            
        }
        // Finalize
        vendaSimples.finzalizar = function(){
            var sendObj = {
                produtos: vendaSimples.List,
                pagamento: vendaSimples.pagamento,
                obs: vendaSimples.obs
            }
            var sendStr = JSON.stringify(sendObj);
            console.log(sendStr);
            var route = "http://localhost:8000/api/venda.php";
            $http.post(route, sendStr)
                .success(function(data, status){
                    if(status == 200){
                        vendaSimples.cancel();
                    }
                });
        }
    });