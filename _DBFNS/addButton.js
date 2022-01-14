function addButton(btn, callback) {
	var name = btn.attr('class');
	if (!name) {
		name = btn.attr('id');
	}
	else {
		if (name.indexOf(' ') >= 0) {
			name = name.substring(0, name.indexOf(' '));
		}
		if (name.indexOf('btn') < 0) {
			name = btn.attr('id');
		}
	}
	var img = btn.find('img').last();
	btn.css("cursor", "pointer");
	var path = IMAGES_START + 'svg/';
	var ext = '.svg';
	var src = img.attr('src');
	if (img.attr('data-src')) {
		src = img.attr('data-src');
	}
	if (img.length > 0 && src.indexOf('.svg') < 0) {
		path = IMAGES_START;
		ext = src.substring(src.length - 4, src.length);
	}
	if (img.length > 0 && src.indexOf('_up.') >= 0) {
		btn.mouseout(function(){
			$(this).find('img').last().attr('src', path + name + '_up' + ext);
		});
		btn.mouseenter(function(){
			img.attr('src', path + name + '_over' + ext);
		});
		if (mobile) {
			btn.mouseup(function(){
				img.attr('src', path + name + '_up' + ext);
			});
		}
		else {
			btn.mouseup(function(){
				img.attr('src', path + name + '_over' + ext);
			});
		}
		btn.mousedown(function(e){
			e.preventDefault(); // prevents unwanted text selection
			img.attr('src', path + name + '_down' + ext);
		});
	}
	if (callback) {
		btn.click(callback);
	}
}