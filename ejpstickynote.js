
////////////////////////////////////////////////////
// EjpStickyNote
// $Id: ejpstickynote.js,v 41.0 2014/10/07 22:29:30 plotkin Exp $


// Make sure prototype is installed
function checkPrototype() {
  if((typeof Prototype=='undefined') || 
     (typeof Element == 'undefined') || 
     (typeof Element.Methods=='undefined') ||
     parseFloat(Prototype.Version.split(".")[0] + "." +
                Prototype.Version.split(".")[1]) < 1.5)
    throw("EjpStickyNote requires the Prototype JavaScript framework >= 1.5.0");
}


checkPrototype();

////////////////////////
// Now the sticky note class

var StickyManager = {
  _notes: [],
  _activeNote: 0,
  _notesHidden: 0,
  _ms_rev_no: 0,
  _ms_id: 0,
  MOVEMODE: 1,
  RESIZEMODE: 2,
  

  MINWIDTH: 40,
  MINHEIGHT: 40,
  MAXWIDTH: 400,
  MAXHEIGHT: 400,
  _roleLabels: [],
  _securityOptions: 'staff-ed-ae-eic-se-me-rev-ebm', //TT 19325: added '-rev', '-ebm'

  _optionList: [],
  _optionLabels: [],

  //TT 17678: call prototype function to see if touch events are supported
  supportsTouch: isEventSupported('touchstart'),

  register: function(note) {
    if (this._notes.length == 0) {
      this.eventMouseUp = this.endDrag.bindAsEventListener(this);
      this.eventMouseMove = this.updateDrag.bindAsEventListener(this);
      
      if(StickyManager.supportsTouch) {
        //17678: observe touch events instead
        Event.observe(document, "touchend", this.eventMouseUp);
        Event.observe(document, "touchmove", this.eventMouseMove);
      } else {
        Event.observe(document, "mouseup", this.eventMouseUp);
        Event.observe(document, "mousemove", this.eventMouseMove);
      }
      //       Event.observe(document, "mouseup", this.eventMouseUp);
      //       Event.observe(document, "mousemove", this.eventMouseMove);
    }
    this._notes.push(note);
  },

  unregister: function(note) {
    this._notes = this._notes.reject(function(d) { return d==note});
    if (this._notes.length == 0) {
      if(StickyManager.supportsTouch) {
        //17678: observe touch events instead
        Event.stopObserving(document, "touchend", this.eventMouseUp);
        Event.stopObserving(document, "touchmove", this.eventMouseMove);
      } else {
        Event.stopObserving(document, "mouseup", this.eventMouseUp);
        Event.stopObserving(document, "mousemove", this.eventMouseMove);
      }
      //       Event.stopObserving(document, "mouseup", this.eventMouseUp);
      //       Event.stopObserving(document, "mousemove", this.eventMouseMove);
    }
  },

  // A note is starting a drag
  activate: function(note) {
    // return if we already have an active note
    if (this._activeNote) return;

    for (var x=0; x < this._notes.length; x++) {
      this._notes[x].sendToBack();
    }

    this._activeNote = note;
    note.bringToFront();
  },

  // Dragging ended
  endDrag: function(e) {
    if (!this._activeNote) return;

    this._activeNote.endDrag();
    this._activeNote = 0;
  },
  
  // Update the note position
  updateDrag: function(e) {
    if (!this._activeNote) return;

    var pointer = [Event.pointerX(e), Event.pointerY(e)];
    this._activeNote.updateDrag(e, pointer);
  },

  setColor: function(id, color) {
    for (var i=0; i < this._notes.length; i++) {
      if (this._notes[i]._id == id) {
        this._notes[i].setNoteColor(color);
        break;
      }

    }
    

  },

  // Configurable labels for roles in security pane
  setRoleLabels : function(labels) {
    this._roleLabels = labels;
  },

  //tt16856: Configurable labels for roles in security pane
  setMaxHeightWidth : function( height, width ) {
    this.MAXHEIGHT = height;
    this.MAXWIDTH = width;
  },

  getRoleLabels : function() {
    return this._roleLabels;
  },

  // Configurable list of security options
  setSecurityOptions : function(opts) {
    this._securityOptions = opts;
  },

  getSecurityOptions : function() {
    return this._securityOptions;
  },


  //TT 15733: Configurable list of options
  setOptionList : function(opts) {
    this._optionList = opts;
  },

  getOptionList : function() {
    return this._optionList;
  },

  //TT 15733: Configurable labels for options
  setOptionLabels : function(labels) {
    this._optionLabels = labels;
  },

  getOptionLabels : function() {
    return this._optionLabels;
  },


  toggleNotes: function() {
    if (this.notesHidden()) {
      this.setNotesHidden(false);
      this.setHiddenCookie(false);
      $('tb_note_toggle').src = bref + '/images/toggle_note_off.gif';
    }
    else {
      this.setNotesHidden(true);
      this.setHiddenCookie(true);
      $('tb_note_toggle').src = bref + '/images/toggle_note_on.gif';
    }

    var style = (this.notesHidden()) ? 'none' : 'block';

    for (var x=0; x < this._notes.length; x++) {
      this._notes[x].toggle(style);
    }
  },

  //
  // Turn the notes off
  // 
  toggleNotesOff: function() {
    for (var x=0; x < this._notes.length; x++) {
      this._notes[x].toggle('none');
    }

    this.setNotesHidden(true);
  },

  setHiddenCookie : function(hidden) {
    var cval = Cookies.get('hidden_stickies');
    
    if (cval == null) cval = '';

    ms = cval.split('|');
    newms = new Array();

    var y = 0;
    // Remove the current MS from the array
    // TT 18330: Cookie values cannot contain a comma, changed ',' to '~'
    for (var x = 0; x < ms.length; x++) {
      if (ms[x] != this._ms_id + '~' + this._ms_rev_no && ms[x] != '') {
        var what = ms[x];
        newms[y] = ms[x];
        y++;
      }
    }

    // Now add it back if it's hidden
    // TT 18330: Cookie values cannot contain a comma, changed ',' to '~'
    if (hidden) {
      newms[newms.length] = this._ms_id + '~' + this._ms_rev_no;
    }

    Cookies.set('hidden_stickies', newms.join('|'), 365);

  },

  setMsInfo: function(ms_id, ms_rev_no) {
    this._ms_id = ms_id;
    this._ms_rev_no = ms_rev_no;
  },

  notesHidden: function() {
    return this._notesHidden;
  },

  setNotesHidden: function(val) {
    this._notesHidden = val;
  }

};

var EjpStickyNote = Class.create({
  _zindex: 1000,
  _headerDiv: 0,
  _resizeDiv: 0,
  _closeDiv: 0,
  _toolboxDiv: 0,
  _workingDiv: 0,
  _lastPointer: 0,
  _colorPicker: 0,
  _editing: -1,
  _editable: 0,
  _divId: 0,
  _beenSaved: 0,

  _mode: StickyManager.MOVEMODE,

  _workingImage: 'indicator_tiny_red.gif',

  //
  //Constructor
  //
  initialize: function(id, x, y, width, height, color, security, options, editable, title, text) {
    
    //if height/width too small, default to 250 x 400
    //TTS 17555 - moved to individual create functions
    /*if ( height < 400 ) {
      height = 400;
    }
    if ( width < 250 ) {
      width = 250;
    } */  
    
    text = text.replace(/#CR#/g, "\n");
    this._id = id;
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._text = Url.decode(text);
    this._title = Url.decode(title);
    this._color = color;
    this._old_color = this._color;

    if ( id.match(/^ms/) ) {
      this._type = "ms";
    }else if ( id.match(/^rpt/) ) {
      this._type = "rpt";
    }else {
      this._type = "personal";
    }

    this._security = security;
    this._options = options;
    this._editable = editable;

    this.eventMouseDown = this.initDrag.bindAsEventListener(this);

    if(StickyManager.supportsTouch) {
      //17678: observe touch events instead
      Event.observe(document, "touchstart", this.eventMouseDown);
    } else {
      Event.observe(document, "mousedown", this.eventMouseDown);
    }
    //     Event.observe(document, "mousedown", this.eventMouseDown);

    this.verifyPosition();

    this.createStickyNote();

  },

  //
  // Destroy the note
  //
  destroy: function() {
    if(StickyManager.supportsTouch) {
        //17678: stop observing touch events instead
        Event.stopObserving(document, "touchstart", this.eventMouseDown);
    } else {
      Event.stopObserving(document, "mousedown", this.eventMouseDown);
    }
    //      Event.stopObserving(document, "mousedown", this.eventMouseDown);

    StickyManager.unregister(this);

    this._note.style.display = "none";

    //TTS 17801
    if (this._fromNotesTable) {
      //need to remove element from DOM
      var noteDiv = document.getElementById(this._note.id);
      noteDiv.parentNode.removeChild(noteDiv);
    }
  },

  //
  // Toggle the note
  //
  toggle : function(which) {
    if (which == null) {
      if (this._note.style.display == "none") {
        this._note.style.display = "block";
      }
      else {
        this._note.style.display = "none";
      }
    }
    else {
      this._note.style.display = which;
    }

  },


  //
  // make the HTML bits of the note and insert them into the DOM
  //
  createStickyNote: function() {
    var body = document.getElementsByTagName('body')[0];

    this._colorPicker = new ColorPicker(this);

    if (this._type == "ms" && this._editable) {
      this._securityPicker = new SecurityPicker(this);
    }

    //TT 15733: options for rpt stickynotes
    if (this._type == "rpt" && this._editable ) {
      this._optionsPicker = new OptionsPicker(this);
    }

    var header = document.createElement('div');
    header.className = "header stickytitle";
    this._headerDiv = header;

    var text = document.createElement('div');
    text.className = "text stickytext";

    //tt16856: give textarea an id to allow for dynamic resizing
    text.id = "textareastickynote"+ this._id
    
    this._textDiv = text;
    
    var resize = document.createElement('div');
    resize.className = "resizeblock";
    resize.id = "resizeblock"+this._id; //tt16856: give resize image an id to allow us to hide it in edit mode
    if (BrowserDetect.identity == "Explorer" && BrowserDetect.version < 7) {
      // Fix for IE shifting this image one px left
      resize.style.right = "-1px";
    }
    resize.innerHTML = '<img src="' + bref + '/images/sticky_resize.gif" width="14" height="14" alt="R" border="0" />';
    resize.style.zIndex = this._zindex+1;
    this._resizeDiv = resize;

    var closer = document.createElement('div');
    closer.className = "close";
    //    closer.innerHTML = '<img src="' + bref + '/images/sticky_close.gif" width="14" height="14" alt="X" />';
    closer.innerHTML = '<img src="' + bref + '/images/tb_close.gif" width="9" height="9" alt="X" />';

    closer.style.zIndex = this._zindex+1;
    this._closeDiv = closer;

    var toolbox = document.createElement('div');
    toolbox.className = "linkbox";
    this._toolboxDiv = toolbox;

    var working = document.createElement('div');
    working.className = "working";
    working.innerHTML = '<img src="' + bref + '/images/' + this._workingImage + '" width="10" height="10" border="0" alt="Working" />';
    this._workingDiv = working;

    this._note = document.createElement('div');
    this._note.className = "stickynote";
    
    this._note.id = "stickynote" + this._id;
    this._note.style.left = this._x +'px';
    this._note.style.top = this._y + 'px';
    this._note.style.height = this._height + 'px';
    this._note.style.width = this._width + 'px';
    this._note.style.zIndex = this._zindex;
    this._note.style.backgroundColor = this._color;

    this._note.appendChild(header);
    this._note.appendChild(closer);
    this._note.appendChild(text);
    this._note.appendChild(resize);
    this._note.appendChild(toolbox);
    this._note.appendChild(working);

    this.setNoteText(this._title, this._text);
    
    body.appendChild(this._note);
    
    StickyManager.register(this);
    this.setStatic();
      
    //tt16856: make sure note text fits within note div
    var newTextHeight = this._note.clientHeight - 42;
    this._textDiv.style.height = newTextHeight + "px";
    
  },

      
  verifyPosition: function() {
      //var winsize = Position.GetWindowSize();
      var winsize = document.viewport.getDimensions();

    if (this._x > winsize.width) {
      this._x = winsize.width - this._width - 60;
    }

    if (this._y < 0) {
      this._y = 60;
    }
  },

  initDrag: function(e) {

    //TT 17678: check for touch event as well
    //if (Event.isLeftClick(e)) {
    if (Event.isLeftClick(e) || e.touches) {
      
      // abort on form elements, fixes a Firefox issue
      var src = Event.element(e);
      if((tag_name = src.tagName.toUpperCase()) && (
                                                    tag_name=='INPUT' ||
                                                    tag_name=='SELECT' ||
                                                    tag_name=='OPTION' ||
                                                    tag_name=='BUTTON' ||
                                                    tag_name=='TEXTAREA')) return;

      // if you click the closer, close!
      if (Position.within(this._closeDiv, Event.pointerX(e), Event.pointerY(e))) {
        if (this._type == 'personal' || (this._type == "ms" && this._editable) || (this._type == "rpt" && this._editable)) {
          if (confirm("Closing this note will delete it.  Are you sure you want to do this?")) {
            var params = $H( {noteid: this._id, form_type: 'delete_sticky_note'} );
            new Ajax.Request(bref + '/cgi-bin/main.plex', { method: 'post', parameters: params.toQueryString() });
            this.destroy();
          }
        }
        else {
          this.destroy();
        }

        Event.stop(e);
        return;
      }

      // If it's in the header, drag the note
      if (Position.within(this._headerDiv, Event.pointerX(e), Event.pointerY(e))) {
        this._mode = StickyManager.MOVEMODE;
        StickyManager.activate(this);
        Event.stop(e);
      }
      
      // If it's in the resizer, resize
      if (Position.within(this._resizeDiv, Event.pointerX(e), Event.pointerY(e))) {
        this._mode = StickyManager.RESIZEMODE;
        StickyManager.activate(this);
        Event.stop(e);
      }
     
      //Event.stop(e);
    }
  },

  //
  // Draggin finished
  //
  endDrag: function() {
    this._lastPointer = 0;

    // this is going to change
    var params = $H( { noteid: this._id,
                         x: this._note.style.left,
                         y: this._note.style.top,
                         width: this._note.style.width,
                         height: this._note.style.height,
                         form_type: 'update_sticky_note_location'
                         } );

    this.setWorking();
    new Ajax.Request(bref + "/cgi-bin/main.plex", { method: 'post', parameters: params.toQueryString(), onComplete: this.finishedWorking.bindAsEventListener(this) });

  },

  //
  // Update the notes position when being dragged
  //
  updateDrag: function(e, pointer) {
    if (!this._lastPointer) {
      this._lastPointer = pointer;
      return;
    }

    if (this._editing) return;

    var pos = Position.cumulativeOffset(this._note);
    
    if (this._mode == StickyManager.MOVEMODE) {

      var xdiff = this._lastPointer[0] - pointer[0];
      var ydiff = this._lastPointer[1] - pointer[1];

      this._x = pos[0] - xdiff;
      this._y = pos[1] - ydiff;

      if (this._y < 0) this._y = 0;
      if (this._x < 0) this._x = 0;
      
      this._note.style.left = this._x + 'px';
      this._note.style.top = this._y + 'px';
      Event.stop(e);
    }
    else if (this._mode == StickyManager.RESIZEMODE) {

      var newWidth = pointer[0] - pos[0];
      var newHeight = pointer[1] - pos[1];

      if (newWidth < StickyManager.MINWIDTH) {
        newWidth = StickyManager.MINWIDTH;
      }

      if (newWidth > StickyManager.MAXWIDTH) {
        newWidth = StickyManager.MAXWIDTH;
      }

      if (newHeight < StickyManager.MINHEIGHT) {
        newHeight = StickyManager.MINHEIGHT;
      }

      if (newHeight > StickyManager.MAXHEIGHT) {
        newHeight = StickyManager.MAXHEIGHT;
      }

      this._note.style.width = newWidth + 'px';
      this._note.style.height = newHeight + 'px';
      Event.stop(e);

    }
    
    //tt16856: if resizing, make sure note div also gets resized
    if ( $('textarea'+this._note.id ) ) {
      //42 is rougly the height of the title + the bottom 'Edit' link
      var newTextHeight = this._note.clientHeight - 42;
      $('textarea'+this._note.id ).style.height = newTextHeight + "px";
    }

    this._lastPointer = pointer;
    //Event.stop(e);
  },


  //
  // send the note backwards
  //
  sendToBack: function() {
    this._note.style.zIndex = this._zindex;
    this._resizeDiv.style.zIndex = this._zindex+1;
    this._closeDiv.style.zIndex = this._zindex+1;
  },


  //
  // bring this note into the foreground
  //
  bringToFront: function() {
    this._note.style.zIndex = this._zindex+100;
    this._resizeDiv.style.zIndex = this._zindex+1+100;
    this._closeDiv.style.zIndex = this._zindex+1+100;
  },


  //
  // Set to "non edit" mode
  //
  setStatic: function() {
    if (this._editing == 0) return;
    this._editing = 0;

    // sanity check
    if ((this._type == "ms" && this._editable) || this._type == "personal" || (this._type == "rpt" && this._editable)) {
      this._toolboxDiv.innerHTML = '[<a href="javascript:void(0)" id="noteedit' + this._id + '">Edit</a>]'; 

      if (!this.eventSetEdit) this.eventSetEdit = this.setEdit.bindAsEventListener(this);
      Event.observe('noteedit' + this._id, 'click', this.eventSetEdit);
    }

    //tt17842 - adjust textarea to fit within the boundary
    var newTextHeight = this._note.clientHeight - 42;
    this._textDiv.style.height = newTextHeight + "px";
    
    // IE Doesn't link this
    //this._resizeDiv.show();    
    //tt16856: try to hide resize image again
    if ( $('resizeblock'+this._id) ) {
      $('resizeblock'+this._id).style.display = "";
    }

  },


  //
  // Set the color
  //
  setNoteColor: function(newcolor) {
     // sanity check
    if (this._type == "ms" && !this._editable) {
      return;
    }
    if (this._type == "rpt" && !this._editable) {
      return;
    }

    this._color = newcolor;
    this._note.style.backgroundColor = newcolor;

    if ( $('text' + this._id) &&  $('title' + this._id)) {
      $('text' + this._id).style.backgroundColor = this._note.style.backgroundColor;
      $('title' + this._id).style.backgroundColor = this._note.style.backgroundColor;
    }

    var params = $H( { noteid: this._id,
                         color: newcolor,
                         form_type: 'update_sticky_note_color'
                         } );

    if (this._type == "ms" && StickyManager.getSecurityOptions().match(/rev/)) {
      //TT 19325
      params.set('ms_id', StickyManager._ms_id);    
      params.set('ms_rev_no', StickyManager._ms_rev_no);
    }

    this.setWorking();

    new Ajax.Request(bref + "/cgi-bin/main.plex", { method: 'post', parameters: params.toQueryString(), onComplete: this.finishedWorking.bindAsEventListener(this) });


  },


  //
  // Set into "edit" mode
  //
  setEdit: function() {
    // sanity check
    if (this._type == "ms" && !this._editable) {
      return;
    }
    if (this._type == "rpt" && !this._editable) {
      return;
    }
    
    if (this._editing == 1) return;
    this._editing = 1;

    // Save this if they hit edit
    this._oldColor = this._color;

    if (this.eventSetEdit) {
      Event.stopObserving('noteedit' + this._id, 'click', this.eventSetEdit);
    }

    if (this.eventSetColor) {
      Event.stopObserving('colorpick' + this._id, 'click', this.eventColorPick);
    }

    // IE doesn't like this, that's silly
    //this._resizeDiv.hide();
    //tt16856: try to hide resize image again
    if ( $('resizeblock'+this._id) ) {
      $('resizeblock'+this._id).style.display = "none";
    }


    this._tempWidth = this._note.style.width;
    this._tempHeight = this._note.style.height;
    
    //tt16856: commented this out to allow for default height/width settings
    // if (this._type == "ms" ) {
      // this._note.style.height = '400px';
    // }else if ( this._type == "rpt" ) {
      // this._note.style.height = '330px';
    // }else {
      // this._note.style.height = '280px';
    // }
    // this._note.style.width = '250px';
    
    var userAgentString = navigator.userAgent.toLowerCase();
    var isIE = 0;
    if ( userAgentString.include( 'msie' ) ) {
      isIE = 1;
    }
    
    //tt17842 - set minimums so edited note is not too small
    if ( this._note.clientWidth < 250 ) {
      this._note.style.width = '250px';
      if ( !isIE ) {
        this._note.clientWidth = 250;
      }
    } 
    if ( this._note.clientHeight < 400 ) {
      this._note.style.height = '400px';
      if ( !isIE ) {
        this._note.clientHeight = 400;
      }
    }

    //tt17842 - adjust textarea to fit well within the boundary
    var newTextHeight = this._note.clientHeight - 42;
    this._textDiv.style.height = newTextHeight + "px";
    
    this._headerDiv.innerHTML = '<input type="text" id="title' + this._id + '" value="' + this._headerDiv.innerHTML + '" size="25" />';

    var txt = this._textDiv.innerHTML;

    txt = txt.replace(/<br(\s\/)?>/ig, '\n');

    //remove opened by/edited by text
    if ( this._type == "rpt" ) {
      txt = txt.replace(/\n?\[Opened by .*? on \d\d\d\d\-\d\d\-\d\d \d\d:\d\d:\d\d\]?/, '');
      txt = txt.replace(/\n?\[?Last Edited by .*? on \d\d\d\d\-\d\d\-\d\d \d\d:\d\d:\d\d\]$/, '');
    }else {
      txt = txt.replace(/\n?\[(?:Opened|Last Edited) by .*? on \d\d\d\d\-\d\d\-\d\d \d\d:\d\d:\d\d\]$/, '');
    }

    //tt16856: modified style height/width settings to allow for better usage of note area when editing
    this._textDiv.innerHTML = '<textarea id="text' + this._id + '" rows="12" cols="25" style="height:60%; width:97%; overflow=auto;" >' + txt +'</textarea>' + this._colorPicker.getColorPickerDiv().innerHTML;

    if (this._type == "ms" && this._security != 'NOTETIDABLE') {
      this._textDiv.innerHTML += this._securityPicker.getSecurityPickerDiv().innerHTML;
      this._securityPicker.setSecurity(this._security);
    }

    //TT 15733: options for rpt stickynotes
    if ( this._type == "rpt" ) {
      this._textDiv.innerHTML += this._optionsPicker.getOptionsPickerDiv().innerHTML;
      this._optionsPicker.setOptions(this._options);
    }

    this._toolboxDiv.innerHTML = '[<a href="javascript:void(0)" id="save' + this._id + '">Save</a>] [<a href="javascript:void(0)" id="cancel' + this._id +'">Cancel</a>]';

    //tt16856: set dynamic height for note textare div, 48 is roughly the title and Save/Cancel link height
    var editHeight;
    if ( $('colorpicker'+this._id) && $('securitypicker'+this._id) ) {
      editHeight = this._note.clientHeight - 48 - $('colorpicker'+this._id).clientHeight - $('securitypicker'+this._id).clientHeight;
      if ( editHeight > 0 ) {
        editHeight = editHeight + "px";
        document.getElementById('text'+this._id).style.height = editHeight;
      }
    } 

    $('text' + this._id).style.backgroundColor = this._note.style.backgroundColor;
    $('title' + this._id).style.backgroundColor = this._note.style.backgroundColor;

    this.eventSaveEdit = this.saveEdit.bindAsEventListener(this);
    this.eventCancelEdit = this.cancelEdit.bindAsEventListener(this);

    Event.observe('save' + this._id, 'click', this.eventSaveEdit);
    Event.observe('cancel' + this._id, 'click', this.eventCancelEdit);

    $('title' + this._id).focus();

  },


  //
  // Cancel an edit
  //
  cancelEdit: function() {
    Event.stopObserving('save' + this._id, 'click', this.eventSaveEdit);
    Event.stopObserving('cancel' + this._id, 'click', this.eventCancelEdit);

    // If you hit cancel on a new note, destroy it
    if (this._title == "Title" && this._text == "Note text") {
      var params = $H( {noteid: this._id, form_type: 'delete_sticky_note'} );
      new Ajax.Request(bref + '/cgi-bin/main.plex', { method: 'post', parameters: params.toQueryString() });
      this.destroy();
      return;
    }
    
    //TTS 17801
    if (this._fromNotesTable) {
      //close and remove note
      this.destroy();
      return;
    }

    this.setNoteText(this._title, this._text);

    this._note.style.width = this._tempWidth;
    this._note.style.height = this._tempHeight;


    
    if (this._oldColor) this.setNoteColor(this._oldColor);

    this.setStatic();
  },

  //
  // Save the edit back to the server
  //
  saveEdit: function() {
    // sanity check
    if (this._type == "ms" && !this._editable) {
      return;
    }
    if (this._type == "rpt" && !this._editable) {
      return;
    }

    if (this._type == "ms") {
      this.setNoteSecurity(this._securityPicker.getSecurity());
    }
    
    //TT 15733: options for stickynotes (added for rpt based notes)
    if (this._type == "rpt") {
        this.setNoteOptions(this._optionsPicker.getOptions());
    }
  
    this.setNoteText($('title' + this._id).value, $('text' + this._id).value);

    var params = $H( { noteid: this._id,
                         form_type: 'update_sticky_note_text',
                         note_text: Url.encode(this._text),
                         note_title: Url.encode(this._title),
                         security: this._security,
			 options: this._options
                         } );

    //TTS 17801
    if (this._fromNotesTable != undefined) {
      params.set('from_notes_table', this._fromNotesTable);    
      params.set('ms_id', this._msId);    
      params.set('ms_rev_no', this._msRevNo);    
    } else if (this._type == "ms" && StickyManager.getSecurityOptions().match(/rev/)) {
      //TT 19325
      params.set('ms_id', StickyManager._ms_id);    
      params.set('ms_rev_no', StickyManager._ms_rev_no);
    }

    this.setWorking();

    //    new Ajax.Request(bref + "/cgi-bin/main.plex", { method: 'post', parameters: params.toQueryString(), onComplete: this.finishedWorking.bindAsEventListener(this) });
    new Ajax.Request(bref + "/cgi-bin/main.plex", { method: 'post', parameters: params.toQueryString(), onSuccess: this.doneSave.bindAsEventListener(this), onFailure: this.failedSave.bindAsEventListener(this) });

  },

  doneSave : function(t) {
    var notesTableDiv; //TTS 17801

    if (t.status != 200) {
      this.failedSave();
      return;
    }
    
    this.finishedWorking();

    Event.stopObserving('save' + this._id, 'click', this.eventSaveEdit);
    Event.stopObserving('cancel' + this._id, 'click', this.eventCancelEdit);
    
    //TTS 17801 
    if (this._fromNotesTable) {
      this.destroy();
      //re-generate table with ms sticky notes - make sure the div is declared in the DOM surrounding the table
      notesTableDiv  = document.getElementById('notes_table_'+this._msId+'_'+this._msRevNo);
      notesTableDiv.innerHTML = t.responseText;
      return;
    }

    this._note.style.width = this._tempWidth;
    this._note.style.height = this._tempHeight;

    
    this.setStatic();


  },

  failedSave : function() {
    this.finishedWorking();
    alert('Sticky note failed to save.  Please try again.');
  },

  setSaved: function() {
    this._beenSaved = 1;
  },


  //
  // Set the text in the note
  //
  setNoteText: function(header, text) {
    this._title = header;
    this._text = text;

    this._headerDiv.innerHTML = this._title;
    this._textDiv.innerHTML = this._text.replace(/\n/g, '<br />');
  },

  //
  // Set the security on the note
  //
  setNoteSecurity: function(sec) {
    // sanity check
    if (this._type == "ms" && !this._editable) {
      return;
    }

    this._security = sec;
    /*
      TTS 11447
      Moved this into saveEdit because if this update happens second, it'll overwrite the note's text
    var params = $H( { noteid: this._id,
                         form_type: 'update_sticky_note_security',
                         security: this._security
                         } );
    
    this.setWorking();
    new Ajax.Request(bref + "/cgi-bin/main.plex", { method: 'post', parameters: params.toQueryString(), onComplete: this.finishedWorking.bindAsEventListener(this) });
    */
  },

  //
  // Set the options on the note
  //
  setNoteOptions: function(opt) {
    this._options = opt;
  },

  setWorking: function() {
    this._workingDiv.style.display="block";
  },

  finishedWorking: function() {
    this._workingDiv.style.display="none";
  },

  //TTS 17801
  setFromNotesTable: function (msId, msRevNo) { 
    this._fromNotesTable = 1;
    this._msId = msId;
    this._msRevNo = msRevNo;
  },
  
  
  });


var SecurityPicker = Class.create({
  _note: 0,
  _created: 0,
  _pickerDiv: 0,

  //
  // Constructor
  //
  initialize: function(note) {
    this._note = note;
    this.create();
  },


  //
  // Create the picker html
  //
  create: function() {
    var body = document.getElementsByTagName('body')[0];

    this._checks = new Array('spstaff', 'speditor', 'spae', 'speic', 'spse', 'spme', 'sprev', 'spebm'); //TT 19325: added 'sprev', 'spebm'
    
    var pdiv = document.createElement('div');
    var holderdiv = document.createElement('div');
    pdiv.id="securitypicker" + this._note._id;
    pdiv.className = "securitypicker";
    
    var html = "<br /><strong>Visible To:</strong><br />";

    var rolelabels = StickyManager.getRoleLabels();

    if (rolelabels['Staff'] == undefined || rolelabels['Staff'] == '') {
      rolelabels['Staff'] = 'Staff';
      rolelabels['EIC'] = 'EIC';
      rolelabels['Editor'] = 'Editor';
      rolelabels['AE'] = 'AE';
      rolelabels['SE'] = 'SE';
      rolelabels['ME'] = 'ME';
      rolelabels['Reviewer'] = 'Reviewer'; //TT 19325
      rolelabels['EBM'] = 'EBM'; //TT 19325
    }

    var opts = StickyManager.getSecurityOptions();

    if (opts.match(/staff/)) {
      html += '<input type="checkbox" id="spstaff' + this._note._id + '" name="spstaff' + this._note._id + '" value="staff" />' + rolelabels['Staff'] + '<br />';
    }
    if (opts.match(/eic/)) {
      html += '<input type="checkbox" id="speic' + this._note._id + '" name="speic' + this._note._id + '" value="eic" />' + rolelabels['EIC'] + '<br />';
    }
    if (opts.match(/se/)) {
      html += '<input type="checkbox" id="spse' + this._note._id + '" name="spse' + this._note._id + '" value="se" />' + rolelabels['SE'] + '<br />';
    }
    if (opts.match(/ed/)) {
      html += '<input type="checkbox" id="speditor' + this._note._id + '" name="speditor' + this._note._id + '" value="editor" />' + rolelabels['Editor'] + '<br />';
    }
    if (opts.match(/ae/)) {
      html += '<input type="checkbox" id="spae' + this._note._id + '" name="spae' + this._note._id + '" value="ae" />' + rolelabels['AE'] +'<br />';
    }
    if (opts.match(/me/)) {
      html += '<input type="checkbox" id="spme' + this._note._id + '" name="spme' + this._note._id + '" value="me" />' + rolelabels['ME'] +'<br />';
    }
    if (opts.match(/rev/)) {
      //TT 19325
      html += '<input type="checkbox" id="sprev' + this._note._id + '" name="sprev' + this._note._id + '" value="rev" />' + rolelabels['Reviewer'] +'<br />';
    }
    if (opts.match(/ebm/)) {
      //TT 19325
      html += '<input type="checkbox" id="spebm' + this._note._id + '" name="spebm' + this._note._id + '" value="ebm" />' + rolelabels['EBM'] +'<br />';
    }
    //html += '<a href="javascript:void(0)" onclick="SecurityPicker.done();">Done</a>';

    pdiv.innerHTML = html;
    
    holderdiv.appendChild(pdiv);

    this._pickerDiv = holderdiv;
    this._created = 1;
  },

  getSecurityPickerDiv: function() {
    return this._pickerDiv;
  },


  //
  // Build the security string
  //
  getSecurity: function() {
    var ret = new Array();

    //var els = this._pickerDiv.firstChild.getElementsByTagName('INPUT');
    //alert(els.length);

    for (var i=0; i < this._checks.length; i++) {
      var el = this._checks[i] + this._note._id;
      
      if ($(el) && $(el).checked) {
        ret.push(this._checks[i].replace(/sp/, ""));
      }
    }

    
    return ret.join('-');
    
  },

  //
  // Set check boxes based on security string
  //
  setSecurity: function(sec) {
    if (!this._created) this.create();


    var sets = sec.split('-');
    
    for (var i=0; i < this._checks.length; i++) {
      var el = $(this._checks[i] + this._note._id);
      if ($(el)) {
        el.checked = false;
      }
    }
    
    if (sets && sets.length > 0) {
      for (var j=0; j < sets.length; j++) {
        var type = sets[j];
        if (type == 'ed') type = 'editor'; // hack
        var el = $('sp' + type + this._note._id);
        if (el) {
          el.checked = true;
        }
      }
    }

  },

  setColor: function(color) {
    //this._pickerDiv.style.backgroundColor = color;
  }
  

  });


var OptionsPicker = Class.create({
  _note: 0,
  _created: 0,
  _pickerDiv: 0,

  //
  // Constructor
  //
  initialize: function(note) {
    this._note = note;
    this.create();
  },


  //
  // Create the picker html
  //
  create: function() {
    var body = document.getElementsByTagName('body')[0];

    var optdiv = document.createElement('div');
    optdiv.id="optionspicker" + this._note._id;
    optdiv.className = "securitypicker";

    var html = "<p>\n";

    var optionLabels = StickyManager.getOptionLabels();

    var optionList = StickyManager.getOptionList();
    var cnt, optId;

    for ( cnt=0; cnt<optionList.length; cnt++) {
      optId = optionList[cnt] + this._note._id;

      html += '<input type="checkbox" id="'+optId+'" value="'+optionList[cnt]+'" />' + optionLabels[optionList[cnt]] + '<br />\n';
    }

    optdiv.innerHTML = html;
    
    var holderdiv = document.createElement('div');
    holderdiv.appendChild(optdiv);

    this._pickerDiv = holderdiv;
    this._created = 1;
  },

  getOptionsPickerDiv: function() {
    return this._pickerDiv;
  },


  //
  // Build the options string
  //
  getOptions: function() {
    var selectedOptions = new Array();

    var optionList = StickyManager.getOptionList();
    var cnt, elemId;

    for ( cnt=0; cnt<optionList.length; cnt++) {
      elemId = optionList[cnt] + this._note._id;
      
      if ( $(elemId) && $(elemId).checked ) {
        selectedOptions.push(optionList[cnt]);
      }
    }
    
    return selectedOptions.join('-');
    
  },

  //
  // Set check boxes based on options string
  //
  setOptions: function(opts) {
    if (!this._created) this.create();

    var optionList = StickyManager.getOptionList();
    var selectedOptions = opts.split('-');
    var cnt, elemId;
    
    for ( cnt=0; cnt<optionList.length; cnt++ ) {
      elemId = optionList[cnt] + this._note._id;
      if ( $(elemId) ) {
        $(elemId).checked = false;
      }
    }
    
    if ( selectedOptions.length > 0 ) {
      for ( cnt=0; cnt<selectedOptions.length; cnt++ ) {
        elemId = selectedOptions[cnt] + this._note._id;
        if ( $(elemId) ) {
          $(elemId).checked = true;
        }
      }
    }

  },

  setColor: function(color) {
    //this._pickerDiv.style.backgroundColor = color;
  }
  

  });



var ColorPicker = Class.create({
  _note: 0,
  _created: 0,
  _pickerDiv: 0,

  initialize: function(note) {
    this._note = note;
    this.create();
  },

  //
  // Create the color picker
  //
  create: function() {
    if (this._created) return;

    //this._colors = new Array("#FFFFFF", "#FFCCCC", "#FFCC99", "#FFFF99", "#FFFFCC", "#99FF99", "#99FFFF", "#CCFFFF", "#CCCCFF", "#FFCCFF", "#CCCCCC", "#FF6666", "#FF9966", "#FFFF66", "#FFFF33", "#66FF99", "#33FFFF", "#66FFFF", "#9999FF", "#FF99FF", "#C0C0C0", "#FF0000", "#FF9900", "#FFCC66", "#FFFF00", "#33FF33", "#66CCCC", "#33CCFF", "#6666CC", "#CC66CC", "#999999", "#CC0000", "#FF6600", "#FFCC33", "#FFCC00", "#33CC00", "#00CCCC", "#3366FF", "#6633FF", "#CC33CC", "#666666", "#990000", "#CC6600", "#CC9933", "#999900", "#009900", "#339999", "#3333FF", "#6600CC", "#993399", "#333333", "#660000", "#993300", "#996633", "#666600", "#006600", "#336666", "#000099", "#333399", "#663366", "#000000", "#330000", "#663300", "#663333", "#333300", "#003300", "#003333", "#000066", "#330099", "#330033");
    
    this._colors = new Array("#FFFFFF", "#CCCCCC", "#FFFF33", "#FF9900", "#FF0000", "#00CCCC",  "#33CC00",  "#99FF99",  "#FFCCFF",   "#9999FF");

        var holderdiv = document.createElement('div');
    
    var pdiv = document.createElement('div');
    pdiv.id="colorpicker" + this._note._id;
    pdiv.className = "colorpicker";

    var html = '<table>';
    for (var i=0; i < this._colors.length; i++) {
      if (i%10 == 0) html += "<tr>";
      html +='<td style="background-color:' + this._colors[i] + '" onclick="StickyManager.setColor(\'' + this._note._id + '\', \'' + this._colors[i] + '\');">&nbsp;</td>';
      if ((i+1)%10 == 0) html += "</tr>";
    }

    html += '</table>';

    pdiv.innerHTML = html;
    holderdiv.appendChild(pdiv);

    this._pickerDiv = holderdiv;

    this._created = 1;
  },

  getColorPickerDiv: function() {
    if (!this._created) return;


    return this._pickerDiv;
  },


  select: function(color) {
    this._note.setNoteColor(color);
  }

  });



function tb_create_personal_sticky() {

  var params = $H( { 
    form_type: 'create_personal_sticky_note'
        } );
  
  new Ajax.Request(bref + "/cgi-bin/main.plex", { method: 'post', parameters: params.toQueryString(), 
                       onSuccess:tb_do_create_personal_sticky, 
                       onFail: function() { alert("Failed to create a sticky note"); } });
}

function tb_do_create_personal_sticky(r) {
  var txt = r.responseText;
  // note id, x, y, width, height, color, security
  var note = txt.split('|', 7);
  
  //TT17765 - no longer override at this point, passed in value is determined by a flag, should stay as-is
  // if ( note[4] < 400 ) {
    // note[4] = 400;
  // }
  // if ( note[3] < 250 ) {
    // note[3] = 250;
  // }

  var mynote = new EjpStickyNote(note[0], note[1], note[2], note[3], note[4], note[5], note[6], "", 1, "Title", "Note text");

  mynote.setEdit();
}



function tb_do_create_ms_sticky(r) {
  var txt = r.responseText;
  // note id, x, y, width, height, color, security
  var note = txt.split('|', 8);

  // TTS 17801
  var fromMsNotesTable;

  //TT17765 - no longer override at this point, passed in value is determined by a flag, should stay as-is
  // if ( note[4] < 400 ) {
    // note[4] = 400;
  // }
  // if ( note[3] < 250 ) {
    // note[3] = 250;
  // }

  var mynote = new EjpStickyNote(note[0], note[1], note[2], note[3], note[4], note[5], note[6], "", 1, "Title", "Note text");

  // TTS 17801  
  if (note[7] != undefined) {
    var fromMsNotesTable = note[7].split('-', 3); 

    if (fromMsNotesTable != undefined) {
      //set the private flag var
      mynote.setFromNotesTable(fromMsNotesTable[0], fromMsNotesTable[1]);    
    }
  }

  mynote.setEdit();
}

function tb_create_ms_sticky(ms_id, ms_rev_no, j_id, from_notes_table, ms_id_key) {

  if (from_notes_table == undefined) from_notes_table = 0;

  var params = $H( { 
    form_type: 'create_ms_sticky_note',
        ms_id: ms_id,
        ms_rev_no: ms_rev_no,
        j_id: j_id,
        ms_id_key: ms_id_key
        } );

  //TTS 17801
  var tempCoor;
  var tempX;
  var randXOffset;

  //TTS 17801
  if (from_notes_table == 1){
    //grab xy coordinates for decision letter table - add/edit notes should display at this height
    tempCoor = calculateXY('table_'+ms_id+'_'+ ms_rev_no);
    randXOffset = Math.floor((Math.random()*50)+1); 
    tempX = randXOffset + (screen.width/2);

    params.set('tempX', tempX);
    params.set('tempY', tempCoor[1]);
    params.set('from_notes_table', from_notes_table);
  }

  new Ajax.Request(bref + "/cgi-bin/main.plex", { method: 'post', parameters: params.toQueryString(), 
                       onSuccess:tb_do_create_ms_sticky, 
                       onFail: function() { alert("Failed to create a sticky note"); } });
}

//TTS 19547
function tb_create_ms_sticky_take_task(ms_id, ms_rev_no, j_id, ms_id_key) {
  var params = $H( { 
    form_type: 'create_ms_sticky_take_task_note',
        ms_id: ms_id,
        ms_rev_no: ms_rev_no,
        j_id: j_id,
        ms_id_key: ms_id_key
        } );

  new Ajax.Request(bref + "/cgi-bin/main.plex", { method: 'post', parameters: params.toQueryString(), 
                       onSuccess:tb_do_create_ms_sticky_take_task, 
                       onFail: function() { alert("Failed to create a sticky note"); } });
}


function tb_do_create_ms_sticky_take_task(r) {
  var txt = r.responseText;
  // id, x, y, width, height, color, security, options, editable, title, text, is_take_task
  var note = txt.split('|');
  var mynote = new EjpStickyNote(note[0], note[1], note[2], note[3], note[4], note[5], note[6], note[7], note[8], note[9], note[10]);
}


//TT15733: report based sticky notes
function tb_create_report_sticky(jId, rptIdentifier) {
  var params = $H( { form_type: 'create_report_sticky_note',
		     rpt_identifier: rptIdentifier,
        	     j_id: jId
                   } );
  
  new Ajax.Request(bref + "/cgi-bin/main.plex",
	           { method: 'post', parameters: params.toQueryString(), 
                     onSuccess:tb_do_create_report_sticky, 
                     onFail: function() { alert("Failed to create a sticky note"); } 
	           } );
}

function tb_do_create_report_sticky(r) {
  var txt = r.responseText;

  // note id, x, y, width, height, color, options
  var note = txt.split('|', 7);
  
  //TT17765 - no longer override at this point, passed in value is determined by a flag, should stay as-is
  // if ( note[4] < 400 ) {
    // note[4] = 400;
  // }
  // if ( note[3] < 250 ) {
    // note[3] = 250;
  // }

  var mynote = new EjpStickyNote(note[0], note[1], note[2], note[3], note[4], note[5], "", note[6], 1, "Title", "Note text");

  mynote.setEdit();

}

//TTS 17801
function tb_edit_ms_sticky(ms_id, ms_rev_no, j_id, note_id, from_notes_table) {
  var params = $H( { 
    form_type: 'edit_ms_sticky_note',
        ms_id: ms_id,
        ms_rev_no: ms_rev_no,
        j_id: j_id,
        note_id: note_id
        } );

  var tempCoor;
  var tempX;
  var randXOffset;

  if (from_notes_table != undefined) {
    //grab xy coordinates for decision letter table - add/edit notes should display at this height
    tempCoor = calculateXY('table_'+ms_id+'_'+ ms_rev_no);
    randXOffset = Math.floor((Math.random()*50)+1); 
    tempX = randXOffset + (screen.width/2);

    params.set('tempX', tempX);
    params.set('tempY', tempCoor[1]);
    params.set('from_notes_table', from_notes_table);    
  }

  new Ajax.Request(bref + "/cgi-bin/main.plex", { method: 'post', parameters: params.toQueryString(), 
                       onSuccess:tb_do_edit_ms_sticky, 
                       onFail: function() { alert("Failed to edit sticky note"); } });
}

//TTS 17801
function tb_do_edit_ms_sticky(r) { 
  var txt = r.responseText;

  var fromMsNotesTable, msId, msRevNo;
  var note = txt.split('|', 10);

  var mynote = new EjpStickyNote(note[0], note[1], note[2], note[3], note[4], note[5], note[6], "", 1, note[7], note[8]);

  var fromMsNotesTable = note[9].split('-', 2);  
  if (fromMsNotesTable != undefined) {
    //set the private flag var
    mynote.setFromNotesTable(fromMsNotesTable[0], fromMsNotesTable[1]);  
  }  

  mynote.setEdit();
}

//TTS 17801
/*calculate position of element on screen
  returns x, y coordinates*/
function calculateXY(objName) {
    var x;
    var y;
    obj = document.getElementById(objName);
    x = obj.offsetLeft; 
    y = obj.offsetTop;
    while (obj=obj.offsetParent)
        x += obj.offsetLeft;
    obj = document.getElementById(objName);
    while (obj=obj.offsetParent)
        y += obj.offsetTop;
    return [x,y];
}