var inputSub = document.getElementById('inputSub');
var inputTab = document.getElementById('inputTab');
var convertBtn = document.getElementById('convertBtn');
convertBtn.onclick = convert;

//convert SUB to array; break on new line
function splitSub() {
	var firstSubArr = inputSub.value.split('\n');
  return firstSubArr;
}

// convert the above SUB array; break on space; end up with an array of arrays
function convertSub(string) {
	var midArr = splitSub(string);
	var secondSubArr = [];
	for (var i = 0; i < midArr.length; i++) {
		var subItem = midArr[i].split(' ');
		secondSubArr.push(subItem);
	}	
	return secondSubArr;
}

//convert CSV to array; break on new line
function splitTable() {
	var firstTableArr = inputTab.value.split('\n');
	return firstTableArr;
}

// convert the above CSV array; break on space. end up with an array of arrays
function convertTable(string) {
	var midArr = splitTable(string);
	var secondTableArr = [];
	for (var i = 0; i < midArr.length; i++) {
    var tableItem = midArr[i].split('\t');
    secondTableArr.push(tableItem);
	}
	return secondTableArr;
}

// convert single time block
function convertTime(string) {
	var miliseconds = string.slice(-2);
	var input = Number.parseFloat(string);

	var minutes1 = Math.floor(input / 60);
	var minStr = minutes1.toString();
	var minutes = minStr.padStart(2, '00');
	
	var seconds1 = Math.floor(input - minutes * 60);
  var secStr = seconds1.toString();
	var seconds = secStr.padStart(2, '00');

	var time = minutes + ':' + seconds + ',' + miliseconds;
	return time;
}

// conver times of the whole table
function convertTableTime(arr) {
	var correctTimeTab = arr.slice(0);
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if ( j == 2 || j == 3 ) {
				correctTimeTab[i].splice(j, 1, convertTime(arr[i][j]) );
			}
		}
	}
	return correctTimeTab;
}

// format time correctly
function formatTime(string) {
	var step1 = string.padStart(11, '00:00:00,00');
	var step2 = step1.padEnd(12, '0');
	var final = step2.replace('.', ',');
	return final;
}

// remove punctuation marks from subs
function removePunct(arr) {
	var arrSubNoPunct = arr.slice(0);
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if ( !arr[i][j].match( /\d\d[:]\d\d[:]\d\d[,]\d\d\d/ ) ) {
				arrSubNoPunct[i].splice(j, 1, arrSubNoPunct[i][j].replace(/[,.!?]/g,''));
			}
		}
	}
	return arrSubNoPunct;
}

// alternate switch times

function altSwitchTimes(arrTab, arrSub) {
	var newSub = arrSub.slice(0);
	var newTab = arrTab.slice(0);
	for (var k = 1; k < newSub.length; k++) {
		partyStarter:
		for (var m = 0; m < 1; m++) {
			if ( (m == 0) && ( newSub[k-1][0].match( /\d\d[:]\d\d[:]\d\d[,]\d\d\d/ ) ) ) {
        // start iterating though the Tab
        for (var i = 0; i < newTab.length; i++) { // (var i = newTab.length - 1; i >= 0; i--) {
        	for (var j = 0; j < 2; j++) {
        		// check if matches
        		if ( newSub[k][0] === newTab[i][j] ) {
              newSub[k-1].splice(0, 1, formatTime(newTab[i][2]) );
              newTab[i].splice(0, 2);
              for (var z = 0; z < i; z++) {
              	newTab[z].splice(0,2);
              }
              break partyStarter;
        		}
        		else if (newSub[k][0] === '>>') {
              if ( newSub[k][1] === newTab[i][j] ) {
              	newSub[k-1].splice(0, 1, formatTime(newTab[i][2]) );
                newTab[i].splice(0, 2);
                for (var y = 0; y < i; y++) {
              	  newTab[y].splice(0,2);
                }
                break partyStarter;
              }
        		}
          } 
        }
			}
		}
	}
	return newSub;
}

// join on space
function joinBack(arr) {
	var newArr = [];
	for (var i = 0; i < arr.length; i++) {
		newArr.push(arr[i].join(' '));
	}
	return newArr;
}

// display stuff
function display(text) {
  var result = document.getElementById('result');
  result.innerText = text;
}

// magic 
function convert(sub, tab) {
  var convertedSub = convertSub(sub);
  var convertedTab = convertTable(tab);
  var correctTab = convertTableTime(convertedTab);
  var arrSubNoPunct = removePunct(convertedSub);
  // var switchedSub = switchTimes(convertedTab, convertedSub);
  var switchedSub = altSwitchTimes(correctTab, arrSubNoPunct);
  var firstJoin = joinBack(switchedSub);
  var finalJoin = firstJoin.join('\n');
  display(finalJoin);
}
