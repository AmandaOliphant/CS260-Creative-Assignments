angular.module('Library', ['ui.router', 'ngAnimate'])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$sceDelegateProvider',
        function($stateProvider, $urlRouterProvider, $sceDelegateProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl'
                })
            $urlRouterProvider.otherwise('home');
            $sceDelegateProvider.resourceUrlWhitelist(['**']);
    }])
    .directive('character', [function() {
        return {
            restrict: 'E',
            replace: true,
            scope: false,
            template: (
                '<div class="col-3 shadow card buffered fade1">' +
                    '<img class="card-img-top top-buffer" src="{{ character.image }}" alt="Card Image">' +
                    '<div class="card-block">' +
                        '<h5 class="top-buffer text-center capitalize">{{character.title}}</h5><hr>' +
                        '<h6>Motto:</h6>' +
                        '<div class="bottom-buffer">{{character.motto}}</div>' +
                    '</div>' +
                    '<div class="spacer"></div>' +
                    '<button class="btn btn-info rm-button bottom-buffer" ng-click="removeCard($event)">Remove</button>' +
                '</div>'
            ),
            link: function(scope, elm, attrs) {
                elm
                    .on('click', function() {
                        if(scope.clickedCharacters.indexOf(elm) == -1) {
                            scope.clickedCharacters.push(elm);
                            elm.css('background-color', '#123e54');
                            elm.css('color', 'white');
                            angular.element(elm).addClass('spinning');
                        }
                        else {
                            var index = scope.clickedCharacters.indexOf(elm);
                            scope.clickedCharacters.splice(index, 1);
                            elm.css('background-color', 'white');
                            elm.css('color', 'black');
                            angular.element(elm).removeClass('spinning');
                        }
                    })
                    .on('mouseenter', function() {
                        if(scope.clickedCharacters.indexOf(elm) == -1) {
                            elm.css('background-color', '#123e54');
                            elm.css('color', 'white');
                        }
                    })
                    .on('mouseleave', function() {
                        if(scope.clickedCharacters.indexOf(elm) == -1) {
                            elm.css('background-color', 'white');
                            elm.css('color', 'black');
                        }
                    });
            }
        };
    }])
    .factory('characterFactory', [function() {
        var b = {
            characters: []
        };
        return b;
    }])
    .controller('MainCtrl', [
        '$scope',
        '$http',
        'characterFactory',
        function($scope, $http, characterFactory) {
            $scope.showCharacter = true;
            $scope.characters = characterFactory.characters;
            $scope.clickedCharacters = [];
            $scope.addcharacter = function(character) {
                if(!character.title) {
                    return;
                }
                var giphyKey = 'IeXlzxFVSw6uP0esoNCTIRGvze438AcD';
                /*var giphyKey = 'SG528yrVA3XrM9yT0p9ZaEJHOdeM5bSK';*/
                /*var giphyKey = 'dc6zaTOxFJmzC';*/
                var url = 'http://api.giphy.com/v1/gifs/search?q=';
                var words = character.title.split(' ');
                for(var i = 0; i < (words.length - 1); i++) {
                    url += words[i];
                    url += '+';
                }
                url += words[(words.length - 1)];
                url += '&api_key=';
                url += giphyKey;
                url += '&rating=pg&limit=2';

                var mottourl = 'https://talaikis.com/api/quotes/random/';

                $http.get(url).then(function(response1) {
                    $http.get(mottourl).then(function(response2) {
                        image = response1.data.data[0].images.fixed_width.url;
                        mottoStr = response2["data"]["quote"]
                                    .replace('<p>', '')
                                    .replace('</p>', '')
                                    .replace('<br />', '')
                                    .replace('<em>', '')
                                    .replace('</em>', '')
                                    .replace('&#8217;', '\'')
                                    .split('.');
                        motto = mottoStr[0] + '.';
                        characterFactory.characters.push({
                            image: image,
                            title: character.title,
                            motto: motto
                        });
                        character.title = '';
                        $scope.characters = characterFactory.characters;
                    })
                    .catch(function(data) {
                        image = 'https://vignette.wikia.nocookie.net/nicktheultimaswordwielder/images/f/f1/Aang-2-.jpg/revision/latest?cb=20111128030857';
                        motto = 'The more you weigh, the harder you are to kidnap. Stay safe, eat cake.';
                        characterFactory.characters.push({
                            image: image,
                            title: character.title,
                            motto: motto
                        });
                        $scope.characters = characterFactory.characters;
                    })
                })
            };
            $scope.addCustomCharacter = function(character) {
                if(!character.imageurl) {image = 'https://vignette.wikia.nocookie.net/nicktheultimaswordwielder/images/f/f1/Aang-2-.jpg/revision/latest?cb=20111128030857';}
                else {image = character.imageurl;}

                if(!character.motto) {motto = 'The more you weigh, the harder you are to kidnap. Stay safe, eat cake.';}
                else {motto = character.motto;}

                if(!character.title) {title = 'The User Didn\'t Give Me a Name!';}
                else {title = character.title;}

                characterFactory.characters.push({
                    image: image,
                    title: title,
                    motto: motto
                })
                character.imageurl = '';
                character.motto = '';
                character.title = '';
                $scope.characters = characterFactory.characters;
            }
            $scope.removeCard = function(e) {
                var elem = angular.element(e.srcElement.parentElement);
                elem.remove();
            }
    }])
