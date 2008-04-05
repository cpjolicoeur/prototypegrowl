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
	
	create: function(class_names) {
		var elem = new Element('div', { 'class': class_names }).hide();
		elem.insert({ bottom: new Element('img') });
		elem.insert({ bottom: new Element('h3') });
		elem.insert({ bottom: new Element('p') });
		document.body.insert({ bottom: elem });
		
		return elem;
	},
	
	show: function(elem, options) {
		if (this.options.animated)
			new Effect.Appear(elem, { duration: this.options.animated });
		else
			elem.show();
		
		if (this.options.autohide)
			this.hide.bind(this, elem).delay(options.autohide);
		else {
			elem.observe('click', function(event) {
				this.hide(event.findElement('div'));
			}.bindAsEventListener(this));
		}
	},
	
	hide: function(elem) {
		if (this.options.animated) {
			new Effect.Fade(elem, { 
				duration:            this.options.animated, 
				afterFinishInternal: elem.remove.bind(elem)
			})
		} else
			elem.remove();
	}
});

Growl.Smoke = Class.create(Growl.Base, {
	cache:    $H({}),
	from_top: 0,
	
	show: function($super) {
		var options  = Object.extend(this.options, arguments[1] || {});
		var elem = this.create(options.class_names || 'growl-smoke');
		
		var delta = document.viewport.getScrollOffsets()[1] + this.from_top;
		elem.setStyle({ top: delta+'px' });
		
		elem.down('img').setAttribute('src', options.image);
		elem.down('h3').update(options.title);
		elem.down('p').update(options.text);
		
		this.from_top += elem.getHeight();
		this.cache.set(elem.identify(), true);
		
		$super(elem, options);
	},
	
	hide: function($super, elem) {
		$super(elem);
		this.cache.unset(elem.identify());
		
		if (this.cache.keys().length == 0)
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
