var Growl = {};
Growl.Base = Class.create({
	
	options: {
		image: 'http://www.icebeat.bitacoras.com/public/mootools/growl/growl.jpg',
		title: 'Window.Growl by Daniel Mota',
		text: 'http://icebeat.bitacoras.com',
		duration: 2
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
			'z-index':  '999',
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
		block_elem.show();
		this.hide.bind(this).delay(options.duration);
	},
	
	hide: function(elem) {
		elem.hide();
	}
	
});

Growl.Smoke = Class.create(Growl.Base, {
	initialize: function($super) {
		this.queue = [];
		$super(arguments[1] || 'http://www.icebeat.bitacoras.com/public/mootools/growl/smoke.png', {
			div: { width: '298px', height: '73px' },
			img: { float: 'left', margin: '12px;' },
			h3:  { margin: 0, padding: '10px 0', 'font-size': '13px' },
			p:   { margin: '0 10px', 'font-size': '12px' }
		});
	},
	
	show: function($super) {
		var options  = Object.extend(this.options, arguments[0] || {});
		block_elem = this.create();
		
		var delta = document.viewport.getScrollOffsets()[1]+10+((this.queue.length)*83);
		block_elem.setStyle({ 'top':delta+'px', 'right':'10px', 'display':'block'});
		
		block_elem.down('img').setAttribute('src', options.image);
		block_elem.down('h3').update(options.title);
		block_elem.down('p').update(options.text);
		
		this.queue.push(block_elem);
		$super(block_elem, options);
	},
	
	hide: function($super) {
		var elem = this.queue.shift();
		$super(elem);
		elem.remove();
	}
});
