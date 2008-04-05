// prototypeGrowl - Growl for Prototype
//
// Thomas Reynolds <tdreyno@gmail.com - http://github.com/tdreyno>
// Craig P Jolicoeur <cpjolicoeur@gmail.com - http://github.com/cpjolicoeur>
// 
// Copyright (c) 2008 Thomas Reynolds, Craig P Jolicoeur
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// --------------------------------------------------------------------------

var Growl = {};
Growl.Base = Class.create({
	options: {
		image:   'growl.jpg',
		title:   'Default popup title',
		text:    'Lorem ipsum, whatever',
		autohide: 2,
		animated: 0.75
	},
	
	initialize: function(background) {
		this.background = background;
		this.styles     = arguments[1] || {};
		
		var image = new Image;
		image.src = this.background;
	},
	
	create: function() {
		var block_elem = new Element('div').hide().setStyle(Object.extend({
			position:   'absolute',
			zIndex:     '999',
			color:      '#fff',
			font:       '12px/14px "Lucida Grande", Arial, Helvetica, Verdana, sans-serif',
			background: 'url(' + this.background + ') no-repeat'
		}, this.styles.div || {}));
		document.body.insert({ bottom: block_elem });
		
		$A([
			new Element('img').setStyle(this.styles.img), 
			new Element('h3').setStyle(this.styles.h3),
			new Element('p').setStyle(this.styles.p) 
		]).each(function(elem) {
			block_elem.insert({ bottom: elem });
		}.bind(this));
		
		return block_elem;
	},
	
	show: function(block_elem, options) {
		if (this.options.animated)
			new Effect.Appear(block_elem, { duration: this.options.animated });
		else
			block_elem.show();
		
		if (this.options.autohide)
			this.hide.bind(this).delay(options.autohide);
		else
			block_elem.observe('click', this.hide.bindAsEventListener(this));
	},
	
	hide: function(elem) {
		if (this.options.animated)
			new Effect.FadeAndRemove(elem, { duration: this.options.animated });
		else {
			elem.remove();
		}
	}
});

Growl.Smoke = Class.create(Growl.Base, {
	initialize: function($super) {
		this.queue = [];
		this.from_top = 0;
		$super(arguments[1] || 'smoke.png', {
			div: { width: '298px', height: '73px', right: '10px' },
			img: { float: 'left', margin: '12px' },
			h3:  { margin: 0, padding: '10px 0', 'font-size': '13px' },
			p:   { margin: '0 10px', 'font-size': '12px' }
		});
	},
	
	show: function($super) {
		var options  = Object.extend(this.options, arguments[1] || {});
		block_elem = this.create();
		
		var delta = document.viewport.getScrollOffsets()[1] + 10 + this.from_top;
		block_elem.setStyle({ top: delta+'px' });
		
		block_elem.down('img').setAttribute('src', options.image);
		block_elem.down('h3').update(options.title);
		block_elem.down('p').update(options.text);
		
		this.from_top += 83;
		this.queue.push(block_elem);
		$super(block_elem, options);
	},
	
	hide: function($super) {
		var elem = this.queue.shift();
		$super(elem);
		// elem.remove(); TODO: we do need to remove the div when we are done
		
		if (this.queue.length == 0)
			this.from_top = 0;
	}
});

/*
Gr0wl.Bezel = Class.create(Gr0wl.Base, {
	create: function() {
		this.i=0;
		this.parent({
			div: 'width:211px;height:206px;text-align:center;',
			img: 'margin-top:25px;',
			h3: 'margin:0;padding:0px;padding-top:22px;font-size:14px;',
			p: 'margin:15px;font-size:12px;'
		});
	},
	
	show: function(options) {
		var top = window.getScrollTop()+(window.getHeight()/2)-105,
		left = window.getScrollLeft()+(window.getWidth()/2)-103;
		options.position = {'top':top+'px', 'left':left+'px', 'display':'block'};
		this.i++;
		this.chain(this.parent.pass(options,this));
		if(this.i==1) this.callChain();
	},
	
	hide: function(elements) {
		this.queue.delay(400,this);
		this.parent(elements, { 'opacity': 0, 'margin-top': [0,50] });
	},
	
	queue: function() {
		this.i--;
		this.callChain();
	}
});

Gr0wl.Bezel.implement(new Chain);
*/

Effect.FadeAndRemove = function(element) {
  element = $(element);
  var oldOpacity = element.getInlineOpacity();
  var options = Object.extend({
    from: element.getOpacity() || 1.0,
    to:   0.0,
    afterFinishInternal: function(effect) { 
      if (effect.options.to!=0) return;
      effect.element.remove();
    }
  }, arguments[1] || { });
  return new Effect.Opacity(element,options);
};

