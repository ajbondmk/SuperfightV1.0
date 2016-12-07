(function () {
    'use strict';

    angular
        .module('app')
        .controller('myController', myController);

    function myController($scope) {

        //Loads the card data and sets them to upper case
        var tempData;
        read("../SuperfightV1.0/Cards/Characters.txt");
        var wCards = tempData.split("\n");
        for (var i = 0; i < wCards.length; i++) { wCards[i] = wCards[i].toUpperCase(); }
        read("../SuperfightV1.0/Cards/Attributes.txt");
        var bCards = tempData.split("\n");
        for (var i = 0; i < bCards.length; i++) { bCards[i] = bCards[i].toUpperCase(); }

        function read(file) {
            var readfile = new XMLHttpRequest();
            readfile.open("GET", file, false);
            readfile.onreadystatechange = function () {
                if (readfile.readyState === 4) {
                    if (readfile.status === 200 || readfile.status === 0) {
                        tempData = readfile.responseText;
                    }
                }
            };
            readfile.send(null);
        }

        //Card object
        function Card(value) {
            this.value = value;
            this.selected = false;
        }

        //Player object
        function Player() {

            //These objects are CARDS (or arrays of cards)
            this.cards = { white: [], black: [] };
            this.chosen = { white: new Card(""), black: new Card("") };
            this.assigned = { white: new Card(""), black: new Card("") };

            this.submitted = false;
            this.submit = function () {
                this.submitted = true;
                this.assigned.black = chooseCards(bCards, 1)[0];
            };
        }

        //Online players
        $scope.players = [];
        for (var i = 0; i < 2; i++) {
            $scope.players[i] = new Player();
        }

        //Shuffles an array
        function shuffle(array) {
            var counter = array.length;
            var temp;
            var index;
            while (counter > 0) {
                index = Math.floor(Math.random() * counter);
                counter--;
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        }

        (function shuffleAll() {
            wCards = shuffle(wCards);
            bCards = shuffle(bCards);
        })();

        //Returns an array of cards
        function chooseCards(array, num) {
            var cards = [];
            for (var i = 0; i < num; i++) {
                cards.push(new Card(array[array.length - 1]));
                array.pop();
            }
            return cards;
        }

        //When the user clicks on a card (selects the card)
        $scope.selectCard = function (value, player, colour) {

            var chosen;
            var cards;

            if (colour == "W") {
                chosen = player.chosen.white;
                cards = player.cards.white;
            } else {
                chosen = player.chosen.black;
                cards = player.cards.black;
            }

            chosen.value = value;
            cards.forEach(function (card) {
                card.selected = false;
                if (card.value == chosen.value) card.selected = true;
            });
        };

        //Checking if the user has selected 2 cards (which then allows the submit button to be pressed)
        $scope.cannotSubmit = function (player) {
            return (player.chosen.white.value === "" || player.chosen.black.value === "");
        };

        $scope.wonRound = function (player) {
            var i = 0;
        };

        //Actual code starts here XD

        $scope.players.forEach(function (player) {
            player.cards.black = chooseCards(bCards, 3);
            player.cards.white = chooseCards(wCards, 3);
        });
    }

})();