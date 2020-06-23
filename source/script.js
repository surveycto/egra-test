var timeStart = 20000 // Time limit on each field in milliseconds
var choices = fieldProperties.CHOICES // Array of choices
var complete = false // Keep track of whether the test was completed
var timeLeft = timeStart // Starts this way for the display.
var timePassed = 0 // Time passed so far
var timerRunning = false // Track whether the timer is running
var startTime = 0 // This will get an actual value when the timer starts in startStopTimer();
var selectedItems // Track selected (incorrect) items
var lastSelected = null // Track last selected item
var ans = choices[0].CHOICE_VALUE //
var timeRemaining = 0
var endFirstLine = 'No' // Whether they ended on the firstline or not
var choiceLabelsArray = [] // Array of choice labels
var type = getPluginParameter ('type')
var columns = 10

var timerDisp = document.querySelector('#timer')
// var changer = document.querySelector('#changer')
var button = document.querySelector('#startstop')
// var endearlyDisp = document.querySelector('#endearly')
// var dispselected = document.querySelector('#dispselected')
// var lastselectedDisp = document.querySelector('#lastselected')
var nextButton = document.getElementById('nextButton')
var backButton = document.getElementById('backButton')
var timerDisplay = document.querySelector('#timerDisplay')
// var gridItems = document.querySelectorAll('.box')

var div = document.getElementById('button-holder')
var secondDIV
var x = window.matchMedia('(max-width: 660px)')
var y = window.matchMedia('(min-width: 660px)')
// var z = window.matchMedia('(min-width: 992px)')
myFunction(x)
myFunction1(y)
// myFunction2(z)
x.addListener(myFunction)
y.addListener(myFunction1)
// z.addListener(myFunction2)
var screenSize
function myFunction (x) { if (x.matches) { screenSize = 'small' } }
function myFunction1 (y) { if (y.matches) { screenSize = 'medium' } }
// function myFunction2 (z) { if (z.matches) { screenSize = 'large' } }

if (type === 'words' && screenSize !== 'small') {
  screenSize = 'large'
  columns = 5
}

createGrid(choices)

function createGrid (keys) {
  var counter = 0
  var fieldsetClass
  for (var i = 0; i < keys.length / columns; i++) {
    var fieldset = document.createElement('section')
    var tracker = i + 1
    var legend = document.createElement('h1')
    var text1 = '(' + tracker + ')'
    var legendText = document.createTextNode(text1)
    legend.appendChild(legendText)
    fieldset.appendChild(legend)
    var fieldsetId = 'fieldset' + tracker
    if (screenSize === 'small') {
      fieldsetClass = 'sm' + tracker
      if (tracker > 2) {
        fieldset.classList.add('hidden')
      }
    } else if (screenSize === 'medium') {
      fieldsetClass = 'ms' + tracker
    } else if (screenSize === 'large') {
      fieldsetClass = 'lg' + tracker
    }
    fieldset.setAttribute('id', fieldsetId)
    fieldset.classList.add(fieldsetClass, 'fieldset')
    for (var j = 0; j < columns; j++) {
      secondDIV = document.createElement('div')
      var itemValue = counter + 1
      var itemClass = 'item' + (counter + 1)
      if (screenSize === 'small') { createSmallGrid(itemValue, itemClass)
      } else if (screenSize === 'medium') { createMediumGrid(itemValue, itemClass)
      } else if (screenSize === 'large') { createLargeGrid(itemValue, itemClass) }
      var text = document.createTextNode(choices[counter].CHOICE_LABEL)
      choiceLabelsArray.push(choices[counter].CHOICE_LABEL) // add choice labels to Array
      counter++
      secondDIV.appendChild(text)
      fieldset.appendChild(secondDIV)
    }
    div.append(fieldset)
  }
  return true
}

if (createGrid) {
  var gridItems = document.querySelectorAll('.box')
  Array.from(gridItems, function (box) {
    box.addEventListener('click', function () {
      itemClicked(this)
    })
  })
  setInterval(timer, 1)
}

function timer () {
  if (timerRunning) {
    timePassed = Date.now() - startTime
    timeLeft = timeStart - timePassed
  }

  if (timeLeft < 0) {
    endTimer()
  }
  timerDisp.innerHTML = Math.ceil(timeLeft / 1000)
}

function startStopTimer () {
  timerDisplay.classList.remove('hidden')
  if (timerRunning) {
    timerRunning = false
    button.innerHTML = 'Resume'
    openPauseModal()
  } else {
    startTime = Date.now() - timePassed
    timerRunning = true
    // endearlyDisp.innerHTML = ''
    button.innerHTML = 'Pause'
  }
}

function endEarly () {
  openModal('End now? 10 wrong answers on row 1.')
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
    timeRemaining = Math.ceil(timeLeft / 1000) // Amount of time remaining
    console.log('time remaining is ' + timeRemaining)
    console.log('time left is ' + timeLeft)
    endTimer()
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
  }
}

function endTimer () {
  console.log('entering end timer')
  timeLeft = 0
  timerRunning = false
  openLastItemModal()
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
    selectedItems = getSelectedItems()
    // dispselected.innerHTML = 'Clicked on: ' + selectedItems
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
  }
}

var topTen = choices.slice(0, 10)
var firstTenItems = []

for (x = 0; x < topTen.length; x++) {
  firstTenItems.push(choices[x].CHOICE_LABEL)
}
console.log('top ten is ' + firstTenItems)
var itemCounter = 0
var items = []

function itemClicked (item) {
  if (timerRunning) { // This way, it only works when the timer is running
    const classes = item.classList
    if (classes.contains('selected')) {
      classes.remove('selected')
    } else {
      classes.add('selected')
      if (itemCounter <= 9) {
        itemCounter++
        items.push(item.innerText)
        var isSame = firstTenItems.length == items.length && firstTenItems.every(function (element, index) {
          return element == items[index]
        })
        if (isSame) {
          console.log('Is same is ' + isSame)
          timerRunning = false
          endFirstLine = 'Yes' // Indicate that the first line was all incorrect
          endEarly()
        }
        console.log(itemCounter)
        console.log(items)
      }
    }
  } else if (timeLeft === 0) { // This is for selecting the last letter, and it will be used at the very end.
    for (const cell of gridItems) { // This removes the red border in case another cell was previously selected
      cell.classList.remove('lastSelected')
    }
    item.classList.add('lastSelected')
    lastSelected = item.innerText // Get value of last selected item
    // selectedItems = getSelectedItems()
    checkLastItem()
    if (complete) {
      console.log('ending last selected')
      // changer.innerHTML = 'All set! You can move on to the next field, or select a different last letter. To clear your answers, clear the response on this page.'
      // ans = lastSelected + ' ' + selectedItems
      // lastselectedDisp.innerHTML = 'Last selected: ' + lastSelected
      setResult()
      openModal('Thank you! You can move to the next section')
      console.log('exiting last selected')
      // goToNextField()
    } else {
      for (const cell of gridItems) { // This removes the red border in case another cell was previously selected
        cell.classList.remove('lastSelected')
      }
      item.classList.add('lastSelected')
      lastSelected = item.innerText // Get value of last selected item
      checkLastItem()
    }
  }
}

function checkLastItem () {
  var selectedItemsArray = selectedItems.split(' ')
  var lastClickedItem = selectedItemsArray[selectedItemsArray.length - 1] // Get the last item that was incorrect
  var indexLastClickedItem = choiceLabelsArray.lastIndexOf(lastClickedItem) // Get index of last clicked item
  var indexLastSelectedItem = choiceLabelsArray.lastIndexOf(lastSelected) // Get index of last selected item
  if (indexLastClickedItem >= indexLastSelectedItem) {
    console.log('Entering the if statement.')
    openModal('Please click an item after the last incorrect item.')
    console.log('Time left is ' + timeLeft)
    Array.from(gridItems, function (box) {
      box.addEventListener('click', function () {
        itemClicked(this)
      })
    })
  } else {
    complete = true
  }
}

function getSelectedItems () {
  const selectedLet = []
  for (const cell of gridItems) {
    if (cell.classList.contains('selected')) {
      selectedLet.push(cell.innerText)
    }
  }
  return selectedLet.join(' ')
}

function clearAnswer () {
  if (timerRunning) {
    startStopTimer()
  }
  setAnswer()
  timePassed = 0
}

// set the results to published
function setResult () {
  console.log('Time Remaining ' + timeRemaining)
  console.log('Last Selected ' + lastSelected)
  var totalItems = choices.map(function (o) { return o.CHOICE_LABEL }).indexOf(lastSelected) + 1 // total number of items attempted
  console.log('Total Items  ' + totalItems)
  var splitselectedItems = selectedItems.split(' ')
  var incorrectItems = splitselectedItems.length // Number of incorrect items attempted
  console.log('Incorrect Items  ' + incorrectItems)
  var correctItems = totalItems - incorrectItems // Number of correct items attempted
  console.log('Correct Items  ' + correctItems)
  // create delimited result string to be accessed using the plugin-metadata() function
  var result = timeRemaining + '|' + totalItems + '|' + incorrectItems + '|' + correctItems + '|' + endFirstLine
  setAnswer(ans) // set answer to dummy result
  setMetaData(result) // make result accessible as plugin metadata
}

// Create grid on small screen
function createSmallGrid (itemValue, itemClass) {
  if (itemValue <= 10) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 11 && itemValue < 20) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 20 && itemValue < 30) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 30 && itemValue < 40) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 40 && itemValue < 50) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 50 && itemValue < 60) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 60 && itemValue < 70) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 70 && itemValue < 80) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 80 && itemValue < 90) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 90 && itemValue <= 100) {
    secondDIV.classList.add('box', itemClass)
  }
}

function createMediumGrid (itemValue, itemClass) {
  if (itemValue <= 10) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 11 && itemValue < 20) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 20 && itemValue < 30) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 30 && itemValue < 40) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 40 && itemValue < 50) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 50 && itemValue < 60) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 60 && itemValue < 70) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 70 && itemValue < 80) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 80 && itemValue < 90) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 90 && itemValue <= 100) {
    secondDIV.classList.add('box', itemClass)
  }
  nextButton.classList.add('hideButton')
}

function createLargeGrid (itemValue, itemClass) {
  if (itemValue <= 5) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 6 && itemValue <= 10) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 11 && itemValue <= 15) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 16 && itemValue <= 20) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 21 && itemValue <= 25) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 26 && itemValue <= 30) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 31 && itemValue <= 35) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 36 && itemValue <= 40) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 41 && itemValue <= 45) {
    secondDIV.classList.add('box', itemClass)
  }
  if (itemValue >= 46 && itemValue <= 50) {
    secondDIV.classList.add('box', itemClass)
  }
  nextButton.classList.add('hideButton')
}

// get next button and bind click event handler
document.querySelector('.next').addEventListener('click', function () {
  backButton.classList.remove('hideButton')
  var fieldset1 = document.querySelector('#fieldset1')
  var fieldset2 = document.querySelector('#fieldset2')
  var fieldset3 = document.querySelector('#fieldset3')
  var fieldset4 = document.querySelector('#fieldset4')
  var fieldset5 = document.querySelector('#fieldset5')
  var fieldset6 = document.querySelector('#fieldset6')
  var fieldset7 = document.querySelector('#fieldset7')
  var fieldset8 = document.querySelector('#fieldset8')
  var fieldset9 = document.querySelector('#fieldset9')
  var fieldset10 = document.querySelector('#fieldset10')

  if (type === 'letters') {
    if (!fieldset1.classList.contains('hidden')) {
      fieldset1.classList.add('hidden')
      fieldset2.classList.remove('hidden')
      fieldset3.classList.remove('hidden')
    } else if (!fieldset2.classList.contains('hidden')) {
      fieldset2.classList.add('hidden')
      fieldset3.classList.remove('hidden')
      fieldset4.classList.remove('hidden')
    } else if (!fieldset3.classList.contains('hidden')) {
      fieldset3.classList.add('hidden')
      fieldset4.classList.remove('hidden')
      fieldset5.classList.remove('hidden')
    } else if (!fieldset4.classList.contains('hidden')) {
      fieldset4.classList.add('hidden')
      fieldset5.classList.remove('hidden')
      fieldset6.classList.remove('hidden')
    } else if (!fieldset5.classList.contains('hidden')) {
      fieldset5.classList.add('hidden')
      fieldset6.classList.remove('hidden')
      fieldset7.classList.remove('hidden')
    } else if (!fieldset6.classList.contains('hidden')) {
      fieldset6.classList.add('hidden')
      fieldset7.classList.remove('hidden')
      fieldset8.classList.remove('hidden')
    } else if (!fieldset7.classList.contains('hidden')) {
      fieldset7.classList.add('hidden')
      fieldset8.classList.remove('hidden')
      fieldset9.classList.remove('hidden')
    } else if (!fieldset8.classList.contains('hidden')) {
      fieldset8.classList.add('hidden')
      fieldset9.classList.remove('hidden')
      fieldset10.classList.remove('hidden')
      nextButton.classList.add('hideButton')
    }
  }

  if (type === 'words' && screenSize === 'small') {
    if (!fieldset1.classList.contains('hidden')) {
      fieldset1.classList.add('hidden')
      fieldset2.classList.remove('hidden')
      fieldset3.classList.remove('hidden')
    } else if (!fieldset2.classList.contains('hidden')) {
      fieldset2.classList.add('hidden')
      fieldset3.classList.remove('hidden')
      fieldset4.classList.remove('hidden')
    } else if (!fieldset3.classList.contains('hidden')) {
      fieldset3.classList.add('hidden')
      fieldset4.classList.remove('hidden')
      fieldset5.classList.remove('hidden')
      nextButton.classList.add('hideButton')
    }
  }
})

// get back button and bind click event handler
document.querySelector('.back').addEventListener('click', function () {
  nextButton.classList.remove('hideButton')
  var fieldset1 = document.querySelector('#fieldset1')
  var fieldset2 = document.querySelector('#fieldset2')
  var fieldset3 = document.querySelector('#fieldset3')
  var fieldset4 = document.querySelector('#fieldset4')
  var fieldset5 = document.querySelector('#fieldset5')
  var fieldset6 = document.querySelector('#fieldset6')
  var fieldset7 = document.querySelector('#fieldset7')
  var fieldset8 = document.querySelector('#fieldset8')
  var fieldset9 = document.querySelector('#fieldset9')
  var fieldset10 = document.querySelector('#fieldset10')

  if (type === 'letters') {
    if (!fieldset10.classList.contains('hidden')) {
      fieldset10.classList.add('hidden')
      fieldset9.classList.remove('hidden')
      fieldset8.classList.remove('hidden')
    } else if (!fieldset9.classList.contains('hidden')) {
      fieldset9.classList.add('hidden')
      fieldset8.classList.remove('hidden')
      fieldset7.classList.remove('hidden')
    } else if (!fieldset8.classList.contains('hidden')) {
      fieldset8.classList.add('hidden')
      fieldset7.classList.remove('hidden')
      fieldset6.classList.remove('hidden')
    } else if (!fieldset7.classList.contains('hidden')) {
      fieldset7.classList.add('hidden')
      fieldset6.classList.remove('hidden')
      fieldset5.classList.remove('hidden')
    } else if (!fieldset6.classList.contains('hidden')) {
      fieldset6.classList.add('hidden')
      fieldset5.classList.remove('hidden')
      fieldset4.classList.remove('hidden')
    } else if (!fieldset5.classList.contains('hidden')) {
      fieldset5.classList.add('hidden')
      fieldset4.classList.remove('hidden')
      fieldset3.classList.remove('hidden')
    } else if (!fieldset4.classList.contains('hidden')) {
      fieldset4.classList.add('hidden')
      fieldset3.classList.remove('hidden')
      fieldset2.classList.remove('hidden')
    } else if (!fieldset3.classList.contains('hidden')) {
      fieldset3.classList.add('hidden')
      fieldset2.classList.remove('hidden')
      fieldset1.classList.remove('hidden')
      backButton.classList.add('hideButton')
    }
  }

  if (type === 'words' && screenSize === 'small') {
    if (!fieldset5.classList.contains('hidden')) {
      fieldset5.classList.add('hidden')
      fieldset4.classList.remove('hidden')
      fieldset3.classList.remove('hidden')
    } else if (!fieldset4.classList.contains('hidden')) {
      fieldset4.classList.add('hidden')
      fieldset3.classList.remove('hidden')
      fieldset2.classList.remove('hidden')
    } else if (!fieldset3.classList.contains('hidden')) {
      fieldset3.classList.add('hidden')
      fieldset2.classList.remove('hidden')
      fieldset1.classList.remove('hidden')
      backButton.classList.add('hideButton')
    }
  }
})

// Open Modal
function openModal (content) {
  // modalHeading.innerText = 'Heading Placeholder'
  modalContent.innerText = content
  firstModalButton.innerText = 'Yes'
  secondModalButton.innerText = 'No'
  modal.style.display = 'block'
}

function openLastItemModal () {
  modalContent.innerText = 'Please tap the last item attempted'
  firstModalButton.innerText = 'Okay'
  secondModalButton.classList.add('hidden')
  firstModalButton.style.width = '100%'
  modal.style.display = 'block'
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
  }
}

function openPauseModal () {
  modalContent.innerText = 'Paused'
  firstModalButton.innerText = 'Restart'
  secondModalButton.innerText = 'End'
  modal.style.display = 'block'
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
    openDataWarningModal()
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
    endEarly()
  }
}

function openDataWarningModal () {
  modalContent.innerText = 'Are you sure you want to restart? All answers up to this point will be lost.'
  firstModalButton.innerText = 'Yes'
  secondModalButton.innerText = 'Cancel'
  modal.style.display = 'block'
  firstModalButton.onclick = function () {
    modal.style.display = 'none'
    window.location.reload()
  }
  secondModalButton.onclick = function () {
    modal.style.display = 'none'
  }
}

var modal = document.getElementById('modal') // Get the modal
// var modalHeading = document.getElementById('modalHeading') // Get the modal heading
var modalContent = document.getElementById('modalContent') // Get the modal content
var firstModalButton = document.getElementById('firstModalButton') // Get the first button
var secondModalButton = document.getElementById('secondModalButton') // Get the second button

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none'
  }
}
