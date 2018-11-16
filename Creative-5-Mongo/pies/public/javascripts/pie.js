angular.module('pie', [])
    .controller('MainCtrl', [
        '$scope', '$http',
        function($scope, $http) {
            $scope.pies = [];
            $scope.foundPies = [];
            $scope.addPie = function(pie) {
                var newTitle = pie.title;
                if (!newTitle) {
                    newTitle = "Anonymous Pie"
                }
                var newAuthor = pie.author;
                if (!newAuthor) {
                    newAuthor = "Anonymous Human"
                }
                var ingredientStr = pie.ingredients;
                if (ingredientStr) {
                    var ingredientArray = ingredientStr.split(',');
                    var ingredientList = [];
                    for (var i = 0; i < ingredientArray.length; i++) {
                        ingredientList = ingredientList.concat({ 'name': ingredientArray[i] })
                    }
                }
                else {
                    ingredientList = [{ "name": "No ingredients listed" }]
                }

                var directionsStr = pie.directions;
                if (directionsStr) {
                    var directionsArray = directionsStr.split(',');
                    var directionsList = [];
                    for (var i = 0; i < directionsArray.length; i++) {
                        if (directionsArray[i] === '') {
                            continue;
                        }
                        else {
                            directionsList = directionsList.concat({ 'text': directionsArray[i] })
                        }
                    }
                }
                else {
                    directionsList = [{ "text": "No directions provided" }]
                }
                var newPicture = pie.picture;
                if (!newPicture) {
                    newPicture = "https://res.cloudinary.com/teepublic/image/private/s--jo2BaLTG--/t_Preview/b_rgb:ffffff,c_limit,f_jpg,h_630,q_90,w_630/v1517274444/production/designs/2320272_0.jpg"
                }
                var newPie = {
                    title: newTitle,
                    ingredients: ingredientList,
                    directions: directionsList,
                    author: newAuthor,
                    picture: newPicture
                };
                $http.post('/pies', newPie).success(function(data) {
                    $scope.pies.push(data);
                })
                $scope.getPies();
                $('#addPieModal').modal('hide');
                pie.title = '';
                pie.ingredients = '';
                pie.directions = '';
                pie.picture = '';
                pie.author = '';
            };
            $scope.deletePie = function(pie) {
                $http.delete('/pies/' + pie._id)
                    .success(function(data) {
                        console.log("Delete success!")
                    });
                $scope.getPies();
            };
            $scope.getPies = function() {
                return $http.get('/pies').success(function(data) {
                    angular.copy(data, $scope.pies);
                });
            };
            $scope.searchPies = function() {
                var searchTerm = $scope.formContent;
                $http.get('/pies?q=' + searchTerm).success(function(data) {
                    angular.copy(data, $scope.foundPies);
                })
                $scope.formContent = '';
            }
            $scope.getPies();
        }
    ])
