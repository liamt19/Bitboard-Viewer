let selectedLayout = 1;

$(document).ready(function() {
    generateLayout($('#layout1'), 1);
    generateLayout($('#layout2'), 2);
    generateLayout($('#layout3'), 3);
    generateLayout($('#layout4'), 4);
    
    generateBitboard($('#bitboard1'), $('#decBitboard1'), false);
    generateBitboard($('#bitboard2'), $('#decBitboard2'), false);
    generateBitboard($('#bitboard3'), $('#decBitboard3'), true);
    
    loadCookies();   
    $('#container').show();
    
    $('#layoutRadio1').click(() => changeLayout(1));
    $('#layoutRadio2').click(() => changeLayout(2));
    $('#layoutRadio3').click(() => changeLayout(3));
    $('#layoutRadio4').click(() => changeLayout(4));
    
    $('#decBitboard1').keyup(() => decKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'), $('#upperBitboard1'), $('#lowerBitboard1')));
    $('#hexBitboard1').keyup(() => hexKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'), $('#upperBitboard1'), $('#lowerBitboard1')));
    $('#binBitboard1').keyup(() => binKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'), $('#upperBitboard1'), $('#lowerBitboard1')));
    $('#upperBitboard1').keyup(() => upperKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'), $('#upperBitboard1'), $('#lowerBitboard1')));
    $('#lowerBitboard1').keyup(() => lowerKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'), $('#upperBitboard1'), $('#lowerBitboard1')));

    $('#decBitboard2').keyup(() => decKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'), $('#upperBitboard2'), $('#lowerBitboard2')));
    $('#hexBitboard2').keyup(() => hexKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'), $('#upperBitboard2'), $('#lowerBitboard2')));
    $('#binBitboard2').keyup(() => binKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'), $('#upperBitboard2'), $('#lowerBitboard2')));
    $('#upperBitboard2').keyup(() => upperKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'), $('#upperBitboard2'), $('#lowerBitboard2')));
    $('#lowerBitboard2').keyup(() => lowerKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'), $('#upperBitboard2'), $('#lowerBitboard2')));

    $('#fillBitboard1').click(() => fillBitboard($('#decBitboard1')));
    $('#fillBitboard2').click(() => fillBitboard($('#decBitboard2')));
    
    $('#clearBitboard1').click(() => clearBitboard($('#decBitboard1')));
    $('#clearBitboard2').click(() => clearBitboard($('#decBitboard2')));
    
    $('#shlBitboard1').click(() => shlBitboard($('#decBitboard1')));
    $('#shlBitboard2').click(() => shlBitboard($('#decBitboard2')));
    
    $('#shrBitboard1').click(() => shrBitboard($('#decBitboard1')));
    $('#shrBitboard2').click(() => shrBitboard($('#decBitboard2')));
    
    $('#notBitboard1').click(() => notBitboard($('#decBitboard1')));
    $('#notBitboard2').click(() => notBitboard($('#decBitboard2')));
    
    $('#andBitboard3').click(() => doOperation((x, y) => x & y));
    $('#orBitboard3').click(() => doOperation((x, y) => x | y));
    $('#xorBitboard3').click(() => doOperation((x, y) => x ^ y));

    updateBitboard($('#bitboard1'),BigInt($('#decBitboard1').val()));
    updateBitboard($('#bitboard2'),BigInt($('#decBitboard2').val()));
    updateBitboard($('#bitboard3'),BigInt($('#decBitboard3').val()));
});

function generateLayout(layout, variant) {
    for (var y = 0; y < 9; y++) {
        var row = $(document.createElement('div')).prop({
            class: 'layout-row'
        });
        
        for (var x = 0; x < 9; x++) {
            var value = getselectedLayoutByXY(variant, x, y);
            if (value < 10) {
                value = '0' + value;
            }
            
            var span = $(document.createElement('span')).html(value);
            row.append(span);
        }
        
        layout.append(row);
    }
}

function generateBitboard(bitboard, decTextbox, readOnly) {
	// Add bottom div for column buttons
	if (!readOnly) {
		var bottomrow = $(document.createElement('div')).prop({
			class: 'bitboard-row'
		});
	}
	
	for (var y = 0; y < 9; y++) {
		var row = $(document.createElement('div')).prop({
			class: 'bitboard-row'
		});
		
		// Add buttons to fill a row
		if (!readOnly){
			var rowbutton = $(document.createElement('button')).prop({
				type: 'rowbutton',
				value: y,
				id: y,
				class: "btn btn-primary",
			});
			
			rowbutton.click(((v) => () => rowClick(bitboard, decTextbox, v))(y))
		}
		
		// Buttons to fill columns
		const files =  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
		if (!readOnly) {
			var colbutton = $(document.createElement('button')).prop({
				type: 'colbutton',
				value: files[y],
				id: y,
				class: "btn btn-primary",
				style: y == 0 ? "margin-left: 22px" : ""
			});
			
			colbutton.click(((v) => () => colClick(bitboard, decTextbox, v))(files[y]))
		}
		
		// Checkboxes
		for (var x = 0; x < 9; x++) {
			var value = x + y * 9;
			var checkbox = $(document.createElement('input')).prop({
				type: 'checkbox',
				value: value,
			});
			
			if (readOnly) {
				checkbox.prop('readonly', true);
			}

			checkbox.click(((v) => () => bitboardCheckboxClick(bitboard, decTextbox, v))(value));
			
			if (!readOnly) {
				row.prepend(rowbutton);
			}
				
			if (!readOnly) {
				bottomrow.append(colbutton);
			}
			
			row.append(checkbox);
		}
		
		bitboard.append(row);
		
		if (!readOnly) {
			bitboard.append(bottomrow)
		};

	}
	
	if (readOnly){
		var colspacer = $(document.createElement('div')).prop({
			class: 'colspacer'
		});
		bitboard.append(colspacer)
    }
}

function loadCookies() {
    var selectedLayoutCookie = Cookies.get('selectedLayout');
    if (selectedLayoutCookie != undefined) {
        selectedLayout = parseInt(selectedLayoutCookie);
        $('#layoutRadio' + selectedLayoutCookie).prop('checked', true);
    }
    else {
        $('#layoutRadio1').prop('checked', true);
    }
}

function changeLayout(variant) {
    selectedLayout = variant;
    refreshValuesAfterLayoutChange();
    
    Cookies.set('selectedLayout', variant, { expires: 10 * 365 });
}

function refreshValuesAfterLayoutChange() {
    decKeyUp($('#bitboard1'), $('#decBitboard1'), $('#hexBitboard1'), $('#binBitboard1'), $('#upperBitboard1'), $('#lowerBitboard1'));
    decKeyUp($('#bitboard2'), $('#decBitboard2'), $('#hexBitboard2'), $('#binBitboard2'), $('#upperBitboard2'), $('#lowerBitboard2'));
    decKeyUp($('#bitboard3'), $('#decBitboard3'), $('#hexBitboard3'), $('#binBitboard3'), $('#upperBitboard3'), $('#lowerBitboard3'));
}

function doOperation(operation) {
    var value1 = BigInt($('#decBitboard1').val());
    var value2 = BigInt($('#decBitboard2').val());
    var result = operation(value1, value2);
    
    updateReadOnlyTextboxes(result);
    updateBitboard($('#bitboard3'), result);
}

function decKeyUp(bitboard, decTextbox, hexTextbox, binTextbox, upperTextBox, lowerTextBox) {
    var bigIntValue = BigInt(decTextbox.val());
    hexTextbox.val('0x' + itoh(bigIntValue));
    binTextbox.val('0b' + bigIntValue.toString(2));

    upperTextBox.val('0x' + itoh(upperBits(bigIntValue)));
    lowerTextBox.val('0x' + itoh(lowerBits(bigIntValue)));
    
    updateBitboard(bitboard, bigIntValue);
}

function hexKeyUp(bitboard, decTextbox, hexTextbox, binTextbox, upperTextBox, lowerTextBox) {
    var bigIntValue = BigInt(hexTextbox.val());
    decTextbox.val(bigIntValue.toString(10));
    binTextbox.val('0b' + bigIntValue.toString(2));

    upperTextBox.val('0x' + itoh(upperBits(bigIntValue)));
    lowerTextBox.val('0x' + itoh(lowerBits(bigIntValue)));
    
    updateBitboard(bitboard, bigIntValue);
}

function binKeyUp(bitboard, decTextbox, hexTextbox, binTextbox, upperTextBox, lowerTextBox) {
    var bigIntValue = BigInt(binTextbox.val());
    decTextbox.val(bigIntValue.toString(10));
    hexTextbox.val('0x' + itoh(bigIntValue));

    upperTextBox.val('0x' + itoh(upperBits(bigIntValue)));
    lowerTextBox.val('0x' + itoh(lowerBits(bigIntValue)));
    
    updateBitboard(bitboard, bigIntValue);
}

function upperKeyUp(bitboard, decTextbox, hexTextbox, binTextbox, upperTextBox, lowerTextBox) {
    var bigIntValue = make128(BigInt(upperTextBox.val()), BigInt(lowerTextBox.val()))
    decTextbox.val(bigIntValue.toString(10));
    hexTextbox.val('0x' + itoh(bigIntValue));
    binTextbox.val('0b' + bigIntValue.toString(2));

    lowerTextBox.val('0x' + itoh(lowerBits(bigIntValue)));
    
    updateBitboard(bitboard, bigIntValue);
}

function lowerKeyUp(bitboard, decTextbox, hexTextbox, binTextbox, upperTextBox, lowerTextBox) {
    var bigIntValue = make128(BigInt(upperTextBox.val()), BigInt(lowerTextBox.val()))
    decTextbox.val(bigIntValue.toString(10));
    hexTextbox.val('0x' + itoh(bigIntValue));
    binTextbox.val('0b' + bigIntValue.toString(2));

    upperTextBox.val('0x' + itoh(upperBits(bigIntValue)));
    
    updateBitboard(bitboard, bigIntValue);
}

function updateReadOnlyTextboxes(value) {
    $('#decBitboard3').val(value.toString(10));
    $('#hexBitboard3').val('0x' + itoh(value));
    $('#binBitboard3').val('0b' + value.toString(2));

    $('#lowBitboard3').val('0x' + itoh(lowerBits(value)));
    $('#highBitboard3').val('0x' + itoh(upperBits(value)));
}

function updateBitboard(bitboard, value) {
    for (var index = 0; index < 81; index++) {
        var bit = value & 1n;
        value = value >> 1n;
        
        var bitboardIndex = getselectedLayoutByIndex(selectedLayout, index);
        bitboard.find('input[type=checkbox][value=' + bitboardIndex + ']').prop('checked', bit != 0);
    }
}

function bitboardCheckboxClick(bitboard, decTextbox, index) {
    var checkbox = bitboard.find('input[type=checkbox][value=' + index + ']');
    var state = checkbox.prop('checked');
    var variantIndex = BigInt(getselectedLayoutByIndex(selectedLayout, index));
    var value = BigInt(decTextbox.val());
    value = (value & ~(1n << variantIndex)) | (BigInt(state ? 1 : 0) << variantIndex);
    decTextbox.val(value);
    
    refreshValuesAfterLayoutChange();
}

function rowClick(bitboard, decTextbox, rank){
    // Magic number is a fully filled 8th rank
    var toprow = 2413129272746388704198656n;
    // Inverse the shiftvalue for different layouts
    var shiftval = BigInt(calcRowShiftValue(selectedLayout, rank));
    var row = toprow >> (shiftval * 9n);
    // OR the existing field and the newly filled row
    var newvalue = BigInt(decTextbox.val()) | row;

    // If the row is filled, clear it
    if(newvalue === BigInt(decTextbox.val())){
        newvalue = newvalue & ~(row);
    }

    decTextbox.val(newvalue);
    
    refreshValuesAfterLayoutChange();
}

function colClick(bitboard, decTextbox, file){
    const files =  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    file = BigInt(files.indexOf(file));
    // Magic number is a fully filled H file
    var rightcol = 2365803952279117758720n
    // Inverse the shiftvalue for different layouts
    var shiftval = calcColShiftValue(selectedLayout, 8n - file);
    var col =  rightcol >> shiftval;
    // OR the existing field and the newly filled col
    var newvalue = BigInt(decTextbox.val()) | col;
    
    // If the row is filled, clear it
    if(newvalue === BigInt(decTextbox.val())){
        newvalue = newvalue & ~(col);
    }

    decTextbox.val(newvalue);
    
    refreshValuesAfterLayoutChange();
}

function fillBitboard(decTextbox) {
    decTextbox.val('2417851639229258349412351');
    refreshValuesAfterLayoutChange();
}

function clearBitboard(decTextbox) {
    decTextbox.val('0');
    refreshValuesAfterLayoutChange();
}

function shlBitboard(decTextbox) {
    var value = BigInt(decTextbox.val());
    var lastBitValue = value & (1n << 80n);
    if(lastBitValue != 0n) {
        value = value & ~lastBitValue; 
    }

    value = value << 1n;
    decTextbox.val(value);
    
    refreshValuesAfterLayoutChange();
}

function shrBitboard(decTextbox) {
    var value = BigInt(decTextbox.val());
    value = value >> 1n & ~(1n << 80n);
    decTextbox.val(value);
    
    refreshValuesAfterLayoutChange();
}

function notBitboard(decTextbox) {
    var value = BigInt(decTextbox.val());
    value = 2417851639229258349412351n - value;
    decTextbox.val(value);
    
    refreshValuesAfterLayoutChange();
}

function getselectedLayoutByXY(variant, x, y) {
    switch (variant) {
        case 1: return 80 - (8 - x + y * 9);
        case 2: return 80 - (x + y * 9);
        case 3: return x + y * 9;
        case 4: return 8 - x + y * 9;
    }
    
    return 0;
}

function getselectedLayoutByIndex(variant, index) {
    return getselectedLayoutByXY(variant, index % 9, Math.floor(index / 9));
}

function calcRowShiftValue(variant, value) {
    switch (variant) {
        case 1: return value;
        case 2: return value;
        case 3: return 8 - value;
        case 4: return 8 - value;
    }
}

function calcColShiftValue(variant, value) {
    switch (variant) {
        case 1: return value;
        case 2: return 8n - value;
        case 3: return value;
        case 4: return 8n - value;
    }
}

function lowerBits(value) {
    return value & 18446744073709551615n;
}

function upperBits(value) {
    return ((value >> 64n) & 18446744073709551615n);
}

function make128(upper, lower) {
    return (upper << 64n) | lower;
}

function itoh(value) {
    return value.toString(16).toUpperCase();
}