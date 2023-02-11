findCard = (function(oldFindCard) {
    return function newFindCard(arr, hand, grave) {
        arr = [...arr];
        if(arr.indexOf("Set Rotation") !== -1) {
            arr.push("Expeditioning");
        }
        return oldFindCard(arr, hand, grave);
    };
})(findCard);