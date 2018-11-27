$(document).ready(function() {
    $("#submitCard").click(function(e) {
        e.preventDefault();
        var value = $("#cardNameField").val();
        var url = "https://api.scryfall.com/cards/named?exact="+value;

        $.ajax({
             type:'GET',
             url: url,
             dataType:'json',
             success:function(data){
                console.log(data);
                document.getElementById("cardImage").src=data["image_uris"]["normal"];
             }
         });
    })

    $("#translateCard").click(function(e) {
        e.preventDefault();
        var numRounds = $("#numberChoice").val();
        var cardName = $("#cardNameField").val();
        var cardType;
        var cardRarity;
        var cardFlavor;
        var cardDescription;
        console.log(cardName);

        $.ajax({
             type:'GET',
             url: 'UST.json',
             dataType:'json',
             success:function(data){
                 var cards = data.cards;
                 $.each(cards, function(index, value) {
                     var cardName = value.name;
                     if(cardName.toUpperCase().indexOf($("#cardNameField").val().toUpperCase()) !== -1) {
                         cardRarity = value.rarity;
                         cardType = value.type;
                         cardFlavor = value.flavor;
                         cardDescription = value.text;
                         $("#cardName").text(cardName);
                         $("#cardRarity").text(cardRarity);
                         $("#cardType").text("Type: " + cardType);
                         $("#cardFlavor").text(cardFlavor);
                         $("#cardDescription").text(cardDescription);
                     }
                 });

             },
             complete:function() {
                 translate(0, numRounds, cardType, "cardType");
                 translate(0, numRounds, cardDescription, "cardDescription");
                 translate(0, numRounds, cardName, "cardName");
                 if(cardFlavor != null){
                     translate(0, numRounds, cardFlavor, "cardFlavor");
                 }
                 if(cardRarity != null){
                     translate(0, numRounds, cardRarity, "cardRarity");
                 }
             }
         });

    })

    $("#numberChoice").change(function(e) {
        e.preventDefault();
        var value = $("#numberChoice").val();
        console.log(value);

    })

    $("#cardNameField").keyup(function() {
        //Make and return links to cards on hover
        var dataList = document.getElementById('card-datalist');
        dataList.innerHTML = '';
        var input = document.getElementById('cardNameField');

        $.ajax({
             type:'GET',
             url: 'UST.json',
             dataType:'json',
             success:function(data){
                 var cards = data.cards;
                 $.each(cards, function(index, value) {
                     var cardName = value.name.toUpperCase();
                     if(cardName.startsWith($("#cardNameField").val().toUpperCase())) {
                        var doesExist = false;
                        for (i = 0; i<dataList.options.length; i++) {
                            if (dataList.options.item(i).value === value.name) {
                                doesExist = true;
                                break;
                            }
                        }
                        if (!doesExist) {
                             var option = document.createElement('option');
                             option.value = value.name;
                             dataList.appendChild(option);
                        }
                     }
                 });

             }
         });

         input.placeholder = "Search Magic cards";
     })

});

function translate(index, numRounds, description, objID) {
    console
    var targetLang = ['af', 'ko', 'ga', 'ja', 'kn', 'la', 'eu', 'bn', 'ar', 'sq', 'af', 'ca', 'mk', 'mt', 'no', 'fa', 'nl',
                       'gl', 'ka', 'de', 'sv', 'gu', 'hi', 'iw', 'ur', 'cy', 'yi'];

    var target = targetLang[Math.floor(Math.random()*targetLang.length)];
    console.log(target);
    var myurl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=";
    myurl += target;
    myurl += "&dt=t&q="
    myurl += encodeURI(description);

    $.ajax({
        type:'GET',
        url: myurl,
        dataType:'json',
        success:function(data) {
            console.log(data);
            description = data[0][0][0];
            for(var i = 1; i < data[0].length; i++){
                if(data[0][i] != null) {
                    if(data[0][i][0] != null) {
                        description += data[0][i][0];
                    }
                }
            }
            if(index < numRounds) {
                index += 1;
                translate(index, numRounds, description, objID);
            }
            else {
                translateEnglish(description, objID);
            }
        },
        error:function(){
            alert("Max number of translations hit!");
        }
    })
}

function translateEnglish(description, objID) {
    var myurl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=";
    myurl += encodeURI(description);

    $.ajax({
        type:'GET',
        url: myurl,
        dataType:'json',
        success:function(data) {
            console.log(data);
            description = data[0][0][0];
            for(var i = 1; i < data[0].length; i++){
                if(data[0][i] != null) {
                    if(data[0][i][0] != null) {
                        description += data[0][i][0];
                    }
                }
            }

            if(objID == "cardName") {
                $("#cardName").text(description);
            }
            else if(objID == "cardDescription") {
                $("#cardDescription").text(description);
            }
            else if(objID == "cardType"){
                $("#cardType").text(description);
            }
            else if(objID == "cardFlavor"){
                $("#cardFlavor").text(description);
            }
            else if(objID == "cardRarity"){
                $("#cardRarity").text(description);
            }
        }
    })
}
