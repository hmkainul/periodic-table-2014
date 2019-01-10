$(document).ready(function() {

    var result = {};
    var sortedElements = [];
    var percent = false;

    var ELEMENT = "td.element";
    var PARTS = ["number", "symbol", "name", "weight"];

    $(ELEMENT).mousedown(function(e) {
        e.preventDefault();
    });

    $(ELEMENT).click(function() {
        var current = {};
        var that = this;
        PARTS.forEach(function(name) {
            current[name] = $(that).find("." + name).text();
            $("#" + name + "_text").text(current[name]);
        });
        if (current.weight) {
            var symbol = current.symbol;
            $(this).css("background-color", "white");
            if (result[symbol]) {
                result[symbol] = Number(result[symbol]) + 1;
            } else {
                result[symbol] = 1;
            }
            printResult();
            $("#result_header").hide();
            $(".hide_me").show();
        }
    });

    $("#clear").click(function() {
        result = {};
        PARTS.forEach(function(name) {
            var text = name.substring(0, 1).toUpperCase() + name.substring(1);
            $("#" + name + "_text").text(text);
        });
        $(ELEMENT).css("background-color", "");
        $(".hide_me").hide();
        $("#result_header").show();
    });

    PARTS.forEach(function(name) {
        $("#" + name).click(function() {
            $("span." + name).toggle();
        });
    });

    function findWeight(name) {
        return $("#" + name).find(".weight").text().replace('[', '').replace(']', '');
    }

    function printResult() {
        var weight = Big(0);
        var C = "C";
        var H = "H";
        var s = "";
        sortedElements = [];
        for (var i in result) {
            if (!((i == C)||(i == H && result[C]))) {
                sortedElements.push(i);
            }
        }
        sortedElements.sort();
        if (result[C]) {
            if (result[H]) {
                sortedElements.unshift(H);
            }
            sortedElements.unshift(C);
        }
        if (percent) {
            for (var i = 0; i < sortedElements.length; i++) {
                var name = sortedElements[i];
                var no = result[name];
                weight = weight.plus(Big(no).times(Big(findWeight(name))));
            }
        }
        for (var i = 0; i < sortedElements.length; i++) {
            var name = sortedElements[i];
            var no = result[name];
            s = s + name;
            if (result[name] != 1) {
                s = s + '<sub>' + no + '</sub>';
            }
            if (percent) {
                var p = Big(no).times(Big(findWeight(name))).div(weight).times(100).round(2);
                s = s + '(' + p + '%) ';                
            } else {
                s = s + ' ';
                weight = weight.plus(Big(no).times(Big(findWeight(name))));
            }
        }
        $("#formula_value").html(s);
        $("#mass_value").text(weight);
        return s;
    }

    $("#percent").click(function(e) {
        percent = !percent;
        printResult();
    });

    $("#save_changes").click(function(e) {
        e.preventDefault();
        result = {};
        for (var i = 0; i < sortedElements.length; i++) {
            var name = sortedElements[i];
            var value = $("#" + name  + "_popup").val();
            if (Number(value) && value > 0) {
                result[name] = value;
            } else {
                $("#" + name).css("background-color", "");
            }
        }
        $('#myModal').modal('hide')
        printResult();
    });

    $("#modify").click(function() {
        var dialog = $("#modal_form");
        dialog.empty();
        for (var i = 0; i < sortedElements.length; i++) {
            var name = sortedElements[i];
            var t = '<div class="form-group row form-group-lg"><label for="' + name + '_popup" class="col-md-4 control-label">'
               + name + '</label><div class="col-md-8"><input type="number" min="0" name="'
               + name + '_popup" id="' + name + '_popup" class="form-control" value="' + result[name] + '"></div></div>';
            dialog.append(t);
        }
    });

    $(".hide_me").hide();

});

$(document).ready(function() {

    var previousMassFormWeight = "";

    function molarMass() {
        return $("#mass_value").text();
    }

    $("#mass").click(function() {
        var weight = molarMass();
        if (previousMassFormWeight !== weight) {
            $("#inputMolarMass").val(weight);
            if (previousMassFormWeight === "") {
                $("#inputMass").val("1.00");
                $("#inputMass").change();
            } else {
                $("#inputMoles").change();
            }
            previousMassFormWeight = weight;
        }
    });

    $("#inputMass, #inputMoles").on("change paste keyup", function() {
        var x = $(this).val().replace(/,/g, ".").replace(/ /g, "");
        var errorClass = "is-invalid";
        try {
            var result;
            var other = "inputMass";
            if ($(this).attr("id") === other) {
                result = Big(x).div(Big(molarMass()));
                other = "inputMoles"
            } else {
                result = Big(x).times(Big(molarMass()));
            }
            $("#" + other).val(result);
            $("#mass_modal_form").find(".form-control").removeClass(errorClass);
        } catch (e) {
            $(this).addClass(errorClass);
        }
    });

});
