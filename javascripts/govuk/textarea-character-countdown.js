// As the user is typing in a textbox or textarea, a label updates with the remaining number of allowed characters.
//
// Usage example (run this on document ready):
//
//    GOVUK.textareaCharacterCountdown.initialize($textarea, $statusArea, 1000);
//
// where
//    $textarea is the jQuery element into which the user types
//    $statusArea is the jQuery element which displays the remaining # of chars
//
// i18n:
//
// To customise or i18nalise the status message, override the "messageBeforeUserHasTypedAnything"
// and "messageAsUserIsTyping" variables with strings containing #max-num and #remaining-num placeholders.
// For example, for Russian i18n:
//
//    GOVUK.textareaCharacterCountdown.messageBeforeUserHasTypedAnything = "(ограничение - #max-num знаков)"
//    GOVUK.textareaCharacterCountdown.messageAsUserIsTyping = "Остается #remaining-num знаков (ограничение - #max-num знаков)";


(function () {
  "use strict"
  var root = this,
      $ = root.jQuery;
  if(typeof root.GOVUK === 'undefined') { root.GOVUK = {}; }

  var textareaCharacterCountdown = {
    initialize: function ($elementToMonitor, $remainingCharactersStatus, maximumCharacterNumber) {
      // initial setup
      textareaCharacterCountdown.update($remainingCharactersStatus, $elementToMonitor.text().length, maximumCharacterNumber);

      $elementToMonitor.on('input', function () {
        this.onkeydown = null;
        textareaCharacterCountdown.update($remainingCharactersStatus, this.value.length, maximumCharacterNumber);
      });

      $elementToMonitor.on('keydown', function () {
        textareaCharacterCountdown.update($remainingCharactersStatus, this.value.length, maximumCharacterNumber);
      });
    },
    update: function ($remainingCharactersStatus, typedCharacterNumber, maximumCharacterNumber) {
      var message;
      if (typedCharacterNumber === 0) {
          message = textareaCharacterCountdown.messageBeforeUserHasTypedAnything.replace("#max-num", maximumCharacterNumber);
      } else {
          var numberRemaining = maximumCharacterNumber - typedCharacterNumber;
          message = textareaCharacterCountdown.messageAsUserIsTyping.replace("#max-num", maximumCharacterNumber).replace("#remaining-num", numberRemaining);
      }
      $remainingCharactersStatus.html(message);
    },
    messageBeforeUserHasTypedAnything: "(Limit is #max-num characters)",
    messageAsUserIsTyping: "#remaining-num characters remaining (limit is #max-num characters)"
  };

  root.GOVUK.textareaCharacterCountdown = textareaCharacterCountdown;
}).call(this);
