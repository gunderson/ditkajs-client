// Triggers -------------------------------------------

function noop (){}

function triggerRange(x, px, start, end, onEntered, onLeft){
	onEntered = onEntered || noop;
	onLeft = onLeft || noop;
	if (hasEnteredRange(x, px, start, end)){
		onEntered();
	} else if (hasLeftRange(x, px, start, end)){
		onLeft();
	}
}

function isBetween(x, start, end){
	if (end < start){
		var t = start;
		start = end;
		end = t;
	}
	return x >= start && x < end;
}
	
function hasEnteredRange(x, px, start, end){ 
	// if it is now between and was not between
	return isBetween(x, start, end) && !isBetween(px, start, end);
}

function hasLeftRange(x, px, start, end){
	// if it was between and is now not between
	return isBetween(px, start, end) && !isBetween(x, start, end);
}

function hasHoppedTheRange(x, px, start, end){
	// if px is below the range and x is above the range
	// or
	// if px is above the range and x is below the range
	return (px < start && x >= end) || (px >= end && x < start);
}

function triggerPoint(x, px, target, onCrossing){
	onCrossing = onCrossing || noop;
	if ((x >= target && px < target) || (x <= target && px > target)){
		onCrossing();
		return true;
	}
	return false;
}

function triggerPointForward(x, px, target, onCrossing){
	onCrossing = onCrossing || noop;
	if (x >= target && px < target){
		onCrossing();
		return true;
	}
	return false;
}

function triggerPointReverse(x, px, target, onCrossing){
	onCrossing = onCrossing || noop;
	if (x <= target && px > target){
		onCrossing();
		return true;
	}
	return false;
}

if (module && module.exports){
	module.exports = {
		triggerRange: triggerRange,
		isBetween: isBetween,
		hasEnteredRange: hasEnteredRange,
		hasLeftRange: hasLeftRange,
		hasHoppedTheRange: hasHoppedTheRange,
		triggerPoint: triggerPoint,
		triggerPointForward: triggerPointForward,
		triggerPointReverse: triggerPointReverse,
	};
}