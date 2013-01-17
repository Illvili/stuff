var map = [
	[0, 1, 0, 0, 0],
	[0, 1, 0, 0, 0],
	[0, 0, 0, 1, 0],
	[1, 0, 0, 1, 0],
	[0, 0, 1, 1, 0]
];
var _map;
var width = map.length;
var height = map[0].length;
var directions = [
	[-1,  0], /* up */
	[ 0,  1], /* right */
	[ 1,  0], /* down */
	[ 0, -1]  /* left */
];
var pathName = ['↑', '→', '↓', '←'];
var path = [];

var startPoint = [0, 0];
var endPoint = [4, 4];
var limitTurns = 10;

_map = map;
console.warn('地图(' + width + '×' + height + '):');
_OutputMap(startPoint);
console.log('共有' + limitTurns + '次转弯限制');
console.log('○: 从这里出发');
console.log('★: 目标点');
console.log('■: 无法通行');
console.warn('输入 \'Find()\' 开始');


function Find() {
	var isFind = false;
	
	for (var i = 0; i < directions.length; i++) {
		isFind = SearchPath(startPoint, endPoint, i, 0);
		if (isFind) break;
	}
	
	if (isFind) {
		OutputPath(path);
	} else {
		console.error('没有到达目标点的路径或转弯次数限制');
	}
}

function _OutputMap(cp) {
	var strs = [];
	
	for (var i = 0; i < map.length; i++) {
		var line = [];
		
		for (var j = 0; j < map[i].length; j++) {
			if (1 == map[i][j]) {
				line.push('■');
			} else {
				if (i == endPoint[1] && j == endPoint[0]) {
					line.push('★');
				} else if (i == cp[1] && j == cp[0]) {
					line.push('○');
				} else if (0 == map[i][j]) {
					line.push('0');
				} else {
					line.push(_map[i][j]);
				}
			}
		};
		
		strs.push(line.join(' '));
	};
	
	console.log(strs.join('\n'));
}

function OutputMap() {
	var strs = [];
	
	for (var i = 0; i < map.length; i++) {
		strs.push(map[i].join(' '));
	};
	
	console.log(strs.join('\n'));
}

function OutputPath(path) {
	var _path = [];
	
	for (var i = 0; i  < path.length; i ++) {
		_path.unshift(pathName[path[i]]);
	};
	
	console.warn('Path:' + _path.join(''));
}

function GoDirection(sp, dir) {
	return [sp[0] + directions[dir][1], sp[1] + directions[dir][0]];
}

function isEqualPoint(p1, p2) {
	return p1[0] == p2[0] && p1[1] == p2[1];
}

function isValidPoint(p) {
	return p[1] >= 0 && p[1] < width
		&& p[0] >= 0 && p[0] < height
		&& 0 == _map[p[1]][p[0]];
}

function SearchPath(sp, ep, dir, turns) {
	console.log('SearchPath([' + sp.join() + '], [' + ep.join() + '], ' + pathName[dir] + ', ' + turns + ')');
	
	var cp = GoDirection(sp, dir);
	if (!isValidPoint(cp)) {
		return false;
	}
	
	_map[sp[1]][sp[0]] = pathName[dir];
	path.unshift(dir);
	console.log('[' + cp.join() + ']');
	// OutputPath(path);
	_OutputMap(cp);
	if (isEqualPoint(cp, ep)) {
		console.warn('到达!');
		return true;
	}
	
	if (turns == limitTurns) {
		_map[sp[1]][sp[0]] = 0;
		path.shift();
		console.info('turns cannot large 8 times');
		return false;
	}
	
	var dirs = [];
	switch (dir) {
		case 0:
		case 2:
			dirs.unshift(3); dirs.unshift(1);
			break;
		case 1:
		case 3:
			dirs.unshift(0); dirs.unshift(2);
			break;
	}
	dirs.unshift(dir);
	
	for (var i = 0; i < dirs.length; i++) {
		var isFind = SearchPath(cp, ep, dirs[i], dirs[i] == dir ? turns : turns + 1);
		if (isFind) return true;
	}
	
	_map[sp[1]][sp[0]] = 0;
	path.shift();
	return false;
}